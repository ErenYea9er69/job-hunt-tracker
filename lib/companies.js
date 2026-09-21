import { sql, initDb } from "@/lib/db";

const COMPANY_FIELDS = [
  "name",
  "website",
  "what_building",
  "industry",
  "hiring_status",
  "application_status",
  "application_link",
  "contact_email",
  "stipend_mentioned",
  "stipend_details",
  "location",
  "remote_type",
  "source",
  "priority",
  "date_applied",
  "rejection_reason",
  "follow_up_date",
  "notes",
];

function normalizeCompanyInput(input) {
  const clean = {};
  for (const field of COMPANY_FIELDS) {
    if (field === "stipend_mentioned") {
      clean[field] = input[field] ? 1 : 0;
    } else {
      const value = input[field];
      clean[field] = value === undefined || value === "" ? null : value;
    }
  }
  if (!clean.name) {
    throw new Error("Company name is required.");
  }
  if (!clean.hiring_status) clean.hiring_status = "unknown";
  if (!clean.application_status) clean.application_status = "not_applied";
  if (!clean.priority) clean.priority = "medium";
  return clean;
}

export async function listCompanies() {
  await initDb();
  const companies = await sql`SELECT * FROM companies ORDER BY updated_at DESC`;
  const roles = await sql`SELECT * FROM roles ORDER BY created_at ASC`;
  
  const rolesByCompany = new Map();
  for (const role of roles) {
    if (!rolesByCompany.has(role.company_id)) {
      rolesByCompany.set(role.company_id, []);
    }
    rolesByCompany.get(role.company_id).push(role);
  }
  
  return companies.map((company) => ({
    ...company,
    stipend_mentioned: Boolean(company.stipend_mentioned),
    roles: (rolesByCompany.get(company.id) || []).map((role) => ({
      ...role,
      stipend_mentioned: Boolean(role.stipend_mentioned),
    })),
  }));
}

export async function getCompany(id) {
  await initDb();
  const companies = await sql`SELECT * FROM companies WHERE id = ${id}`;
  if (companies.length === 0) return null;
  const company = companies[0];
  
  const roles = await sql`SELECT * FROM roles WHERE company_id = ${id} ORDER BY created_at ASC`;
  
  return {
    ...company,
    stipend_mentioned: Boolean(company.stipend_mentioned),
    roles: roles.map((role) => ({
      ...role,
      stipend_mentioned: Boolean(role.stipend_mentioned),
    })),
  };
}

export async function createCompany(input) {
  await initDb();
  const clean = normalizeCompanyInput(input);
  
  // Create dynamic insert using the neon SQL helper
  const keys = Object.keys(clean);
  const values = Object.values(clean);
  
  // Neon sql(...) can handle dynamic inserts if we pass the object directly, but for safety:
  const result = await sql(`
    INSERT INTO companies (${keys.join(", ")})
    VALUES (${keys.map((_, i) => `$${i + 1}`).join(", ")})
    RETURNING *
  `, values);
  
  return getCompany(result[0].id);
}

export async function updateCompany(id, input) {
  await initDb();
  const existing = await sql`SELECT id FROM companies WHERE id = ${id}`;
  if (existing.length === 0) return null;
  
  const clean = normalizeCompanyInput(input);
  const keys = Object.keys(clean);
  const values = Object.values(clean);
  
  const assignments = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  
  await sql(`
    UPDATE companies 
    SET ${assignments}, updated_at = CURRENT_TIMESTAMP 
    WHERE id = $${keys.length + 1}
  `, [...values, id]);
  
  return getCompany(id);
}

export async function deleteCompany(id) {
  await initDb();
  const result = await sql`DELETE FROM companies WHERE id = ${id} RETURNING id`;
  return result.length > 0;
}

export async function addRole(companyId, input) {
  await initDb();
  const result = await sql`
    INSERT INTO roles (company_id, title, link, stipend_mentioned, stipend_details, notes)
    VALUES (${companyId}, ${input.title}, ${input.link || null}, ${input.stipend_mentioned ? 1 : 0}, ${input.stipend_details || null}, ${input.notes || null})
    RETURNING *
  `;
  
  const role = result[0];
  return { ...role, stipend_mentioned: Boolean(role.stipend_mentioned) };
}

export async function updateRole(id, input) {
  await initDb();
  const existing = await sql`SELECT id FROM roles WHERE id = ${id}`;
  if (existing.length === 0) return null;
  
  const result = await sql`
    UPDATE roles
    SET title = ${input.title},
        link = ${input.link || null},
        stipend_mentioned = ${input.stipend_mentioned ? 1 : 0},
        stipend_details = ${input.stipend_details || null},
        notes = ${input.notes || null}
    WHERE id = ${id}
    RETURNING *
  `;
  
  const role = result[0];
  return { ...role, stipend_mentioned: Boolean(role.stipend_mentioned) };
}

export async function deleteRole(id) {
  await initDb();
  const result = await sql`DELETE FROM roles WHERE id = ${id} RETURNING id`;
  return result.length > 0;
}

export async function getStats(companies) {
  const list = companies || await listCompanies();
  const stats = {
    total: list.length,
    hiring: list.filter((c) => c.hiring_status === "hiring").length,
    applied: list.filter((c) => c.application_status !== "not_applied").length,
    interviewing: list.filter((c) => c.application_status === "interviewing").length,
    offers: list.filter((c) => c.application_status === "offer").length,
    rejected: list.filter((c) => c.application_status === "rejected").length,
  };
  return stats;
}
