import sql from 'mssql';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, basename } from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
    server: process.env.DB_SERVER || 'localhost',
    port: parseInt(process.env.DB_PORT || '1433'),
    database: process.env.DB_DATABASE || 'UMS',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true,
    },
};

// SQL files to execute in order
const DB_DIR = join(__dirname, '..', 'database');
const FILES_ORDER = [
    'schema.sql',
    'seed.sql',
    'triggers.sql',
    'functions.sql',
    'stored-procedures.sql',
];

async function executeSqlFile(pool, filePath) {
    console.log(`Executing ${basename(filePath)}...`);
    try {
        const content = readFileSync(filePath, 'utf8');
        // Split by GO batch separator (case insensitive, on its own line)
        const batches = content
            .split(/^\s*GO\s*$/im)
            .map(batch => batch.trim())
            .filter(batch => batch.length > 0);

        for (const batch of batches) {
            try {
                await pool.request().query(batch);
            } catch (err) {
                console.error(`Error executing batch in ${basename(filePath)}:`);
                console.error(err.message);
            }
        }
        console.log(`✓ ${basename(filePath)} executed successfully.`);
    } catch (err) {
        console.error(`Failed to execute ${basename(filePath)}:`, err);
    }
}

async function main() {
    let pool = null;
    try {
        console.log('Connecting to database...');
        pool = await sql.connect(config);
        console.log('Connected.');

        // Execute listed files in order
        for (const file of FILES_ORDER) {
            const filePath = join(DB_DIR, file);
            if (existsSync(filePath)) {
                await executeSqlFile(pool, filePath);
            } else {
                console.warn(`Warning: ${file} not found, skipping.`);
            }
        }

        console.log('\nDatabase initialization completed successfully! 🎉');

    } catch (err) {
        console.error('\nDatabase initialization failed:', err);
        process.exit(1);
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

main();
