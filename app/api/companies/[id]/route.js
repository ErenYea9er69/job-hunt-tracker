import { NextResponse } from "next/server";
import { getCompany, updateCompany, deleteCompany } from "@/lib/companies";

export async function GET(request, { params }) {
  const { id } = await params;
  const company = await getCompany(id);
  if (!company) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({ company });
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const company = await updateCompany(id, body);
    if (!company) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ company });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const deleted = await deleteCompany(id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
