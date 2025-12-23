USE FlowMeter;
GO

INSERT INTO dbo.Users (email, password_hash, full_name, role)
VALUES 
    ('admin@flowmeter.com', '$2b$10$AsgraeAYHneLxPYwScNg1O3ut/K6ShiuVbTyvlNHe1DjGUUBz/p6G', 'System Administrator', 'admin'),
    ('operator@flowmeter.com', '$2b$10$AsgraeAYHneLxPYwScNg1O3ut/K6ShiuVbTyvlNHe1DjGUUBz/p6G', 'System Operator', 'operator');
GO

INSERT INTO dbo.Tariffs (utility_type, rate_per_unit, tax_percentage, effective_from)
VALUES 
    ('electricity', 0.15, 10.00, '2025-10-01'),
    ('water', 0.05, 10.00, '2025-10-01'),
    ('gas', 0.12, 10.00, '2025-10-01');
GO

INSERT INTO dbo.Customers (name, email, phone, address, status, balance)
VALUES 
    ('John Smith', 'john.smith@email.com', '+1 234 567 8900', '123 Main St, City', 'active', 125.50), -- 1
    ('Sarah Johnson', 'sarah.j@email.com', '+1 234 567 8901', '456 Oak Ave, City', 'active', 0.00),     -- 2
    ('Mike Wilson', 'mike.w@email.com', '+1 234 567 8902', '789 Pine Rd, City', 'overdue', 245.75),    -- 3
    ('Emily Davis', 'emily.d@email.com', '+1 234 567 8903', '321 Elm St, City', 'active', 156.75),     -- 4
    ('Industrial Park A', 'contact@industrialpark-a.com', '+1 234 567 8904', '100 Industrial Blvd, City', 'active', 0.00), -- 5
    ('Shopping Mall B', 'admin@shoppingmall-b.com', '+1 234 567 8905', '200 Commerce Dr, City', 'active', 0.00),   -- 6
    ('Residential Complex C', 'manager@rescomplex-c.com', '+1 234 567 8906', '300 Residential Way, City', 'active', 0.00), -- 7
    ('Office Tower D', 'facilities@officetower-d.com', '+1 234 567 8907', '400 Business Pkwy, City', 'active', 0.00);      -- 8
GO

INSERT INTO dbo.Meters (serial_number, customer_id, utility_type, location, status, install_date, last_reading_value, last_reading_date)
VALUES 
    ('ELC-2025-001', 1, 'electricity', '123 Main St', 'active', '2025-10-15', 1245, '2025-10-15'), -- M1
    ('WTR-2025-002', 2, 'water', '456 Oak Ave', 'active', '2025-10-20', 3450, '2025-10-14'),    -- M2
    ('GAS-2025-003', 3, 'gas', '789 Pine Rd', 'maintenance', '2025-10-10', 890, '2025-10-13'),  -- M3
    ('ELC-2025-004', 5, 'electricity', '100 Industrial Blvd', 'active', '2023-06-01', 45230, '2025-10-15'), -- M4
    ('ELC-2025-005', 6, 'electricity', '200 Commerce Dr', 'active', '2023-08-15', 38450, '2025-10-15'),     -- M5
    ('ELC-2025-006', 7, 'electricity', '300 Residential Way', 'active', '2023-09-20', 32100, '2025-10-15'),  -- M6
    ('ELC-2025-007', 8, 'electricity', '400 Business Pkwy', 'active', '2023-10-10', 28900, '2025-10-15'),  -- M7
    ('WTR-2025-008', 8, 'water', '400 Business Pkwy', 'active', '2023-10-10', 28900, '2025-10-15');   -- M8
GO

INSERT INTO dbo.Readings (meter_id, reading_value, reading_date, consumption, status, created_by)
VALUES 
    (1, 1245, '2025-10-15', 245, 'submitted', 1),
    (2, 3450, '2025-10-14', 450, 'submitted', 1),
    (3, 890, '2025-10-13', 90, 'verified', 1);
GO

INSERT INTO dbo.Bills (customer_id, meter_id, billing_period_start, billing_period_end, previous_reading, current_reading, consumption, tariff_rate, base_amount, tax_amount, due_date, status)
VALUES 
    (1, 1, '2023-12-01', '2023-12-31', 1000, 1245, 245, 0.15, 36.75, 3.68, '2025-10-31', 'paid'),     -- B1
    (2, 2, '2023-12-01', '2023-12-31', 3000, 3450, 450, 0.05, 22.50, 2.25, '2025-10-31', 'paid'),     -- B2
    (3, 3, '2023-12-01', '2023-12-31', 800, 890, 90, 0.12, 10.80, 1.08, '2025-10-31', 'overdue');     -- B3
GO

INSERT INTO dbo.Payments (bill_id, customer_id, amount, payment_method, payment_date, status, created_by)
VALUES 
    (1, 1, 125.50, 'card', '2025-10-15', 'completed', 1),
    (2, 2, 89.00, 'cash', '2025-10-14', 'completed', 1),
    (3, 3, 156.75, 'online', '2025-10-13', 'pending', 1);
GO

INSERT INTO dbo.Activities (activity_type, description, customer_id, amount, created_at)
VALUES 
    ('payment', 'Payment received', 1, 125.50, DATEADD(MINUTE, -5, GETUTCDATE())),
    ('reading', 'New meter reading', 2, NULL, DATEADD(MINUTE, -12, GETUTCDATE())),
    ('bill', 'Bill generated', 3, 89.00, DATEADD(MINUTE, -25, GETUTCDATE())),
    ('payment', 'Payment overdue', 4, 156.75, DATEADD(HOUR, -1, GETUTCDATE()));
GO
