# Description
This is a sample code for advanced audit log viewer. There are 2 components 
 - Abstract service on top of BTP audit log service endpoint
 - Custom POD Plugin to consume the service above

# Step 1
Deploy the service **AuditLogMSExtension** in BTP

# Step 2
Create destination in DM SaaS tenant to consume the destination

# Step 3
Upload the UI **AuditlogUIExtension** as custom POD Plugin 