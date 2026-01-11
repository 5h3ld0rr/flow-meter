import sql from "mssql";

let pool: sql.ConnectionPool | null = null;

const config: sql.config = {
  server: process.env.DB_SERVER || "localhost",
  port: parseInt(process.env.DB_PORT || "1433"),
  database: process.env.DB_DATABASE || "UMS",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

const getPool = async (): Promise<sql.ConnectionPool> => {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
};

const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.close();
    pool = null;
  }
};

export const query = async <T = unknown>(
  queryText: string,
  params?: Record<string, unknown>
): Promise<sql.IResult<T>> => {
  const connection = await getPool();
  const request = connection.request();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });
  }

  return await request.query(queryText);
};

export const execute = async <T = unknown>(
  procedureName: string,
  params?: Record<string, unknown>
): Promise<sql.IProcedureResult<T>> => {
  const connection = await getPool();
  const request = connection.request();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });
  }

  return await request.execute(procedureName);
};

// Handle process termination
process.on("SIGINT", async () => {
  await closePool();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closePool();
  process.exit(0);
});
