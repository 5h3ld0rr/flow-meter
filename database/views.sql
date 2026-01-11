-- Snapshot view for overall performance
IF OBJECT_ID('vw_UtilityPerformance', 'V') IS NOT NULL DROP VIEW vw_UtilityPerformance
GO

CREATE VIEW vw_UtilityPerformance AS
WITH UtilityCustomers AS (
    SELECT utility_type, COUNT(DISTINCT customer_id) as customers
    FROM Meters
    WHERE status = 'active'
    GROUP BY utility_type
),
UtilityConsumption AS (
    SELECT m.utility_type, ISNULL(SUM(r.consumption), 0) as consumption
    FROM Readings r
    JOIN Meters m ON r.meter_id = m.id
    GROUP BY m.utility_type
),
UtilityRevenue AS (
    SELECT m.utility_type, ISNULL(SUM(p.amount), 0) as revenue
    FROM Payments p
    JOIN Bills b ON p.bill_id = b.id
    JOIN Meters m ON b.meter_id = m.id
    GROUP BY m.utility_type
)
SELECT 
    uc.utility_type,
    uc.customers,
    ISNULL(ucon.consumption, 0) as consumption,
    ISNULL(ur.revenue, 0) as revenue
FROM UtilityCustomers uc
LEFT JOIN UtilityConsumption ucon ON uc.utility_type = ucon.utility_type
LEFT JOIN UtilityRevenue ur ON uc.utility_type = ur.utility_type
GO

-- Monthly stats for trend analysis
IF OBJECT_ID('vw_MonthlyUtilityStats', 'V') IS NOT NULL DROP VIEW vw_MonthlyUtilityStats
GO

CREATE VIEW vw_MonthlyUtilityStats AS
WITH MonthlyRevenue AS (
    SELECT 
        FORMAT(p.payment_date, 'yyyy-MM') as month_str,
        m.utility_type,
        SUM(p.amount) as revenue
    FROM Payments p
    JOIN Bills b ON p.bill_id = b.id
    JOIN Meters m ON b.meter_id = m.id
    GROUP BY FORMAT(p.payment_date, 'yyyy-MM'), m.utility_type
),
MonthlyConsumption AS (
    SELECT 
        FORMAT(r.reading_date, 'yyyy-MM') as month_str,
        m.utility_type,
        SUM(r.consumption) as consumption
    FROM Readings r
    JOIN Meters m ON r.meter_id = m.id
    GROUP BY FORMAT(r.reading_date, 'yyyy-MM'), m.utility_type
)
SELECT 
    COALESCE(r.month_str, c.month_str) as month_str,
    COALESCE(r.utility_type, c.utility_type) as utility_type,
    ISNULL(r.revenue, 0) as revenue,
    ISNULL(c.consumption, 0) as consumption
FROM MonthlyRevenue r
FULL OUTER JOIN MonthlyConsumption c 
    ON r.month_str = c.month_str AND r.utility_type = c.utility_type
GO

-- Defaulter Stats
IF OBJECT_ID('vw_DefaulterStats', 'V') IS NOT NULL DROP VIEW vw_DefaulterStats
GO

CREATE VIEW vw_DefaulterStats AS
SELECT 
  c.customer_id,
  c.name,
  1 as defaulters,
  c.balance as outstanding,
  (SELECT COUNT(*) FROM Bills b WHERE b.customer_id = c.id AND b.status = 'overdue') as bill_count
FROM Customers c
WHERE c.balance > 0
GO
