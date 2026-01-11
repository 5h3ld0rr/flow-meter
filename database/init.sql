
CREATE LOGIN FlowMeter WITH PASSWORD = 'passwordhere';

CREATE DATABASE FlowMeter;

USE FlowMeter;

CREATE USER FlowMeter FOR LOGIN FlowMeter;

ALTER ROLE db_owner ADD MEMBER FlowMeter;