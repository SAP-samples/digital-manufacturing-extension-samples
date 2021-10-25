CREATE DATABASE BootcampDB;
GO
USE BootcampDB;
GO
CREATE TABLE DCs
(
    RowID numeric(18,0) IDENTITY(1,1) NOT NULL PRIMARY KEY,
    SFC nvarchar(10) NOT NULL,
    TorqueLeftValue decimal(10,3) NOT NULL ,
    TorqueLeftLowerValue decimal(10,3) NOT NULL,
    TorqueLeftUpperValue decimal(10,3) NOT NULL,
    TorqueRightValue decimal(10,3) NOT NULL,
    TorqueRightLowerValue decimal(10,3) NOT NULL,
    TorqueRightUpperValue decimal(10,3) NOT NULL,
    Evaluation int NOT NULL,
    Count int NOT NULL,
);
GO
INSERT INTO DCs
    (SFC, TorqueLeftValue, TorqueLeftLowerValue, TorqueLeftUpperValue, TorqueRightValue, TorqueRightLowerValue, TorqueRightUpperValue, Evaluation, Count)
VALUES("EBC100005", 20, 40, 60, 88, 20, 80, 0, 1)
INSERT INTO DCs
    (SFC, TorqueLeftValue, TorqueLeftLowerValue, TorqueLeftUpperValue, TorqueRightValue, TorqueRightLowerValue, TorqueRightUpperValue, Evaluation, Count)
VALUES("EBC100005", 19, 40, 60, 89, 20, 80, 0, 2)
GO
