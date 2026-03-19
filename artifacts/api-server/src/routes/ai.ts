import { Router, type IRouter } from "express";
import { db, roomsTable } from "@workspace/db";
import { AiChatBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const MOCK_ROOMS = [
  { name: "Garden Standard", type: "standard", pricePerNight: 89, capacity: 2, amenities: ["WiFi", "TV", "Garden View"], available: true },
  { name: "Ocean Deluxe", type: "deluxe", pricePerNight: 159, capacity: 2, amenities: ["WiFi", "TV", "Ocean View", "Mini Bar"], available: true },
  { name: "Grand Suite", type: "suite", pricePerNight: 299, capacity: 4, amenities: ["WiFi", "TV", "Ocean View", "Mini Bar", "Jacuzzi", "Living Room"], available: true },
  { name: "Royal Penthouse", type: "penthouse", pricePerNight: 599, capacity: 6, amenities: ["WiFi", "TV", "Panoramic View", "Full Bar", "Private Pool", "Butler Service"], available: false },
];

type Tool = "check_room_availability" | "get_room_details" | "general";

function detectTool(message: string): Tool {
  const lower = message.toLowerCase();
  if (lower.includes("available") || lower.includes("availability") || lower.includes("free") || lower.includes("book")) {
    return "check_room_availability";
  }
  if (lower.includes("detail") || lower.includes("about") || lower.includes("info") || lower.includes("price") || lower.includes("ameniti") || lower.includes("feature")) {
    return "get_room_details";
  }
  return "general";
}

function checkRoomAvailability() {
  const available = MOCK_ROOMS.filter(r => r.available);
  if (available.length === 0) {
    return { response: "I'm sorry, all our rooms are currently booked. Please check back later or call our front desk for assistance.", tool: "check_room_availability", data: [] };
  }
  const list = available.map(r => `• **${r.name}** (${r.type}) — $${r.pricePerNight}/night, sleeps ${r.capacity}`).join("\n");
  return {
    response: `We currently have ${available.length} room(s) available:\n\n${list}\n\nWould you like to know more about any of these rooms or make a booking?`,
    tool: "check_room_availability",
    data: available
  };
}

function getRoomDetails(message: string) {
  const lower = message.toLowerCase();
  let matchedRoom = MOCK_ROOMS.find(r => lower.includes(r.type) || lower.includes(r.name.toLowerCase()));

  if (!matchedRoom) {
    const details = MOCK_ROOMS.map(r =>
      `**${r.name}** (${r.type})\n  Price: $${r.pricePerNight}/night | Capacity: ${r.capacity} guests | ${r.available ? "✅ Available" : "❌ Unavailable"}\n  Amenities: ${r.amenities.join(", ")}`
    ).join("\n\n");
    return {
      response: `Here's an overview of all our rooms:\n\n${details}`,
      tool: "get_room_details",
      data: MOCK_ROOMS
    };
  }

  return {
    response: `**${matchedRoom.name}** — ${matchedRoom.type.charAt(0).toUpperCase() + matchedRoom.type.slice(1)} Room\n\n💰 Price: $${matchedRoom.pricePerNight}/night\n👥 Capacity: ${matchedRoom.capacity} guests\n${matchedRoom.available ? "✅ Currently Available" : "❌ Currently Unavailable"}\n🏷️ Amenities: ${matchedRoom.amenities.join(", ")}\n\n${matchedRoom.available ? "This room is available for booking! Head to our Rooms page to reserve it." : "This room is currently fully booked. We have other great options available!"}`,
    tool: "get_room_details",
    data: matchedRoom
  };
}

function generalResponse(message: string) {
  const lower = message.toLowerCase();

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return { response: "Welcome to our hotel! 🏨 I'm your AI concierge. I can help you:\n• Check room availability\n• Get details about our rooms and amenities\n• Answer questions about pricing\n\nHow can I assist you today?", tool: null, data: null };
  }
  if (lower.includes("checkout") || lower.includes("check out") || lower.includes("check-out")) {
    return { response: "Standard checkout time is 11:00 AM. Late checkout may be available upon request for an additional fee. Early checkout is also possible — just let our front desk know!", tool: null, data: null };
  }
  if (lower.includes("checkin") || lower.includes("check in") || lower.includes("check-in")) {
    return { response: "Standard check-in time is 3:00 PM. Early check-in is available based on room availability. Please contact the front desk in advance to arrange this.", tool: null, data: null };
  }
  if (lower.includes("cancel")) {
    return { response: "Our cancellation policy allows free cancellation up to 48 hours before check-in. Cancellations within 48 hours may incur a one-night fee. Please contact our front desk or manage your booking through our Bookings page.", tool: null, data: null };
  }
  if (lower.includes("pool") || lower.includes("gym") || lower.includes("spa") || lower.includes("restaurant") || lower.includes("ameniti")) {
    return { response: "Our hotel features world-class amenities:\n\n🏊 **Pool** — Open 7AM–10PM (heated, indoor & outdoor)\n💪 **Fitness Center** — Open 24/7\n🧖 **Spa** — Open 9AM–8PM, treatments available\n🍽️ **Restaurant** — Breakfast 7–10AM, Lunch 12–3PM, Dinner 6–10PM\n☕ **Lobby Bar** — Open until midnight\n\nIs there anything specific you'd like to know?", tool: null, data: null };
  }

  return {
    response: "I'd be happy to help! I can tell you about our available rooms, pricing, amenities, or help with booking questions. What would you like to know?",
    tool: null,
    data: null
  };
}

router.post("/ai/chat", async (req, res) => {
  const parsed = AiChatBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "validation_error", message: parsed.error.message });
  }

  const { message } = parsed.data;
  const tool = detectTool(message);

  let result;
  if (tool === "check_room_availability") {
    result = checkRoomAvailability();
  } else if (tool === "get_room_details") {
    result = getRoomDetails(message);
  } else {
    result = generalResponse(message);
  }

  res.json(result);
});

export default router;
