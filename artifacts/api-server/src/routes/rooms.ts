import { Router, type IRouter } from "express";
import { db, roomsTable, roomImagesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { CreateRoomBody, GetRoomParams, UpdateRoomBody, UpdateRoomParams, DeleteRoomParams, AddRoomImageBody, AddRoomImageParams, DeleteRoomImageParams } from "@workspace/api-zod";

const router: IRouter = Router();

async function getRoomWithImages(roomId: number) {
  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, roomId));
  if (!room) return null;
  const images = await db.select().from(roomImagesTable)
    .where(eq(roomImagesTable.roomId, roomId))
    .orderBy(asc(roomImagesTable.displayOrder));
  return formatRoom(room, images);
}

router.get("/rooms", async (_req, res) => {
  try {
    const rooms = await db.select().from(roomsTable).orderBy(asc(roomsTable.id));
    const result = await Promise.all(rooms.map(async (room) => {
      const images = await db.select().from(roomImagesTable)
        .where(eq(roomImagesTable.roomId, room.id))
        .orderBy(asc(roomImagesTable.displayOrder));
      return formatRoom(room, images);
    }));
    res.json(result);
  } catch {
    res.status(500).json({ error: "internal_error", message: "Failed to fetch rooms" });
  }
});

router.get("/rooms/:id", async (req, res) => {
  const parsed = GetRoomParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "invalid_params", message: "Invalid room ID" });
  try {
    const room = await getRoomWithImages(parsed.data.id);
    if (!room) return res.status(404).json({ error: "not_found", message: "Room not found" });
    res.json(room);
  } catch {
    res.status(500).json({ error: "internal_error", message: "Failed to fetch room" });
  }
});

router.post("/rooms", async (req, res) => {
  const parsed = CreateRoomBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "validation_error", message: parsed.error.message });
  try {
    const { name, type, pricePerNight, capacity, amenities, available, description, imageUrl } = parsed.data;
    const [room] = await db.insert(roomsTable).values({
      name, type: type as any,
      pricePerNight: String(pricePerNight),
      capacity: capacity ?? 2,
      amenities: amenities ?? [],
      available: available ?? true,
      description, imageUrl,
    }).returning();
    res.status(201).json(formatRoom(room, []));
  } catch {
    res.status(500).json({ error: "internal_error", message: "Failed to create room" });
  }
});

router.put("/rooms/:id", async (req, res) => {
  const params = UpdateRoomParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateRoomBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "validation_error", message: "Invalid input" });
  try {
    const { name, type, pricePerNight, capacity, amenities, available, description, imageUrl } = body.data;
    const [room] = await db.update(roomsTable).set({
      name, type: type as any,
      pricePerNight: String(pricePerNight),
      capacity: capacity ?? 2,
      amenities: amenities ?? [],
      available: available ?? true,
      description, imageUrl,
      updatedAt: new Date(),
    }).where(eq(roomsTable.id, params.data.id)).returning();
    if (!room) return res.status(404).json({ error: "not_found", message: "Room not found" });
    const images = await db.select().from(roomImagesTable).where(eq(roomImagesTable.roomId, room.id)).orderBy(asc(roomImagesTable.displayOrder));
    res.json(formatRoom(room, images));
  } catch {
    res.status(500).json({ error: "internal_error", message: "Failed to update room" });
  }
});

router.delete("/rooms/:id", async (req, res) => {
  const parsed = DeleteRoomParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "invalid_params", message: "Invalid room ID" });
  try {
    await db.delete(roomImagesTable).where(eq(roomImagesTable.roomId, parsed.data.id));
    await db.delete(roomsTable).where(eq(roomsTable.id, parsed.data.id));
    res.json({ success: true, message: "Room deleted" });
  } catch {
    res.status(500).json({ error: "internal_error", message: "Failed to delete room" });
  }
});

// Room images
router.get("/rooms/:id/images", async (req, res) => {
  const parsed = AddRoomImageParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "invalid_params", message: "Invalid room ID" });
  try {
    const images = await db.select().from(roomImagesTable)
      .where(eq(roomImagesTable.roomId, parsed.data.id))
      .orderBy(asc(roomImagesTable.displayOrder));
    res.json(images.map(formatImage));
  } catch {
    res.status(500).json({ error: "internal_error", message: "Failed to fetch images" });
  }
});

router.post("/rooms/:id/images", async (req, res) => {
  const params = AddRoomImageParams.safeParse({ id: Number(req.params.id) });
  const body = AddRoomImageBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "validation_error", message: "Invalid input" });
  try {
    const [image] = await db.insert(roomImagesTable).values({
      roomId: params.data.id,
      imageUrl: body.data.imageUrl,
      altText: body.data.altText,
      displayOrder: body.data.displayOrder ?? 0,
    }).returning();
    res.status(201).json(formatImage(image));
  } catch {
    res.status(500).json({ error: "internal_error", message: "Failed to add image" });
  }
});

router.delete("/rooms/:id/images/:imageId", async (req, res) => {
  const parsed = DeleteRoomImageParams.safeParse({ id: Number(req.params.id), imageId: Number(req.params.imageId) });
  if (!parsed.success) return res.status(400).json({ error: "invalid_params", message: "Invalid params" });
  try {
    await db.delete(roomImagesTable).where(eq(roomImagesTable.id, parsed.data.imageId));
    res.json({ success: true, message: "Image deleted" });
  } catch {
    res.status(500).json({ error: "internal_error", message: "Failed to delete image" });
  }
});

function formatImage(img: typeof roomImagesTable.$inferSelect) {
  return {
    id: img.id,
    roomId: img.roomId,
    imageUrl: img.imageUrl,
    altText: img.altText ?? null,
    displayOrder: img.displayOrder,
    createdAt: img.createdAt.toISOString(),
  };
}

function formatRoom(room: typeof roomsTable.$inferSelect, images: typeof roomImagesTable.$inferSelect[]) {
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
    images: images.map(formatImage),
    createdAt: room.createdAt.toISOString(),
    updatedAt: room.updatedAt.toISOString(),
  };
}

export default router;
