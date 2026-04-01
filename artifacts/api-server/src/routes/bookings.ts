import { Router, type IRouter } from "express";
import { db, bookingsTable, roomsTable, roomImagesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { CreateBookingBody, CancelBookingParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/bookings", async (_req, res) => {
  try {
    const rows = await db.select().from(bookingsTable)
      .leftJoin(roomsTable, eq(bookingsTable.roomId, roomsTable.id))
      .orderBy(asc(bookingsTable.id));

    const result = await Promise.all(rows.map(async ({ bookings, rooms }) => {
      let roomImages: typeof roomImagesTable.$inferSelect[] = [];
      if (rooms) {
        roomImages = await db.select().from(roomImagesTable).where(eq(roomImagesTable.roomId, rooms.id)).orderBy(asc(roomImagesTable.displayOrder));
      }
      return formatBooking(bookings, rooms ?? undefined, roomImages);
    }));
    res.json(result);
  } catch {
    res.status(500).json({ error: "internal_error", message: "Failed to fetch bookings" });
  }
});

router.post("/bookings", async (req, res) => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "validation_error", message: parsed.error.message });

  const { roomId, guestName, guestEmail, checkIn, checkOut } = parsed.data;
  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, roomId));
  if (!room) return res.status(400).json({ error: "not_found", message: "Room not found" });
  if (!room.available) return res.status(400).json({ error: "unavailable", message: "Room is not available" });

  const nights = Math.max(1, Math.ceil(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
  ));
  const totalPrice = parseFloat(room.pricePerNight) * nights;

  try {
    const [booking] = await db.insert(bookingsTable).values({
      roomId, guestName, guestEmail, checkIn, checkOut,
      totalPrice: String(totalPrice), status: "confirmed",
    }).returning();
    const images = await db.select().from(roomImagesTable).where(eq(roomImagesTable.roomId, room.id)).orderBy(asc(roomImagesTable.displayOrder));
    res.status(201).json(formatBooking(booking, room, images));
  } catch {
    res.status(500).json({ error: "internal_error", message: "Failed to create booking" });
  }
});

router.delete("/bookings/:id", async (req, res) => {
  const parsed = CancelBookingParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "invalid_params", message: "Invalid booking ID" });
  try {
    const [booking] = await db.update(bookingsTable)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(bookingsTable.id, parsed.data.id))
      .returning();
    if (!booking) return res.status(404).json({ error: "not_found", message: "Booking not found" });
    const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, booking.roomId));
    const images = room ? await db.select().from(roomImagesTable).where(eq(roomImagesTable.roomId, room.id)).orderBy(asc(roomImagesTable.displayOrder)) : [];
    res.json(formatBooking(booking, room, images));
  } catch {
    res.status(500).json({ error: "internal_error", message: "Failed to cancel booking" });
  }
});

function formatImage(img: typeof roomImagesTable.$inferSelect) {
  return {
    id: img.id, roomId: img.roomId, imageUrl: img.imageUrl,
    altText: img.altText ?? null, displayOrder: img.displayOrder,
    createdAt: img.createdAt.toISOString(),
  };
}

function formatRoom(room: typeof roomsTable.$inferSelect, images: typeof roomImagesTable.$inferSelect[]) {
  return {
    id: room.id, name: room.name, type: room.type,
    pricePerNight: parseFloat(room.pricePerNight), capacity: room.capacity,
    amenities: room.amenities ?? [], available: room.available,
    description: room.description, imageUrl: room.imageUrl ?? null,
    images: images.map(formatImage),
    createdAt: room.createdAt.toISOString(), updatedAt: room.updatedAt.toISOString(),
  };
}

function formatBooking(
  booking: typeof bookingsTable.$inferSelect,
  room?: typeof roomsTable.$inferSelect,
  images: typeof roomImagesTable.$inferSelect[] = []
) {
  return {
    id: booking.id, roomId: booking.roomId, guestName: booking.guestName,
    guestEmail: booking.guestEmail, checkIn: booking.checkIn, checkOut: booking.checkOut,
    totalPrice: parseFloat(booking.totalPrice), status: booking.status,
    createdAt: booking.createdAt.toISOString(), updatedAt: booking.updatedAt.toISOString(),
    room: room ? formatRoom(room, images) : null,
  };
}

export default router;
