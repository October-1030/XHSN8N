import { NextRequest, NextResponse } from "next/server";
import db, { Item } from "@/lib/db";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = db.prepare("SELECT * FROM items WHERE id = ?").get(id);
  if (!item) {
    return NextResponse.json({ error: "物品不存在" }, { status: 404 });
  }

  db.prepare("DELETE FROM items WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const existing = db.prepare("SELECT * FROM items WHERE id = ?").get(id);
  if (!existing) {
    return NextResponse.json({ error: "物品不存在" }, { status: 404 });
  }

  const body = await request.json();
  const { name, category, location, detail_location, photo, note } = body;

  db.prepare(
    `UPDATE items SET name = ?, category = ?, location = ?, detail_location = ?, photo = ?, note = ?, updated_at = datetime('now', 'localtime')
     WHERE id = ?`
  ).run(
    name || (existing as Item).name,
    category || (existing as Item).category,
    location || (existing as Item).location,
    detail_location ?? (existing as Item).detail_location,
    photo ?? (existing as Item).photo,
    note ?? (existing as Item).note,
    id
  );

  const item = db.prepare("SELECT * FROM items WHERE id = ?").get(id) as Item;
  return NextResponse.json(item);
}
