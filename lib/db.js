import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be defined in .env");
}

// neon uses a fast HTTP connection for serverless/edge environments
export const sql = neon(process.env.DATABASE_URL);

let isInitialized = false;

export async function initDb() {
  if (isInitialized) return;
  
  await sql`
    CREATE TABLE IF NOT EXISTS companies (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      website TEXT,
      what_building TEXT,
      industry TEXT,
      hiring_status TEXT NOT NULL DEFAULT 'unknown',
      application_status TEXT NOT NULL DEFAULT 'not_applied',
      application_link TEXT,
      contact_email TEXT,
      stipend_mentioned INT NOT NULL DEFAULT 0,
      stipend_details TEXT,
      location TEXT,
      remote_type TEXT,
      source TEXT,
      priority TEXT NOT NULL DEFAULT 'medium',
      date_applied TEXT,
      rejection_reason TEXT,
      follow_up_date TEXT,
      notes TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS roles (
      id SERIAL PRIMARY KEY,
      company_id INT NOT NULL,
      title TEXT NOT NULL,
      link TEXT,
      stipend_mentioned INT NOT NULL DEFAULT 0,
      stipend_details TEXT,
      notes TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_roles_company_id ON roles(company_id)
  `;

  isInitialized = true;
}

export default sql;
