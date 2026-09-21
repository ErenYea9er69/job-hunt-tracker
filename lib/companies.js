import db from "@/lib/db";

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

export function listCompanies() {
  const companies = db
    .prepare(`SELECT * FROM companies ORDER BY updated_at DESC`)
    .all();
  const roles = db.prepare(`SELECT * FROM roles ORDER BY created_at ASC`).all();
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

export function getCompany(id) {
  const company = db.prepare(`SELECT * FROM companies WHERE id = ?`).get(id);
  if (!company) return null;
  const roles = db
    .prepare(`SELECT * FROM roles WHERE company_id = ? ORDER BY created_at ASC`)
    .all(id);
  return {
    ...company,
    stipend_mentioned: Boolean(company.stipend_mentioned),
    roles: roles.map((role) => ({
      ...role,
      stipend_mentioned: Boolean(role.stipend_mentioned),
    })),
  };
}

export function createCompany(input) {
  const clean = normalizeCompanyInput(input);
  const columns = Object.keys(clean);
  const placeholders = columns.map((c) => `@${c}`).join(", ");
  const stmt = db.prepare(
    `INSERT INTO companies (${columns.join(", ")}) VALUES (${placeholders})`
  );
  const result = stmt.run(clean);
  return getCompany(result.lastInsertRowid);
}

export function updateCompany(id, input) {
  const existing = db.prepare(`SELECT id FROM companies WHERE id = ?`).get(id);
  if (!existing) return null;
  const clean = normalizeCompanyInput(input);
  const assignments = Object.keys(clean)
    .map((c) => `${c} = @${c}`)
    .join(", ");
  const stmt = db.prepare(
    `UPDATE companies SET ${assignments}, updated_at = datetime('now') WHERE id = @id`
  );
  stmt.run({ ...clean, id });
  return getCompany(id);
}

export function deleteCompany(id) {
  const result = db.prepare(`DELETE FROM companies WHERE id = ?`).run(id);
  return result.changes > 0;
}

export function addRole(companyId, input) {
  const stmt = db.prepare(`
    INSERT INTO roles (company_id, title, link, stipend_mentioned, stipend_details, notes)
    VALUES (@company_id, @title, @link, @stipend_mentioned, @stipend_details, @notes)
  `);
  const result = stmt.run({
    company_id: companyId,
    title: input.title,
    link: input.link || null,
    stipend_mentioned: input.stipend_mentioned ? 1 : 0,
    stipend_details: input.stipend_details || null,
    notes: input.notes || null,
  });
  const role = db
    .prepare(`SELECT * FROM roles WHERE id = ?`)
    .get(result.lastInsertRowid);
  return { ...role, stipend_mentioned: Boolean(role.stipend_mentioned) };
}

export function updateRole(id, input) {
  const existing = db.prepare(`SELECT id FROM roles WHERE id = ?`).get(id);
  if (!existing) return null;
  const stmt = db.prepare(`
    UPDATE roles
    SET title = @title,
        link = @link,
        stipend_mentioned = @stipend_mentioned,
        stipend_details = @stipend_details,
        notes = @notes
    WHERE id = @id
  `);
  stmt.run({
    id,
    title: input.title,
    link: input.link || null,
    stipend_mentioned: input.stipend_mentioned ? 1 : 0,
    stipend_details: input.stipend_details || null,
    notes: input.notes || null,
  });
  const role = db.prepare(`SELECT * FROM roles WHERE id = ?`).get(id);
  return { ...role, stipend_mentioned: Boolean(role.stipend_mentioned) };
}

export function deleteRole(id) {
  const result = db.prepare(`DELETE FROM roles WHERE id = ?`).run(id);
  return result.changes > 0;
}

export function getStats(companies) {
  const list = companies || listCompanies();
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
