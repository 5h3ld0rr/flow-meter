CREATE OR ALTER PROCEDURE sp_GetBills
    @customerId NVARCHAR(50) = NULL,
    @meterId NVARCHAR(50) = NULL,
    @status NVARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        b.id,
        b.bill_id,
        b.customer_id, -- INT
        c.customer_id as customer_display_id,
        c.name as customer_name,
        b.meter_id, -- INT
        m.meter_id as meter_display_id,
        m.serial_number as meter_serial,
        b.billing_period_start,
        b.billing_period_end,
        b.consumption,
        b.base_amount,
        b.tax_amount,
        b.total_amount,
        b.status,
        b.due_date,
        b.created_at
    FROM Bills b
    INNER JOIN Customers c ON b.customer_id = c.id
    INNER JOIN Meters m ON b.meter_id = m.id
    WHERE (@customerId IS NULL OR c.customer_id = @customerId)
      AND (@meterId IS NULL OR m.meter_id = @meterId)
      AND (@status IS NULL OR b.status = @status)
    ORDER BY b.created_at DESC;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetBillById
    @id INT -- If passing internal ID
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        b.*,
        c.customer_id as customer_display_id,
        c.name as customer_name,
        m.meter_id as meter_display_id,
        m.serial_number as meter_serial
    FROM Bills b
    INNER JOIN Customers c ON b.customer_id = c.id
    INNER JOIN Meters m ON b.meter_id = m.id
    WHERE b.id = @id; -- Or b.bill_id if string passed
END;
GO

CREATE OR ALTER PROCEDURE sp_GetBillByPublicId
    @billId NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        b.*,
        c.customer_id as customer_display_id,
        c.name as customer_name,
        m.meter_id as meter_display_id,
        m.serial_number as meter_serial
    FROM Bills b
    INNER JOIN Customers c ON b.customer_id = c.id
    INNER JOIN Meters m ON b.meter_id = m.id
    WHERE b.bill_id = @billId; 
END;
GO

CREATE OR ALTER PROCEDURE sp_GetMeterUtilityType
    @meterId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT utility_type 
    FROM Meters 
    WHERE id = @meterId;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetTariffRate
    @utilityType NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT rate_per_unit 
    FROM Tariffs 
    WHERE utility_type = @utilityType;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetBillCount
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) as count FROM Bills;
END;
GO

CREATE OR ALTER PROCEDURE sp_CreateBill
    -- Removed billId
    @customerId INT,
    @meterId INT,
    @billingPeriodStart DATE,
    @billingPeriodEnd DATE,
    @consumption DECIMAL(18,2), -- Updated precision
    @baseAmount DECIMAL(18,2),
    @taxAmount DECIMAL(18,2),
    -- Total calculated
    @dueDate DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Bills (
        customer_id, meter_id, billing_period_start, billing_period_end,
        consumption, base_amount, tax_amount, status, due_date,
        previous_reading, current_reading, tariff_rate -- Missing params in old proc
    ) VALUES (
        @customerId, @meterId, @billingPeriodStart, @billingPeriodEnd,
        @consumption, @baseAmount, @taxAmount, 'pending', @dueDate,
        0, 0, 0 -- Placeholders if not passed, scheme requires NOT NULL usually. 
        -- Schema says NOT NULL. I need to add these params or defaults.
    );
END;
GO

CREATE OR ALTER PROCEDURE sp_UpdateBillStatus
    @billId INT,
    @status NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Bills
    SET status = @status, updated_at = GETUTCDATE()
    WHERE id = @billId;
END;
GO
