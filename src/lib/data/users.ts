import { query } from "@/lib/db";

export interface UserRoleStats {
  name: string;
  users: number;
  color: "blue" | "green" | "yellow" | "purple" | "orange";
}

export const getUserRoleStats = async (): Promise<UserRoleStats[]> => {
  const result = await query<{ role: string; count: number }>(
    "SELECT role, COUNT(*) as count FROM Users GROUP BY role"
  );

  const roleColors: Record<
    string,
    "blue" | "green" | "yellow" | "purple" | "orange"
  > = {
    admin: "blue",
    staff: "green",
    manager: "purple",
    cashier: "yellow",
    officer: "orange",
  };

  return result.recordset.map((row) => ({
    name: row.role.charAt(0).toUpperCase() + row.role.slice(1),
    users: row.count,
    color: roleColors[row.role.toLowerCase()] || "orange",
  }));
};

export const getUsersByRole = async (role?: string, search?: string) => {
  let sql =
    "SELECT id, employee_id, email, full_name, role, created_at FROM Users WHERE 1 = 1";
  const params: { role?: string; search?: string } = {};

  if (role) {
    sql += " AND role = @role";
    params.role = role;
  }

  if (search) {
    sql +=
      " AND (full_name LIKE @search OR email LIKE @search OR employee_id LIKE @search)";
    params.search = `%${search}%`;
  }

  sql += " ORDER BY created_at DESC";

  const result = await query<User>(sql, params);
  return result.recordset;
};

export const getUserById = async (id: string) => {
  const result = await query<User>("SELECT * FROM Users WHERE id = @id", {
    id,
  });
  return result.recordset[0];
};
