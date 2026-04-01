import { pgTable, serial, text, integer, decimal, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const roomTypeEnum = pgEnum("room_type", ["standard", "deluxe", "suite", "penthouse"]);
export const bookingStatusEnum = pgEnum("booking_status", ["confirmed", "cancelled", "pending"]);
export const diningCategoryEnum = pgEnum("dining_category", ["breakfast", "lunch", "dinner", "drinks", "dessert"]);

export const roomsTable = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: roomTypeEnum("type").notNull().default("standard"),
  pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
  capacity: integer("capacity").notNull().default(2),
  amenities: text("amenities").array().notNull().default([]),
  available: boolean("available").notNull().default(true),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const roomImagesTable = pgTable("room_images", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull().references(() => roomsTable.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  altText: text("alt_text"),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull().references(() => roomsTable.id),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  checkIn: text("check_in").notNull(),
  checkOut: text("check_out").notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: bookingStatusEnum("status").notNull().default("confirmed"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const diningItemsTable = pgTable("dining_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: diningCategoryEnum("category").notNull().default("dinner"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  available: boolean("available").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const hotelSettingsTable = pgTable("hotel_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertRoomSchema = createInsertSchema(roomsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRoomImageSchema = createInsertSchema(roomImagesTable).omit({ id: true, createdAt: true });
export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDiningItemSchema = createInsertSchema(diningItemsTable).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof roomsTable.$inferSelect;
export type RoomImage = typeof roomImagesTable.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
export type DiningItem = typeof diningItemsTable.$inferSelect;
