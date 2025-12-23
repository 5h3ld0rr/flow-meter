CREATE OR ALTER PROCEDURE sp_GetAllCustomers
    @search NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        c.id, -- Included internal ID
        c.customer_id, 
        c.name, 
        c.email, 
        c.phone, 
        c.address, 
        c.status, 
        c.balance, 
        c.created_at, 
        c.updated_at,
        STRING_AGG(m.utility_type, ',') AS utilities
    FROM Customers c
    LEFT JOIN Meters m ON m.customer_id = c.id -- Join on INT
    WHERE c.status != 'inactive'
        AND (@search IS NULL OR c.name LIKE '%' + @search + '%' 
             OR c.email LIKE '%' + @search + '%' 
             OR c.customer_id LIKE '%' + @search + '%')
    GROUP BY c.id, c.customer_id, c.name, c.email, c.phone, c.address, c.status, c.balance, c.created_at, c.updated_at
    ORDER BY c.created_at DESC;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetCustomerById
    @id NVARCHAR(50) -- Matches string ID from URL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT id, customer_id, name, email, phone, address, status, balance, created_at, updated_at
    FROM Customers
    WHERE customer_id = @id; -- Query by String ID
END;
GO

CREATE OR ALTER PROCEDURE sp_CheckEmailExists
    @email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) as count 
    FROM Customers 
    WHERE email = @email;
END;
GO

CREATE OR ALTER PROCEDURE sp_CreateCustomer
    -- Removed @customerId as it is computed
    @name NVARCHAR(255),
    @email NVARCHAR(255),
    @phone NVARCHAR(20),
    @address NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Customers (name, email, phone, address, status, balance)
    VALUES (@name, @email, @phone, @address, 'active', 0.00);
END;
GO

CREATE OR ALTER PROCEDURE sp_UpdateCustomer
    @customer_id NVARCHAR(50),
    @name NVARCHAR(255),
    @email NVARCHAR(255),
    @phone NVARCHAR(20),
    @address NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Customers 
    SET name = @name, 
        email = @email, 
        phone = @phone, 
        address = @address,
        updated_at = GETUTCDATE()
    WHERE customer_id = @customer_id;
END;
GO

CREATE OR ALTER PROCEDURE sp_DeleteCustomer
    @id NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Customers 
    SET status = 'inactive', 
        updated_at = GETUTCDATE() 
    WHERE customer_id = @id;
END;
GO

CREATE OR ALTER PROCEDURE sp_LogCustomerActivity
    @customerId INT, -- Expects FK INT
    @description NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Activities (activity_type, description, customer_id)
    VALUES ('customer', @description, @customerId);
END;
GO

CREATE OR ALTER PROCEDURE sp_UpdateCustomerBalance
    @customerId INT, -- Internal ID
    @amount DECIMAL(18,2),
    @operation NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @operation = 'add'
        UPDATE Customers
        SET balance = balance + @amount, updated_at = GETUTCDATE()
        WHERE id = @customerId;
    ELSE IF @operation = 'subtract'
        UPDATE Customers
        SET balance = balance - @amount, updated_at = GETUTCDATE()
        WHERE id = @customerId;
END;
GO
