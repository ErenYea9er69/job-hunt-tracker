import { NextResponse } from "next/server";
import { listCompanies, createCompany } from "@/lib/companies";

export async function GET() {
  const companies = listCompanies();
  return NextResponse.json({ companies });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const company = createCompany(body);
    return NextResponse.json({ company }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
