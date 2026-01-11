USE FlowMeter;
GO

CREATE TABLE dbo.Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id NVARCHAR(50) NOT NULL CONSTRAINT UK_Users_EmployeeId UNIQUE,
    email NVARCHAR(255) NOT NULL CONSTRAINT UK_Users_Email UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL CONSTRAINT CHK_Users_Role CHECK (role IN ('admin', 'staff', 'officer', 'cashier', 'manager')),

    created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO
CREATE UNIQUE INDEX IX_Users_EmployeeId ON dbo.Users(employee_id);
CREATE UNIQUE INDEX IX_Users_Email ON dbo.Users(email);
GO

CREATE TABLE dbo.Customers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id AS CONCAT('CUS-', CAST(YEAR(created_at) AS VARCHAR(4)), '-', RIGHT('000000' + CAST(id AS VARCHAR(10)), 6)) PERSISTED,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    phone NVARCHAR(50) NOT NULL,
    address NVARCHAR(MAX) NOT NULL,
    status NVARCHAR(50) NOT NULL DEFAULT 'active' CONSTRAINT CHK_Customers_Status CHECK (status IN ('active', 'inactive', 'overdue')),
    type NVARCHAR(50) NOT NULL DEFAULT 'household' CONSTRAINT CHK_Customers_Type CHECK (type IN ('household', 'business', 'government')),
    balance DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT UK_Customers_CustomerId UNIQUE (customer_id),
    CONSTRAINT UK_Customers_Email UNIQUE (email)
);
GO
CREATE UNIQUE INDEX IX_Customers_CustomerId ON dbo.Customers(customer_id);
CREATE INDEX IX_Customers_Email ON dbo.Customers(email);
CREATE INDEX IX_Customers_Status ON dbo.Customers(status);
CREATE INDEX IX_Customers_Type ON dbo.Customers(type);
GO

CREATE TABLE dbo.Meters (
    id INT IDENTITY(1,1) PRIMARY KEY,
    meter_id AS CONCAT('MTR-', CAST(YEAR(created_at) AS VARCHAR(4)), '-', RIGHT('000000' + CAST(id AS VARCHAR(10)), 6)) PERSISTED,
    serial_number NVARCHAR(100) NOT NULL CONSTRAINT UK_Meters_SerialNumber UNIQUE,
    customer_id INT NOT NULL,
    utility_type NVARCHAR(50) NOT NULL CONSTRAINT CHK_Meters_UtilityType CHECK (utility_type IN ('electricity', 'water', 'gas')),
    location NVARCHAR(MAX) NOT NULL,
    status NVARCHAR(50) NOT NULL DEFAULT 'active' CONSTRAINT CHK_Meters_Status CHECK (status IN ('active', 'inactive', 'maintenance')),
    install_date DATE NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT UK_Meters_MeterId UNIQUE (meter_id),
    CONSTRAINT FK_Meters_Customer FOREIGN KEY (customer_id) REFERENCES dbo.Customers(id) ON DELETE CASCADE
);
GO
CREATE UNIQUE INDEX IX_Meters_MeterId ON dbo.Meters(meter_id);
CREATE INDEX IX_Meters_CustomerId ON dbo.Meters(customer_id);
CREATE INDEX IX_Meters_UtilityType ON dbo.Meters(utility_type);
CREATE INDEX IX_Meters_Status ON dbo.Meters(status);
GO

CREATE TABLE dbo.Tariffs (
    id INT IDENTITY(1,1) PRIMARY KEY,
    utility_type NVARCHAR(50) NOT NULL CONSTRAINT CHK_Tariffs_UtilityType CHECK (utility_type IN ('electricity', 'water', 'gas')),
    rate_per_unit DECIMAL(18,4) NOT NULL CHECK (rate_per_unit >= 0),
    tax_percentage DECIMAL(5,2) NOT NULL DEFAULT 10.00 CHECK (tax_percentage >= 0 AND tax_percentage <= 100),
    effective_from DATE NOT NULL,
    effective_to DATE NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO
CREATE INDEX IX_Tariffs_UtilityType ON dbo.Tariffs(utility_type);
CREATE INDEX IX_Tariffs_EffectiveDates ON dbo.Tariffs(effective_from, effective_to);
GO

CREATE TABLE dbo.Readings (
    id INT IDENTITY(1,1) PRIMARY KEY,
    meter_id INT NOT NULL,
    reading_value DECIMAL(18,2) NOT NULL CHECK (reading_value >= 0),
    reading_date DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    consumption DECIMAL(18,2) NOT NULL CHECK (consumption >= 0),
    status NVARCHAR(50) NOT NULL DEFAULT 'submitted' CONSTRAINT CHK_Readings_Status CHECK (status IN ('submitted', 'verified', 'disputed')),
    notes NVARCHAR(MAX) NULL,
    created_by INT NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_Readings_Meter FOREIGN KEY (meter_id) REFERENCES dbo.Meters(id) ON DELETE CASCADE,
    CONSTRAINT FK_Readings_CreatedBy FOREIGN KEY (created_by) REFERENCES dbo.Users(id)
);
GO
CREATE INDEX IX_Readings_MeterId ON dbo.Readings(meter_id);
CREATE INDEX IX_Readings_ReadingDate ON dbo.Readings(reading_date DESC);
CREATE INDEX IX_Readings_Status ON dbo.Readings(status);
GO

CREATE TABLE dbo.Bills (
    id INT IDENTITY(1,1) PRIMARY KEY,
    bill_id AS CONCAT('BILL-', CAST(YEAR(created_at) * 100 + MONTH(created_at) AS VARCHAR(6)), '-', RIGHT('00000' + CAST(id AS VARCHAR(10)), 5)) PERSISTED,
    customer_id INT NOT NULL,
    meter_id INT NOT NULL,
    reading_id INT NULL,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    previous_reading DECIMAL(18,2) NOT NULL,
    current_reading DECIMAL(18,2) NOT NULL,
    consumption DECIMAL(18,2) NOT NULL CHECK (consumption >= 0),
    tariff_rate DECIMAL(18,4) NOT NULL,
    base_amount DECIMAL(18,2) NOT NULL,
    tax_amount DECIMAL(18,2) NOT NULL,
    total_amount AS (base_amount + tax_amount) PERSISTED,
    due_date DATE NOT NULL,
    status NVARCHAR(50) NOT NULL DEFAULT 'draft' CONSTRAINT CHK_Bills_Status CHECK (status IN ('draft', 'generated', 'sent', 'paid', 'overdue')),
    created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT UK_Bills_BillId UNIQUE (bill_id),
    CONSTRAINT FK_Bills_Customer FOREIGN KEY (customer_id) REFERENCES dbo.Customers(id),
    CONSTRAINT FK_Bills_Meter FOREIGN KEY (meter_id) REFERENCES dbo.Meters(id),
    CONSTRAINT FK_Bills_Reading FOREIGN KEY (reading_id) REFERENCES dbo.Readings(id)
);
GO
CREATE UNIQUE INDEX IX_Bills_BillId ON dbo.Bills(bill_id);
CREATE INDEX IX_Bills_CustomerId ON dbo.Bills(customer_id);
CREATE INDEX IX_Bills_MeterId ON dbo.Bills(meter_id);
CREATE INDEX IX_Bills_Status ON dbo.Bills(status);
CREATE INDEX IX_Bills_DueDate ON dbo.Bills(due_date);
GO

CREATE TABLE dbo.Payments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    payment_id AS CONCAT('PAY-', CAST(YEAR(created_at) * 10000 + MONTH(created_at) * 100 + DAY(created_at) AS VARCHAR(8)), '-', RIGHT('00000' + CAST(id AS VARCHAR(10)), 5)) PERSISTED,
    bill_id INT NOT NULL,
    customer_id INT NOT NULL,
    amount DECIMAL(18,2) NOT NULL CHECK (amount > 0),
    payment_method NVARCHAR(50) NOT NULL CONSTRAINT CHK_Payments_Method CHECK (payment_method IN ('cash', 'card', 'online', 'check')),
    transaction_reference NVARCHAR(255) NULL,
    payment_date DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    status NVARCHAR(50) NOT NULL DEFAULT 'completed' CONSTRAINT CHK_Payments_Status CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    notes NVARCHAR(MAX) NULL,
    created_by INT NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT UK_Payments_PaymentId UNIQUE (payment_id),
    CONSTRAINT FK_Payments_Bill FOREIGN KEY (bill_id) REFERENCES dbo.Bills(id),
    CONSTRAINT FK_Payments_Customer FOREIGN KEY (customer_id) REFERENCES dbo.Customers(id),
    CONSTRAINT FK_Payments_CreatedBy FOREIGN KEY (created_by) REFERENCES dbo.Users(id)
);
GO
CREATE UNIQUE INDEX IX_Payments_PaymentId ON dbo.Payments(payment_id);
CREATE INDEX IX_Payments_BillId ON dbo.Payments(bill_id);
CREATE INDEX IX_Payments_CustomerId ON dbo.Payments(customer_id);
CREATE INDEX IX_Payments_PaymentDate ON dbo.Payments(payment_date DESC);
CREATE INDEX IX_Payments_Status ON dbo.Payments(status);
GO

CREATE TABLE dbo.Activities (
    id INT IDENTITY(1,1) PRIMARY KEY,
    activity_type NVARCHAR(50) NOT NULL CONSTRAINT CHK_Activities_Type CHECK (activity_type IN ('payment', 'reading', 'bill', 'customer', 'meter')),
    description NVARCHAR(MAX) NOT NULL,
    customer_id INT NULL,
    amount DECIMAL(18,2) NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_Activities_Customer FOREIGN KEY (customer_id) REFERENCES dbo.Customers(id) ON DELETE SET NULL
);
GO
CREATE INDEX IX_Activities_Type ON dbo.Activities(activity_type);
CREATE INDEX IX_Activities_CustomerId ON dbo.Activities(customer_id);
CREATE INDEX IX_Activities_CreatedAt ON dbo.Activities(created_at DESC);
GO