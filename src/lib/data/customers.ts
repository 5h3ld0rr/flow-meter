import { execute } from "@/lib/db";

export async function getCustomers(search?: string): Promise<Customer[]> {
  const result = await execute<Customer & { utilities: string | null }>(
    "sp_GetAllCustomers",
    { search: search || null }
  );

  return result.recordset.map((customer) => ({
    ...customer,
    utilities: customer.utilities ? customer.utilities.split(",") : [],
  }));
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const result = await execute<Customer>("sp_GetCustomerById", { id });
  return result.recordset[0] || null;
}
