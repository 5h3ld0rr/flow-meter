CREATE DATABASE FlowMeter;

USE FlowMeter;

CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'operator')),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

CREATE INDEX IX_Users_Email ON Users(email);

CREATE TABLE Customers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL UNIQUE,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address VARCHAR(MAX) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'overdue')),
    balance DECIMAL(18,2) DEFAULT 0.00,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

CREATE INDEX IX_Customers_CustomerId ON Customers(customer_id);
CREATE INDEX IX_Customers_Email ON Customers(email);
CREATE INDEX IX_Customers_Status ON Customers(status);

CREATE TABLE Meters (
    id INT IDENTITY(1,1) PRIMARY KEY,
    meter_id VARCHAR(50) NOT NULL UNIQUE,
    serial_number NVARCHAR(100) NOT NULL UNIQUE,
    customer_id VARCHAR(50) NOT NULL,
    utility_type VARCHAR(50) NOT NULL CHECK (utility_type IN ('electricity', 'water', 'gas')),
    location VARCHAR(MAX) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    install_date DATE NOT NULL,
    last_reading_value DECIMAL(18,2) NULL,
    last_reading_date DATETIME2 NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE CASCADE
);

CREATE INDEX IX_Meters_MeterId ON Meters(meter_id);
CREATE INDEX IX_Meters_CustomerId ON Meters(customer_id);
CREATE INDEX IX_Meters_UtilityType ON Meters(utility_type);
CREATE INDEX IX_Meters_Status ON Meters(status);


CREATE TABLE Tariffs (
    id INT IDENTITY(1,1) PRIMARY KEY,
    utility_type VARCHAR(50) NOT NULL CHECK (utility_type IN ('electricity', 'water', 'gas')),
    rate_per_unit DECIMAL(18,4) NOT NULL,
    tax_percentage DECIMAL(5,2) NOT NULL DEFAULT 10.00,
    effective_from DATE NOT NULL,
    effective_to DATE NULL,
    created_at DATETIME2 DEFAULT GETDATE()
);

CREATE INDEX IX_Tariffs_UtilityType ON Tariffs(utility_type);
CREATE INDEX IX_Tariffs_EffectiveDates ON Tariffs(effective_from, effective_to);


CREATE TABLE Readings (
    id INT IDENTITY(1,1) PRIMARY KEY,
    meter_id VARCHAR(50) NOT NULL,
    reading_value DECIMAL(18,2) NOT NULL,
    reading_date DATETIME2 NOT NULL,
    consumption DECIMAL(18,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'verified', 'disputed')),
    notes VARCHAR(MAX) NULL,
    created_by INT NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (meter_id) REFERENCES Meters(meter_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES Users(id)
);

CREATE INDEX IX_Readings_MeterId ON Readings(meter_id);
CREATE INDEX IX_Readings_ReadingDate ON Readings(reading_date);
CREATE INDEX IX_Readings_Status ON Readings(status);


CREATE TABLE Bills (
    id INT IDENTITY(1,1) PRIMARY KEY,
    bill_id VARCHAR(50) NOT NULL UNIQUE,
    customer_id VARCHAR(50) NOT NULL,
    meter_id VARCHAR(50) NOT NULL,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    previous_reading DECIMAL(18,2) NOT NULL,
    current_reading DECIMAL(18,2) NOT NULL,
    consumption DECIMAL(18,2) NOT NULL,
    tariff_rate DECIMAL(18,4) NOT NULL,
    base_amount DECIMAL(18,2) NOT NULL,
    tax_amount DECIMAL(18,2) NOT NULL,
    total_amount DECIMAL(18,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'generated', 'sent', 'paid', 'overdue')),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (meter_id) REFERENCES Meters(meter_id)
);

CREATE INDEX IX_Bills_BillId ON Bills(bill_id);
CREATE INDEX IX_Bills_CustomerId ON Bills(customer_id);
CREATE INDEX IX_Bills_MeterId ON Bills(meter_id);
CREATE INDEX IX_Bills_Status ON Bills(status);
CREATE INDEX IX_Bills_DueDate ON Bills(due_date);


CREATE TABLE Payments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    payment_id VARCHAR(50) NOT NULL UNIQUE,
    bill_id VARCHAR(50) NOT NULL,
    customer_id VARCHAR(50) NOT NULL,
    amount DECIMAL(18,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cash', 'card', 'online', 'check')),
    transaction_reference NVARCHAR(255) NULL,
    payment_date DATETIME2 NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    notes VARCHAR(MAX) NULL,
    created_by INT NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (bill_id) REFERENCES Bills(bill_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (created_by) REFERENCES Users(id)
);

CREATE INDEX IX_Payments_PaymentId ON Payments(payment_id);
CREATE INDEX IX_Payments_BillId ON Payments(bill_id);
CREATE INDEX IX_Payments_CustomerId ON Payments(customer_id);
CREATE INDEX IX_Payments_PaymentDate ON Payments(payment_date);
CREATE INDEX IX_Payments_Status ON Payments(status);


CREATE TABLE Activities (
    id INT IDENTITY(1,1) PRIMARY KEY,
    activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('payment', 'reading', 'bill', 'customer', 'meter')),
    description VARCHAR(MAX) NOT NULL,
    customer_id VARCHAR(50) NULL,
    amount DECIMAL(18,2) NULL,
    metadata VARCHAR(MAX) NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE SET NULL
);

CREATE INDEX IX_Activities_Type ON Activities(activity_type);
CREATE INDEX IX_Activities_CustomerId ON Activities(customer_id);
CREATE INDEX IX_Activities_CreatedAt ON Activities(created_at DESC);

