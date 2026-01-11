CREATE OR ALTER TRIGGER trg_Customer_AfterInsert
ON Customers
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Activities (activity_type, description, customer_id, created_at)
    SELECT 
        'customer',
        'New customer registered: ' + i.name,
        i.id,
        GETUTCDATE()
    FROM inserted i;
END;
GO

CREATE OR ALTER TRIGGER trg_Customer_AfterUpdate
ON Customers
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Activities (activity_type, description, customer_id, created_at)
    SELECT 
        'customer',
        CASE 
            WHEN i.status = 'inactive' AND d.status != 'inactive' 
                THEN 'Customer deactivated: ' + i.name
            ELSE 'Customer information updated: ' + i.name
        END,
        i.id,
        GETUTCDATE()
    FROM inserted i
    INNER JOIN deleted d ON i.id = d.id
    WHERE i.status != 'inactive' OR (i.status = 'inactive' AND d.status != 'inactive');
END;
GO

CREATE OR ALTER TRIGGER trg_Meter_AfterInsert
ON Meters
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Activities (activity_type, description, customer_id, created_at)
    SELECT 
        'meter',
        'New ' + i.utility_type + ' meter assigned: ' + i.serial_number,
        i.customer_id,
        GETUTCDATE()
    FROM inserted i;
END;
GO

CREATE OR ALTER TRIGGER trg_Payment_AfterInsert
ON Payments
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Activities (activity_type, description, customer_id, amount, created_at)
    SELECT 
        'payment',
        'Payment received via ' + i.payment_method,
        i.customer_id,
        i.amount,
        GETUTCDATE()
    FROM inserted i;
END;
GO

CREATE OR ALTER TRIGGER trg_Bill_AfterInsert
ON Bills
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Activities (activity_type, description, customer_id, amount, created_at)
    SELECT 
        'billing',
        'New bill generated: ' + i.bill_id,
        i.customer_id,
        i.total_amount,
        GETUTCDATE()
    FROM inserted i;
END;
GO

CREATE OR ALTER TRIGGER trg_Meters_UpdateTimestamp
ON Meters
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE m
    SET updated_at = GETUTCDATE()
    FROM Meters m
    INNER JOIN inserted i ON m.id = i.id;
END;
GO
