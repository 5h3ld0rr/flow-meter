import { query } from "@/lib/db";

export const getCustomers = async (search?: string): Promise<Customer[]> => {
  try {
    let queryText = `
      SELECT 
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
      LEFT JOIN Meters m ON m.customer_id = c.customer_id
      WHERE c.status != 'inactive'
      GROUP BY c.customer_id, c.name, c.email, c.phone, c.address, c.status, c.balance, c.created_at, c.updated_at
    `;

    const params: Record<string, string> = {};

    if (search) {
      queryText += ` AND (c.name LIKE @search OR c.email LIKE @search OR c.customer_id LIKE @search)`;
      params.search = `%${search}%`;
    }

    queryText += ` ORDER BY c.created_at DESC`;

    const result = await query<Customer & { utilities: string | null }>(
      queryText,
      params
    );

    return result.recordset.map((customer) => ({
      ...customer,
      utilities: customer.utilities ? customer.utilities.split(",") : [],
    }));
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};

export const getCustomerById = async (id: string): Promise<Customer | null> => {
  try {
    const result = await query<Customer>(
      `SELECT customer_id, name, email, phone, address, status, balance, created_at, updated_at
       FROM Customers
       WHERE customer_id = @id`,
      { id }
    );

    return result.recordset[0] || null;
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const result = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM Customers WHERE email = @email`,
      { email }
    );
    return result.recordset[0].count > 0;
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
};

export const getCustomerCount = async (): Promise<number> => {
  try {
    const result = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM Customers`
    );
    return result.recordset[0].count;
  } catch (error) {
    console.error("Error getting customer count:", error);
    return 0;
  }
};

export const getCustomerIdByCustomerId = async (
  customerId: string
): Promise<number | null> => {
  try {
    const result = await query<{ id: number }>(
      `SELECT id FROM Customers WHERE customer_id = @customerId`,
      { customerId }
    );
    return result.recordset[0]?.id || null;
  } catch (error) {
    console.error("Error fetching customer ID:", error);
    return null;
  }
};

export const createCustomerRecord = async (data: {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}) => {
  await query(
    `INSERT INTO Customers (customer_id, name, email, phone, address, status, balance)
     VALUES (@customerId, @name, @email, @phone, @address, 'active', 0.00)`,
    data
  );
};

export const updateCustomerRecord = async (data: {
  customer_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}) => {
  await query(
    `UPDATE Customers SET name = @name, email = @email, phone = @phone, address = @address WHERE customer_id = @customer_id`,
    data
  );
};

export const deleteCustomerRecord = async (id: string) => {
  await query(
    `UPDATE Customers SET status = 'inactive', updated_at = GETDATE() WHERE customer_id = @id`,
    { id }
  );
};
