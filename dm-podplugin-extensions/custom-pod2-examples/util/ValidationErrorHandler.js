sap.ui.define([], () => {
    "use strict";

    /**
     * Centralized validation and error handling utility
     * Provides reusable validation methods with consistent error messages
     */
    class ValidationErrorHandler {

        /**
         * Validates that a value is not empty
         * @param {*} value - Value to validate
         * @param {string} fieldName - Name of the field for error message
         * @throws {Error} If value is empty
         */
        static validateNotEmpty(value, fieldName) {
            if (!value) {
                throw new Error(`${fieldName} cannot be empty`);
            }
        }

        /**
         * Validates that an object is valid
         * @param {*} obj - Object to validate
         * @param {string} objectName - Name of the object for error message
         * @throws {Error} If object is invalid
         */
        static validateObject(obj, objectName) {
            if (!obj || typeof obj !== 'object') {
                throw new Error(`Invalid ${objectName}`);
            }
        }

        /**
         * Validates filter value against whitelist pattern
         * Prevents SQL/OData injection by allowing only safe characters
         * @param {string} value - Value to validate
         * @param {string} fieldName - Name of the field for error message
         * @returns {string} Sanitized value
         * @throws {Error} If value contains illegal characters or exceeds length
         */
        static validateFilterValue(value, fieldName) {
            this.validateNotEmpty(value, fieldName);

            // Convert to string and escape single quotes
            const sanitized = String(value).replace(/'/g, "''");

            // Validate against whitelist: only allow alphanumeric, dash, underscore, and space
            if (!/^[a-zA-Z0-9_\-\s]+$/.test(sanitized)) {
                throw new Error(`Invalid ${fieldName}: contains illegal characters`);
            }

            // Additional length check to prevent excessively long values
            if (sanitized.length > 100) {
                throw new Error(`${fieldName} exceeds maximum length of 100 characters`);
            }

            return sanitized;
        }

        /**
         * Validates URL to prevent path traversal and SSRF attacks
         * @param {string} url - URL to validate
         * @param {string} fieldName - Name of the field for error message
         * @returns {string} Validated URL
         * @throws {Error} If URL is invalid or contains security risks
         */
        static validateUrl(url, fieldName = "URL") {
            this.validateNotEmpty(url, fieldName);

            const trimmed = String(url).trim();

            // Prevent path traversal
            if (trimmed.includes("..") || trimmed.includes("//")) {
                throw new Error(`Invalid ${fieldName}: path traversal detected`);
            }

            // Prevent access to internal/localhost addresses (SSRF protection)
            const forbiddenPatterns = [
                /localhost/i,
                /127\.0\.0\.1/,
                /0\.0\.0\.0/,
                /::1/,
                /169\.254\./,  // Link-local
                /10\./,        // Private network
                /172\.(1[6-9]|2[0-9]|3[0-1])\./,  // Private network
                /192\.168\./   // Private network
            ];

            if (forbiddenPatterns.some(pattern => pattern.test(trimmed))) {
                throw new Error(`Invalid ${fieldName}: access to internal addresses not allowed`);
            }

            // Ensure URL starts with /
            return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
        }

        /**
         * Validates destination against whitelist
         * @param {string} destination - Destination name
         * @param {Array<string>} allowedDestinations - List of allowed destinations
         * @returns {string|null} Validated destination or null if empty
         * @throws {Error} If destination is not in whitelist
         */
        static validateDestination(destination, allowedDestinations) {
            if (!destination) {
                return null;
            }

            const trimmed = String(destination).trim();

            if (!allowedDestinations.includes(trimmed)) {
                throw new Error(
                    `Destination '${trimmed}' is not in the allowed list. ` +
                    `Allowed destinations: ${allowedDestinations.join(", ")}`
                );
            }

            return trimmed;
        }

        /**
         * Validates context path for POD Context
         * @param {string} path - Context path to validate
         * @param {string} fieldName - Name of the field for error message
         * @returns {string} Validated path
         * @throws {Error} If path contains illegal characters
         */
        static validateContextPath(path, fieldName = "Context path") {
            this.validateNotEmpty(path, fieldName);

            const trimmed = String(path).trim();

            // Only allow alphanumeric, underscore, and forward slash
            if (!/^[a-zA-Z0-9_/]+$/.test(trimmed)) {
                throw new Error(`Invalid ${fieldName}: contains illegal characters`);
            }

            return trimmed;
        }

        /**
         * Validates JSON string
         * @param {string} jsonString - JSON string to validate
         * @param {string} fieldName - Name of the field for error message
         * @returns {Object} Parsed JSON object
         * @throws {Error} If JSON is invalid
         */
        static validateJson(jsonString, fieldName = "JSON payload") {
            try {
                return JSON.parse(jsonString);
            } catch (e) {
                throw new Error(`Invalid ${fieldName}: ${e.message}`);
            }
        }

        /**
         * Validates and constrains page size
         * @param {number} pageSize - Requested page size
         * @param {number} min - Minimum allowed page size
         * @param {number} max - Maximum allowed page size
         * @param {number} defaultSize - Default page size if invalid
         * @returns {number} Validated page size
         */
        static validatePageSize(pageSize, min = 1, max = 100, defaultSize = 50) {
            if (!pageSize || typeof pageSize !== 'number') {
                return defaultSize;
            }

            return Math.min(Math.max(pageSize, min), max);
        }

        /**
         * Validates column field configuration
         * @param {string} field - Field name
         * @param {Array<string>} allowedFields - List of allowed fields
         * @throws {Error} If field is not supported
         */
        static validateColumnField(field, allowedFields) {
            if (!allowedFields.includes(field)) {
                throw new Error(`Column field '${field}' is not supported`);
            }
        }

        /**
         * Creates a user-friendly error message based on HTTP status
         * @param {Error} error - Original error
         * @param {string} defaultMessage - Default message if status not recognized
         * @returns {string} User-friendly error message
         */
        static getUserFriendlyErrorMessage(error, defaultMessage = "An error occurred") {
            if (error.message === "Request timeout") {
                return "Request timed out. Please try again.";
            }

            const status = error.status || error.statusCode;

            switch (status) {
                case 400:
                    return "Invalid request. Please check your input.";
                case 401:
                    return "Authentication required.";
                case 403:
                    return "Access denied to resource.";
                case 404:
                    return "Resource not found.";
                case 408:
                    return "Request timeout. Please try again.";
                case 429:
                    return "Too many requests. Please wait and try again.";
                case 500:
                case 502:
                case 503:
                case 504:
                    return "Service unavailable. Please try again later.";
                default:
                    return defaultMessage;
            }
        }
    }

    return ValidationErrorHandler;
});