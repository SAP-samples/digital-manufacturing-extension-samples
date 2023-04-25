CREATE DATABASE BootcampDB;
GO
USE BootcampDB;
GO
CREATE TABLE Users
(
    userId nvarchar(50) NOT NULL PRIMARY KEY,
    description nvarchar(255),
    personalId nvarchar(50) NOT NULL,
);
CREATE TABLE VarianceReasonCodes
(
    sfc nvarchar(50) NOT NULL PRIMARY KEY,
    varianceReasonCode nvarchar(50) NOT NULL,
    personnelId nvarchar(50) NOT NULL
);
GO
INSERT INTO Users
    (userId, description, personalId)
VALUES("tarang.gupta@sap.com", "tarang.gupta@sap.com", "456")
INSERT INTO Users
    (userId, description, personalId)
VALUES("wei.zhou03@sap.com", "wei.zhou03@sap.com", "123")
GO
