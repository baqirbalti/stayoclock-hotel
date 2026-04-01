import { Router, type IRouter } from "express";
import { db, hotelSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const SETTING_KEYS = ["facebookUrl", "twitterUrl", "instagramUrl", "phone", "email", "address", "hotelName"] as const;
type SettingKey = typeof SETTING_KEYS[number];

async function getAllSettings(): Promise<Record<string, string>> {
  const rows = await db.select().from(hotelSettingsTable);
  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return settings;
}

router.get("/settings", async (_req, res) => {
  try {
    const settings = await getAllSettings();
    res.json(settings);
  } catch {
    res.status(500).json({ error: "internal_error", message: "Failed to fetch settings" });
  }
});

router.put("/settings", async (req, res) => {
  try {
    const body = req.body as Record<string, string>;
    for (const key of SETTING_KEYS) {
      if (key in body) {
        const value = body[key] ?? "";
        const existing = await db.select().from(hotelSettingsTable).where(eq(hotelSettingsTable.key, key));
        if (existing.length > 0) {
          await db.update(hotelSettingsTable).set({ value, updatedAt: new Date() }).where(eq(hotelSettingsTable.key, key));
        } else {
          await db.insert(hotelSettingsTable).values({ key, value });
        }
      }
    }
    const updated = await getAllSettings();
    res.json(updated);
  } catch {
    res.status(500).json({ error: "internal_error", message: "Failed to update settings" });
  }
});

export default router;
