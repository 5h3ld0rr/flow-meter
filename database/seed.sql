USE FlowMeter;

INSERT INTO Users (email, password_hash, full_name, role)
VALUES 
    ('admin@flowmeter.com', '$2b$10$AsgraeAYHneLxPYwScNg1O3ut/K6ShiuVbTyvlNHe1DjGUUBz/p6G', 'System Administrator', 'admin'),
    ('operator@flowmeter.com', '$2b$10$AsgraeAYHneLxPYwScNg1O3ut/K6ShiuVbTyvlNHe1DjGUUBz/p6G', 'System Operator', 'operator');

INSERT INTO Tariffs (utility_type, rate_per_unit, tax_percentage, effective_from)
VALUES 
    ('electricity', 0.15, 10.00, '2025-10-01'),
    ('water', 0.05, 10.00, '2025-10-01'),
    ('gas', 0.12, 10.00, '2025-10-01');

INSERT INTO Customers (customer_id, name, email, phone, address, status, balance)
VALUES 
    ('C001', 'John Smith', 'john.smith@email.com', '+1 234 567 8900', '123 Main St, City', 'active', 125.50),
    ('C002', 'Sarah Johnson', 'sarah.j@email.com', '+1 234 567 8901', '456 Oak Ave, City', 'active', 0.00),
    ('C003', 'Mike Wilson', 'mike.w@email.com', '+1 234 567 8902', '789 Pine Rd, City', 'overdue', 245.75),
    ('C004', 'Emily Davis', 'emily.d@email.com', '+1 234 567 8903', '321 Elm St, City', 'active', 156.75),
    ('C005', 'Industrial Park A', 'contact@industrialpark-a.com', '+1 234 567 8904', '100 Industrial Blvd, City', 'active', 0.00),
    ('C006', 'Shopping Mall B', 'admin@shoppingmall-b.com', '+1 234 567 8905', '200 Commerce Dr, City', 'active', 0.00),
    ('C007', 'Residential Complex C', 'manager@rescomplex-c.com', '+1 234 567 8906', '300 Residential Way, City', 'active', 0.00),
    ('C008', 'Office Tower D', 'facilities@officetower-d.com', '+1 234 567 8907', '400 Business Pkwy, City', 'active', 0.00);

INSERT INTO Meters (meter_id, serial_number, customer_id, utility_type, location, status, install_date, last_reading_value, last_reading_date)
VALUES 
    ('M001', 'ELC-2025-001', 'C001', 'electricity', '123 Main St', 'active', '2025-10-15', 1245, '2025-10-15'),
    ('M002', 'WTR-2025-002', 'C002', 'water', '456 Oak Ave', 'active', '2025-10-20', 3450, '2025-10-14'),
    ('M003', 'GAS-2025-003', 'C003', 'gas', '789 Pine Rd', 'maintenance', '2025-10-10', 890, '2025-10-13'),
    ('M004', 'ELC-2025-004', 'C005', 'electricity', '100 Industrial Blvd', 'active', '2023-06-01', 45230, '2025-10-15'),
    ('M005', 'ELC-2025-005', 'C006', 'electricity', '200 Commerce Dr', 'active', '2023-08-15', 38450, '2025-10-15'),
    ('M006', 'ELC-2025-006', 'C007', 'electricity', '300 Residential Way', 'active', '2023-09-20', 32100, '2025-10-15'),
    ('M007', 'ELC-2025-007', 'C008', 'electricity', '400 Business Pkwy', 'active', '2023-10-10', 28900, '2025-10-15'),
    ('M008', 'WTR-2025-008', 'C008', 'water', '400 Business Pkwy', 'active', '2023-10-10', 28900, '2025-10-15');

INSERT INTO Readings (meter_id, reading_value, reading_date, consumption, status, created_by)
VALUES 
    ('M001', 1245, '2025-10-15', 245, 'submitted', 1),
    ('M002', 3450, '2025-10-14', 450, 'submitted', 1),
    ('M003', 890, '2025-10-13', 90, 'verified', 1);


INSERT INTO Bills (bill_id, customer_id, meter_id, billing_period_start, billing_period_end, previous_reading, current_reading, consumption, tariff_rate, base_amount, tax_amount, total_amount, due_date, status)
VALUES 
    ('BILL-001', 'C001', 'M001', '2023-12-01', '2023-12-31', 1000, 1245, 245, 0.15, 36.75, 3.68, 40.43, '2025-10-31', 'paid'),
    ('BILL-002', 'C002', 'M002', '2023-12-01', '2023-12-31', 3000, 3450, 450, 0.05, 22.50, 2.25, 24.75, '2025-10-31', 'paid'),
    ('BILL-003', 'C003', 'M003', '2023-12-01', '2023-12-31', 800, 890, 90, 0.12, 10.80, 1.08, 11.88, '2025-10-31', 'overdue');

INSERT INTO Payments (payment_id, bill_id, customer_id, amount, payment_method, payment_date, status, created_by)
VALUES 
    ('PAY001', 'BILL-001', 'C001', 125.50, 'card', '2025-10-15', 'completed', 1),
    ('PAY002', 'BILL-002', 'C002', 89.00, 'cash', '2025-10-14', 'completed', 1),
    ('PAY003', 'BILL-003', 'C003', 156.75, 'online', '2025-10-13', 'pending', 1);

INSERT INTO Activities (activity_type, description, customer_id, amount, created_at)
VALUES 
    ('payment', 'Payment received', 'C001', 125.50, DATEADD(MINUTE, -5, GETDATE())),
    ('reading', 'New meter reading', 'C002', NULL, DATEADD(MINUTE, -12, GETDATE())),
    ('bill', 'Bill generated', 'C003', 89.00, DATEADD(MINUTE, -25, GETDATE())),
    ('payment', 'Payment overdue', 'C004', 156.75, DATEADD(HOUR, -1, GETDATE()));
