import { NextResponse } from "next/server";
import { listCompanies, createCompany } from "@/lib/companies";

export async function GET() {
  const companies = await listCompanies();
  return NextResponse.json({ companies });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const company = await createCompany(body);
    return NextResponse.json({ company }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
