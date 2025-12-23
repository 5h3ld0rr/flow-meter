CREATE OR ALTER PROCEDURE sp_GetPayments
    @customerId NVARCHAR(50) = NULL,
    @status NVARCHAR(20) = NULL,
    @startDate DATE = NULL,
    @endDate DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT p.id, p.payment_id, p.payment_date, p.amount, p.payment_method, p.transaction_reference, p.status, 
           c.name as customer_name, c.customer_id as customer_display_id,
           b.bill_id
    FROM Payments p
    INNER JOIN Customers c ON p.customer_id = c.id
    INNER JOIN Bills b ON p.bill_id = b.id
    WHERE (@customerId IS NULL OR c.customer_id = @customerId)
      AND (@status IS NULL OR p.status = @status)
      AND (@startDate IS NULL OR p.payment_date >= @startDate)
      AND (@endDate IS NULL OR p.payment_date <= @endDate)
    ORDER BY p.payment_date DESC;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetPaymentById
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT p.*, c.name as customer_name, c.customer_id as customer_display_id, b.bill_id
    FROM Payments p
    INNER JOIN Customers c ON p.customer_id = c.id
    INNER JOIN Bills b ON p.bill_id = b.id
    WHERE p.id = @id;
END;
GO

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

CREATE OR ALTER PROCEDURE sp_GetBillForPayment
    @billId NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT bill_id, customer_id, total_amount, status 
    FROM Bills 
    WHERE bill_id = @billId;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetPaymentCount
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) as count FROM Payments;
END;
GO

CREATE OR ALTER PROCEDURE sp_CreatePayment
    -- Removed paymentId
    @billId INT,
    @customerId INT,
    @amount DECIMAL(18,2),
    @paymentMethod NVARCHAR(50),
    @transactionRef NVARCHAR(100) = NULL,
    @paymentDate DATETIME2,
    @notes NVARCHAR(MAX) = NULL,
    @userId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Payments (
        bill_id, customer_id, amount, payment_method,
        transaction_reference, payment_date, status, notes, created_by
    )
    VALUES (
        @billId, @customerId, @amount, @paymentMethod,
        @transactionRef, @paymentDate, 'completed', @notes, @userId
    );
END;
GO
