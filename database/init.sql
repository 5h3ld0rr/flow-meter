CREATE DATABASE FlowMeter;
GO

USE FlowMeter;
GO

CREATE LOGIN FlowMeter WITH PASSWORD = 'passwordhere';
GO

CREATE USER FlowMeter FOR LOGIN FlowMeter;
GO

ALTER ROLE db_owner ADD MEMBER FlowMeter;
GO