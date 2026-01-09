import { query } from "@/lib/db";

export async function getCustomers(search?: string): Promise<Customer[]> {
  const result = await query<Customer & { utilities: string | null }>(
    `SELECT 
        c.id, 
        c.customer_id, 
        c.name, 
        c.email, 
        c.phone, 
        c.address, 
        c.status,
        c.type, 
        c.balance, 
        c.created_at, 
        c.updated_at,
        STRING_AGG(m.utility_type, ',') AS utilities
    FROM Customers c
    LEFT JOIN Meters m ON m.customer_id = c.id
    WHERE c.status != 'inactive'
        AND (@search IS NULL OR c.name LIKE '%' + @search + '%' 
             OR c.email LIKE '%' + @search + '%' 
             OR c.customer_id LIKE '%' + @search + '%')
    GROUP BY c.id, c.customer_id, c.name, c.email, c.phone, c.address, c.status, c.type, c.balance, c.created_at, c.updated_at
    ORDER BY c.created_at DESC`,
    { search: search || null }
  );

  return result.recordset.map((customer) => ({
    ...customer,
    utilities: customer.utilities ? customer.utilities.split(",") : [],
  }));
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const result = await query<Customer>(
    `SELECT id, customer_id, name, email, phone, address, status, type, balance, created_at, updated_at
     FROM Customers
     WHERE customer_id = @id`,
    { id }
  );
  return result.recordset[0] || null;
}

export async function checkEmailExists(email: string): Promise<boolean> {
  const result = await query<{ count: number }>(
    `SELECT COUNT(*) as count FROM Customers WHERE email = @email`,
    { email }
  );
  return result.recordset[0].count > 0;
}
