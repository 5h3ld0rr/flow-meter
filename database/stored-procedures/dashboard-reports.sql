CREATE OR ALTER PROCEDURE sp_GetDashboardStats
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        COUNT(*) as total,
        (SELECT COUNT(*) FROM Customers WHERE created_at >= DATEADD(MONTH, -1, GETUTCDATE())) as last_month
    FROM Customers WHERE status = 'active';
    
    SELECT 
        COUNT(*) as total,
        (SELECT COUNT(*) FROM Meters WHERE created_at >= DATEADD(MONTH, -1, GETUTCDATE())) as last_month
    FROM Meters WHERE status = 'active';
    
    SELECT ISNULL(SUM(total_amount), 0) as total
    FROM Bills
    WHERE status = 'paid'
      AND MONTH(created_at) = MONTH(GETUTCDATE())
      AND YEAR(created_at) = YEAR(GETUTCDATE());
      
    SELECT ISNULL(SUM(total_amount), 0) as total
    FROM Bills
    WHERE status IN ('generated', 'sent', 'overdue');
END;
GO

CREATE OR ALTER PROCEDURE sp_GetConsumptionTrend
    @days INT = 7
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        FORMAT(r.reading_date, 'ddd') as day,
        ISNULL(SUM(CASE WHEN m.utility_type = 'electricity' THEN r.consumption ELSE 0 END), 0) as electricity,
        ISNULL(SUM(CASE WHEN m.utility_type = 'water' THEN r.consumption ELSE 0 END), 0) as water,
        ISNULL(SUM(CASE WHEN m.utility_type = 'gas' THEN r.consumption ELSE 0 END), 0) as gas
    FROM Readings r
    INNER JOIN Meters m ON r.meter_id = m.id
    WHERE r.reading_date >= DATEADD(YEAR, -2, GETUTCDATE())
    GROUP BY CAST(r.reading_date AS DATE), FORMAT(r.reading_date, 'ddd')
    ORDER BY CAST(r.reading_date AS DATE);
END;
GO

CREATE OR ALTER PROCEDURE sp_GetTopConsumers
    @limit INT = 5
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP (@limit)
        c.name,
        SUM(r.consumption) as total_consumption,
        MAX(m.utility_type) as utility_type
    FROM Customers c
    INNER JOIN Meters m ON c.id = m.customer_id
    INNER JOIN Readings r ON m.id = r.meter_id -- fixed joins
    WHERE r.reading_date >= DATEADD(YEAR, -2, GETUTCDATE())
    GROUP BY c.id, c.name
    ORDER BY total_consumption DESC;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetRecentActivities
    @limit INT = 10
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP (@limit)
        a.id,
        a.activity_type,
        a.description,
        c.name as customer,
        a.amount,
        dbo.TimeAgo(a.created_at) as time
    FROM Activities a
    LEFT JOIN Customers c ON a.customer_id = c.id
    ORDER BY a.created_at DESC;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetUtilityDistribution
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        utility_type,
        COUNT(*) as count
    FROM Meters
    GROUP BY utility_type;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetRevenueReport
    @startDate DATE = NULL,
    @endDate DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        FORMAT(b.created_at, 'MMM yyyy') as month,
        SUM(b.total_amount) as revenue,
        50 as target
    FROM Bills b
    WHERE b.status = 'paid'
      AND (@startDate IS NULL OR b.created_at >= @startDate)
      AND (@endDate IS NULL OR b.created_at <= @endDate)
    GROUP BY FORMAT(b.created_at, 'MMM yyyy') 
    ORDER BY month;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetRegionalReport
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        SUBSTRING(c.address, CHARINDEX(',', c.address) + 1, LEN(c.address)) as region,
        COUNT(DISTINCT c.id) as customers,
        COALESCE(SUM(r.consumption), 0) as consumption,
        COALESCE(SUM(b.total_amount), 0) as revenue
    FROM Customers c
    LEFT JOIN Meters m ON c.id = m.customer_id
    LEFT JOIN Readings r ON m.id = r.meter_id
    LEFT JOIN Bills b ON c.id = b.customer_id AND b.status = 'paid'
    GROUP BY SUBSTRING(c.address, CHARINDEX(',', c.address) + 1, LEN(c.address))
    ORDER BY revenue DESC;
END;
GO
