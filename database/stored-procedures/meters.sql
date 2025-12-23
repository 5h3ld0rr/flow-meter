CREATE OR ALTER PROCEDURE sp_GetMeters
    @utilityType NVARCHAR(50) = NULL,
    @customerId NVARCHAR(50) = NULL -- String ID input
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT m.id, m.meter_id, m.serial_number, m.customer_id, m.utility_type, 
           m.location, m.status, m.install_date, m.last_reading_value, 
           m.last_reading_date, m.created_at, m.updated_at,
           c.name as customer_name,
           c.customer_id as customer_display_id -- For UI
    FROM Meters m
    INNER JOIN Customers c ON m.customer_id = c.id
    WHERE (@utilityType IS NULL OR @utilityType = 'all' OR m.utility_type = @utilityType)
      AND (@customerId IS NULL OR c.customer_id = @customerId) -- Filter by String ID via Join
    ORDER BY m.created_at DESC;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetMeterById
    @id NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT m.*, c.name as customer_name, c.email as customer_email, c.customer_id as customer_display_id
    FROM Meters m
    INNER JOIN Customers c ON m.customer_id = c.id
    WHERE m.meter_id = @id;
END;
GO

CREATE OR ALTER PROCEDURE sp_CheckSerialNumberExists
    @serialNumber NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) as count 
    FROM Meters 
    WHERE serial_number = @serialNumber;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetMeterCount
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) as count 
    FROM Meters;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetMeterLastReading
    @meterId NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT last_reading_value, customer_id 
    FROM Meters 
    WHERE meter_id = @meterId;
END;
GO

CREATE OR ALTER PROCEDURE sp_CreateMeter
    -- Removed meterId
    @serialNumber NVARCHAR(100),
    @customerId NVARCHAR(50), -- Takes String ID
    @utilityType NVARCHAR(50),
    @location NVARCHAR(MAX),
    @installDate DATE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @custIntId INT;
    SELECT @custIntId = id FROM Customers WHERE customer_id = @customerId;

    IF @custIntId IS NULL
        THROW 50000, 'Customer not found', 1;
    
    INSERT INTO Meters (serial_number, customer_id, utility_type, location, install_date, status)
    VALUES (@serialNumber, @custIntId, @utilityType, @location, @installDate, 'active');
END;
GO

CREATE OR ALTER PROCEDURE sp_UpdateMeter
    @meter_id NVARCHAR(50),
    @serial_number NVARCHAR(100),
    @customer_id NVARCHAR(50), -- String ID
    @utility_type NVARCHAR(50),
    @location NVARCHAR(MAX),
    @install_date DATE,
    @status NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @custIntId INT;
    SELECT @custIntId = id FROM Customers WHERE customer_id = @customer_id;
    
    UPDATE Meters 
    SET serial_number = @serial_number,
        customer_id = @custIntId,
        utility_type = @utility_type,
        location = @location,
        install_date = @install_date,
        status = @status,
        updated_at = GETUTCDATE()
    WHERE meter_id = @meter_id;
END;
GO

CREATE OR ALTER PROCEDURE sp_DeleteMeter
    @id NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Meters 
    SET status = 'inactive', 
        updated_at = GETUTCDATE() 
    WHERE meter_id = @id;
END;
GO

CREATE OR ALTER PROCEDURE sp_UpdateMeterLastReading
    @meterId INT, -- Expects Internal ID 
    @readingValue DECIMAL(18,2),
    @readingDate DATETIME2
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Meters
    SET last_reading_value = @readingValue,
        last_reading_date = @readingDate,
        updated_at = GETUTCDATE()
    WHERE id = @meterId;
END;
GO
