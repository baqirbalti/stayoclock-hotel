import { Router, type IRouter } from "express";
import { db, bookingsTable, roomsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateBookingBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/bookings", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(bookingsTable)
      .leftJoin(roomsTable, eq(bookingsTable.roomId, roomsTable.id))
      .orderBy(bookingsTable.id);

    res.json(rows.map(({ bookings, rooms }) => formatBooking(bookings, rooms ?? undefined)));
  } catch (err) {
    res.status(500).json({ error: "internal_error", message: "Failed to fetch bookings" });
  }
});

router.post("/bookings", async (req, res) => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "validation_error", message: parsed.error.message });
  }

  const { roomId, guestName, guestEmail, checkIn, checkOut } = parsed.data;

  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, roomId));
  if (!room) {
    return res.status(400).json({ error: "not_found", message: "Room not found" });
  }
  if (!room.available) {
    return res.status(400).json({ error: "unavailable", message: "Room is not available" });
  }

  const nights = Math.max(
    1,
    Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
  );
  const totalPrice = parseFloat(room.pricePerNight) * nights;

  try {
    const [booking] = await db.insert(bookingsTable).values({
      roomId,
      guestName,
      guestEmail,
      checkIn,
      checkOut,
      totalPrice: String(totalPrice),
      status: "confirmed",
    }).returning();

    res.status(201).json(formatBooking(booking, room));
  } catch (err) {
    res.status(500).json({ error: "internal_error", message: "Failed to create booking" });
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

function formatBooking(
  booking: typeof bookingsTable.$inferSelect,
  room?: typeof roomsTable.$inferSelect
) {
  return {
    id: booking.id,
    roomId: booking.roomId,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    totalPrice: parseFloat(booking.totalPrice),
    status: booking.status,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    room: room ? formatRoom(room) : null,
  };
}

export default router;
