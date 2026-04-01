import { Router, type IRouter } from "express";
import { db, diningItemsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { CreateDiningItemBody, UpdateDiningItemParams, UpdateDiningItemBody, DeleteDiningItemParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dining", async (_req, res) => {
  try {
    const items = await db.select().from(diningItemsTable).orderBy(asc(diningItemsTable.displayOrder), asc(diningItemsTable.id));
    res.json(items.map(formatItem));
  } catch {
    res.status(500).json({ error: "internal_error", message: "Failed to fetch dining items" });
  }
});

router.post("/dining", async (req, res) => {
  const parsed = CreateDiningItemBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "validation_error", message: parsed.error.message });
  try {
    const [item] = await db.insert(diningItemsTable).values({
      name: parsed.data.name,
      description: parsed.data.description,
      category: parsed.data.category as any ?? "dinner",
      price: String(parsed.data.price),
      imageUrl: parsed.data.imageUrl ?? null,
      available: parsed.data.available ?? true,
      displayOrder: parsed.data.displayOrder ?? 0,
    }).returning();
    res.status(201).json(formatItem(item));
  } catch {
    res.status(500).json({ error: "internal_error", message: "Failed to create dining item" });
  }
});

router.put("/dining/:id", async (req, res) => {
  const params = UpdateDiningItemParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateDiningItemBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "validation_error", message: "Invalid input" });
  try {
    const [item] = await db.update(diningItemsTable).set({
      name: body.data.name,
      description: body.data.description,
      category: body.data.category as any,
      price: String(body.data.price),
      imageUrl: body.data.imageUrl ?? null,
      available: body.data.available ?? true,
      displayOrder: body.data.displayOrder ?? 0,
      updatedAt: new Date(),
    }).where(eq(diningItemsTable.id, params.data.id)).returning();
    if (!item) return res.status(404).json({ error: "not_found", message: "Dining item not found" });
    res.json(formatItem(item));
  } catch {
    res.status(500).json({ error: "internal_error", message: "Failed to update dining item" });
  }
});

router.delete("/dining/:id", async (req, res) => {
  const parsed = DeleteDiningItemParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "invalid_params", message: "Invalid ID" });
  try {
    await db.delete(diningItemsTable).where(eq(diningItemsTable.id, parsed.data.id));
    res.json({ success: true, message: "Dining item deleted" });
  } catch {
    res.status(500).json({ error: "internal_error", message: "Failed to delete dining item" });
  }
});

function formatItem(item: typeof diningItemsTable.$inferSelect) {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    category: item.category,
    price: parseFloat(item.price),
    imageUrl: item.imageUrl ?? null,
    available: item.available,
    displayOrder: item.displayOrder,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export default router;
