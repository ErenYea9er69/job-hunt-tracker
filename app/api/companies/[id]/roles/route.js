import { NextResponse } from "next/server";
import { addRole, getCompany } from "@/lib/companies";

export async function POST(request, { params }) {
  const { id } = await params;
  const company = await getCompany(id);
  if (!company) {
    return NextResponse.json({ error: "Company not found." }, { status: 404 });
  }
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: "Role title is required." }, { status: 400 });
    }
    const role = await addRole(id, body);
    return NextResponse.json({ role }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
