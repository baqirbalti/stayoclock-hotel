// Helper to get consistent placeholder images for rooms if API doesn't provide them
const roomImages = [
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200",
];

export function getRoomImage(id: number, providedUrl?: string | null): string {
  if (providedUrl) return providedUrl;
  return roomImages[id % roomImages.length];
}
