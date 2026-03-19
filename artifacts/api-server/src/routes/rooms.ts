import { Router, type IRouter } from "express";
import { db, roomsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateRoomBody, GetRoomParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/rooms", async (_req, res) => {
  try {
    const rooms = await db.select().from(roomsTable).orderBy(roomsTable.id);
    res.json(rooms.map(formatRoom));
  } catch (err) {
    res.status(500).json({ error: "internal_error", message: "Failed to fetch rooms" });
  }
});

router.get("/rooms/:id", async (req, res) => {
  const parsed = GetRoomParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_params", message: "Invalid room ID" });
  }
  try {
    const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, parsed.data.id));
    if (!room) return res.status(404).json({ error: "not_found", message: "Room not found" });
    res.json(formatRoom(room));
  } catch (err) {
    res.status(500).json({ error: "internal_error", message: "Failed to fetch room" });
  }
});

router.post("/rooms", async (req, res) => {
  const parsed = CreateRoomBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "validation_error", message: parsed.error.message });
  }
  try {
    const { name, type, pricePerNight, capacity, amenities, available, description, imageUrl } = parsed.data;
    const [room] = await db.insert(roomsTable).values({
      name,
      type: type as any,
      pricePerNight: String(pricePerNight),
      capacity: capacity ?? 2,
      amenities: amenities ?? [],
      available: available ?? true,
      description,
      imageUrl,
    }).returning();
    res.status(201).json(formatRoom(room));
  } catch (err) {
    res.status(500).json({ error: "internal_error", message: "Failed to create room" });
  }
});

function formatRoom(room: typeof roomsTable.$inferSelect) {
  return {
    id: room.id,
    name: room.name,
    type: room.type,
    pricePerNight: parseFloat(room.pricePerNight),
    capacity: room.capacity,
    amenities: room.amenities ?? [],
    available: room.available,
    description: room.description,
    imageUrl: room.imageUrl ?? null,
    createdAt: room.createdAt.toISOString(),
    updatedAt: room.updatedAt.toISOString(),
  };
}

export default router;
