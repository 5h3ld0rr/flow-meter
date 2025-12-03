import { query } from "@/lib/db";

export async function getAll<T>(
  tableName: string,
  orderBy: string = "created_at DESC"
): Promise<T[]> {
  try {
    const result = await query<T>(
      `SELECT * FROM ${tableName} ORDER BY ${orderBy}`
    );
    return result.recordset;
  } catch (error) {
    console.error(`Error fetching all from ${tableName}:`, error);
    return [];
  }
}

export async function getById<T>(
  tableName: string,
  id: number
): Promise<T | null> {
  try {
    const result = await query<T>(`SELECT * FROM ${tableName} WHERE id = @id`, {
      id,
    });
    return result.recordset[0] || null;
  } catch (error) {
    console.error(`Error fetching from ${tableName} by ID:`, error);
    return null;
  }
}

export async function count(
  tableName: string,
  whereClause?: string,
  params?: Record<string, string | number>
): Promise<number> {
  try {
    const queryText = whereClause
      ? `SELECT COUNT(*) as count FROM ${tableName} WHERE ${whereClause}`
      : `SELECT COUNT(*) as count FROM ${tableName}`;

    const result = await query<{ count: number }>(queryText, params);
    return result.recordset[0].count;
  } catch (error) {
    console.error(`Error counting ${tableName}:`, error);
    return 0;
  }
}

export async function exists(
  tableName: string,
  whereClause: string,
  params: Record<string, string | number>
): Promise<boolean> {
  try {
    const result = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${tableName} WHERE ${whereClause}`,
      params
    );
    return result.recordset[0].count > 0;
  } catch (error) {
    console.error(`Error checking existence in ${tableName}:`, error);
    return false;
  }
}

export async function search<T>(
  tableName: string,
  searchColumns: string[],
  searchTerm: string,
  orderBy: string = "created_at DESC"
): Promise<T[]> {
  try {
    const conditions = searchColumns
      .map((col) => `${col} LIKE @searchTerm`)
      .join(" OR ");

    const result = await query<T>(
      `SELECT * FROM ${tableName} WHERE ${conditions} ORDER BY ${orderBy}`,
      { searchTerm: `%${searchTerm}%` }
    );
    return result.recordset;
  } catch (error) {
    console.error(`Error searching ${tableName}:`, error);
    return [];
  }
}
