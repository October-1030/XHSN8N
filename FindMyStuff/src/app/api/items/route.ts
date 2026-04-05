import { NextRequest, NextResponse } from "next/server";
import db, { Item } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  let items: Item[];
  if (q) {
    items = db
      .prepare(
        `SELECT * FROM items
         WHERE name LIKE ? OR category LIKE ? OR location LIKE ? OR detail_location LIKE ? OR note LIKE ?
         ORDER BY updated_at DESC`
      )
      .all(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`) as Item[];
  } else {
    items = db.prepare("SELECT * FROM items ORDER BY updated_at DESC").all() as Item[];
  }

  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, category, location, detail_location, photo, note } = body;

  if (!name || !location) {
    return NextResponse.json({ error: "物品名称和存放位置不能为空" }, { status: 400 });
  }

  const id = uuidv4();
  db.prepare(
    `INSERT INTO items (id, name, category, location, detail_location, photo, note)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, name, category || "其他", location, detail_location || "", photo || "", note || "");

  const item = db.prepare("SELECT * FROM items WHERE id = ?").get(id) as Item;
  return NextResponse.json(item, { status: 201 });
}
