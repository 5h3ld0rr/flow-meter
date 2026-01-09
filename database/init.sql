CREATE DATABASE FlowMeter;

CREATE LOGIN FlowMeter WITH PASSWORD = 'passwordhere';

CREATE USER FlowMeter FOR LOGIN FlowMeter;

ALTER ROLE db_owner ADD MEMBER FlowMeter;