IF OBJECT_ID('vw_UtilityPerformance', 'V') IS NOT NULL DROP VIEW vw_UtilityPerformance
GO

CREATE VIEW vw_UtilityPerformance AS
SELECT 
  m.utility_type,
  COUNT(DISTINCT c.id) as customers,
  ISNULL(SUM(r.consumption), 0) as consumption,
  ISNULL(SUM(p.amount), 0) as revenue
FROM Meters m
LEFT JOIN Customers c ON m.customer_id = c.id
LEFT JOIN Readings r ON r.meter_id = m.id
LEFT JOIN Bills b ON b.customer_id = c.id AND b.meter_id = m.id
LEFT JOIN Payments p ON p.bill_id = b.id
GROUP BY m.utility_type
GO

IF OBJECT_ID('vw_DefaulterStats', 'V') IS NOT NULL DROP VIEW vw_DefaulterStats
GO

CREATE VIEW vw_DefaulterStats AS
SELECT 
  c.customer_id,
  c.name,
  1 as defaulters,
  c.balance as outstanding,
  (SELECT COUNT(*) FROM Bills b WHERE b.customer_id = c.id AND b.status = 'unpaid') as bill_count
FROM Customers c
WHERE c.balance > 0
GO
