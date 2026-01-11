-- =============================================
-- Dashboard & Analytics Stored Procedures
-- =============================================
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
    
    WITH MonthlyStats AS (
      SELECT 
          c.id,
          c.name,
          MAX(m.utility_type) as utility_type,
          SUM(CASE 
              WHEN r.reading_date >= DATEADD(month, DATEDIFF(month, 0, GETUTCDATE()), 0) 
              THEN r.consumption ELSE 0 END) as current_consumption,
          SUM(CASE 
              WHEN r.reading_date >= DATEADD(month, DATEDIFF(month, 0, GETUTCDATE()) - 1, 0)
               AND r.reading_date < DATEADD(month, DATEDIFF(month, 0, GETUTCDATE()), 0)
              THEN r.consumption ELSE 0 END) as prev_consumption
      FROM Customers c
      JOIN Meters m ON c.id = m.customer_id
      JOIN Readings r ON m.id = r.meter_id
      WHERE r.reading_date >= DATEADD(month, DATEDIFF(month, 0, GETUTCDATE()) - 1, 0)
      GROUP BY c.id, c.name
    )
    SELECT TOP (@limit)
      name,
      utility_type,
      current_consumption,
      prev_consumption
    FROM MonthlyStats
    ORDER BY current_consumption DESC;
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
        a.created_at as time
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

-- =============================================
-- Payment Statistics Stored Procedures
-- =============================================
CREATE OR ALTER PROCEDURE sp_GetPaymentStats
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ISNULL(SUM(CASE WHEN CAST(payment_date AS DATE) = CAST(GETUTCDATE() AS DATE) THEN amount ELSE 0 END), 0) as today,
        ISNULL(SUM(CASE WHEN CAST(payment_date AS DATE) = CAST(DATEADD(DAY, -1, GETUTCDATE()) AS DATE) THEN amount ELSE 0 END), 0) as yesterday
    FROM Payments WHERE status = 'completed';
    
    SELECT ISNULL(SUM(amount), 0) as total
    FROM Payments
    WHERE status = 'completed'
      AND MONTH(payment_date) = MONTH(GETUTCDATE())
      AND YEAR(payment_date) = YEAR(GETUTCDATE());
    
    SELECT 
        ISNULL(SUM(amount), 0) as amount,
        COUNT(*) as count
    FROM Payments WHERE status = 'pending';
END;
GO

-- =============================================
-- Extended Reporting Stored Procedures
-- =============================================
CREATE OR ALTER PROCEDURE sp_GetRevenueReport
    @startDate DATE = NULL,
    @endDate DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        FORMAT(b.created_at, 'MMM yyyy') as month,
        SUM(b.total_amount) as revenue,
        SUM(b.total_amount) * 1.15 as target
    FROM Bills b
    WHERE b.status = 'paid'
      AND (@startDate IS NULL OR b.created_at >= @startDate)
      AND (@endDate IS NULL OR b.created_at <= @endDate)
    GROUP BY FORMAT(b.created_at, 'MMM yyyy'), YEAR(b.created_at), MONTH(b.created_at)
    ORDER BY YEAR(b.created_at), MONTH(b.created_at);
END;
GO

CREATE OR ALTER PROCEDURE sp_GetConsumptionReport
    @startDate DATE = NULL,
    @endDate DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        FORMAT(reading_date, 'MMM yyyy') as month,
        SUM(consumption) as consumption,
        SUM(consumption) * 1.1 as target
    FROM Readings
    WHERE (@startDate IS NULL OR reading_date >= @startDate)
      AND (@endDate IS NULL OR reading_date <= @endDate)
    GROUP BY FORMAT(reading_date, 'MMM yyyy'), YEAR(reading_date), MONTH(reading_date)
    ORDER BY YEAR(reading_date), MONTH(reading_date);
END;
GO

CREATE OR ALTER PROCEDURE sp_GetCustomerReport
    @startDate DATE = NULL,
    @endDate DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        FORMAT(created_at, 'MMM yyyy') as month,
        COUNT(*) as customers,
        COUNT(*) + 5 as target
    FROM Customers
    WHERE status != 'inactive'
      AND (@startDate IS NULL OR created_at >= @startDate)
      AND (@endDate IS NULL OR created_at <= @endDate)
    GROUP BY FORMAT(created_at, 'MMM yyyy'), YEAR(created_at), MONTH(created_at)
    ORDER BY YEAR(created_at), MONTH(created_at);
END;
GO

CREATE OR ALTER PROCEDURE sp_GetDefaultersReport
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        COALESCE(NULLIF(SUBSTRING(c.address, CHARINDEX(',', c.address) + 1, LEN(c.address)), ''), 'Other') as region,
        COUNT(DISTINCT c.id) as defaulters,
        SUM(b.total_amount) as outstanding,
        COUNT(b.id) as bill_count
    FROM Customers c
    INNER JOIN Bills b ON c.id = b.customer_id
    WHERE b.status IN ('overdue', 'generated', 'sent') 
      AND b.due_date < GETUTCDATE()
    GROUP BY SUBSTRING(c.address, CHARINDEX(',', c.address) + 1, LEN(c.address))
    ORDER BY outstanding DESC;
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