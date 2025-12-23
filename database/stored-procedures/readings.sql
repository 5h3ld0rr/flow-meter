CREATE OR ALTER PROCEDURE sp_GetReadings
    @meterId NVARCHAR(50) = NULL,
    @startDate DATE = NULL,
    @endDate DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT r.id, r.meter_id as meter_internal_id, r.reading_value, r.reading_date, r.consumption, 
           r.status, r.notes, r.created_by, r.created_at,
           m.meter_id as meter_id, -- Display ID
           m.serial_number as meter_serial, m.utility_type,
           c.name as customer_name
    FROM Readings r
    INNER JOIN Meters m ON r.meter_id = m.id
    INNER JOIN Customers c ON m.customer_id = c.id
    WHERE (@meterId IS NULL OR m.meter_id = @meterId)
      AND (@startDate IS NULL OR r.reading_date >= @startDate)
      AND (@endDate IS NULL OR r.reading_date <= @endDate)
    ORDER BY r.reading_date DESC;
END;
GO

CREATE OR ALTER PROCEDURE sp_CreateReading
    @meterId INT,
    @readingValue DECIMAL(18,2),
    @readingDate DATETIME2,
    @consumption DECIMAL(18,2),
    @notes NVARCHAR(MAX) = NULL,
    @userId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Readings (meter_id, reading_value, reading_date, consumption, status, notes, created_by)
    VALUES (@meterId, @readingValue, @readingDate, @consumption, 'submitted', @notes, @userId);
END;
GO
