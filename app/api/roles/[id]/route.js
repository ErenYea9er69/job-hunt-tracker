import { NextResponse } from "next/server";
import { updateRole, deleteRole } from "@/lib/companies";

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const role = updateRole(id, body);
    if (!role) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ role });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const deleted = deleteRole(id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
