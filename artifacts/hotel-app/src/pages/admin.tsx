import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  useListRooms, useCreateRoom, useUpdateRoom, useDeleteRoom,
  useListRoomImages, useAddRoomImage, useDeleteRoomImage,
  useListDining, useCreateDiningItem, useUpdateDiningItem, useDeleteDiningItem,
  useGetSettings, useUpdateSettings,
} from "@workspace/api-client-react";

import { Pencil, Trash2, Plus, X, Upload, Loader2, BedDouble, UtensilsCrossed, Settings, ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "rooms" | "dining" | "settings";

const ROOM_TYPES = ["standard", "deluxe", "suite", "penthouse"] as const;
const DINING_CATEGORIES = ["breakfast", "lunch", "dinner", "drinks", "dessert"] as const;

const emptyRoom = { name: "", type: "standard" as const, pricePerNight: 0, capacity: 2, description: "", amenities: [] as string[], available: true, imageUrl: "" };
const emptyDining = { name: "", description: "", category: "dinner" as const, price: 0, imageUrl: "", available: true, displayOrder: 0 };

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white font-medium ${
        type === "success" ? "bg-green-600" : "bg-destructive"
      }`}
    >
      {type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      {message}
    </motion.div>
  );
}

function ImageManager({ roomId, onClose }: { roomId: number; onClose: () => void }) {
  const { data: images = [], refetch } = useListRoomImages(roomId);
  const { mutateAsync: addImage } = useAddRoomImage(roomId);
  const { mutateAsync: deleteImage } = useDeleteRoomImage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const res = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });
      if (!res.ok) throw new Error("Failed to get upload URL");
      const { uploadURL, objectPath } = await res.json();
      const uploadRes = await fetch(uploadURL, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      if (!uploadRes.ok) throw new Error("Upload to storage failed");
      await addImage({ id: roomId, data: { imageUrl: `/api/storage${objectPath}`, altText: file.name, displayOrder: images.length } });
      refetch();
      showToast("Image uploaded successfully!");
    } catch (err) {
      showToast("Upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleUrlAdd = async () => {
    if (!urlInput.trim()) return;
    try {
      await addImage({ id: roomId, data: { imageUrl: urlInput.trim(), displayOrder: images.length } });
      setUrlInput("");
      refetch();
      showToast("Image added successfully!");
    } catch {
      showToast("Failed to add image.", "error");
    }
  };

  const handleDelete = async (imageId: number) => {
    try {
      await deleteImage({ id: roomId, imageId });
      refetch();
      showToast("Image removed.");
    } catch {
      showToast("Failed to delete image.", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-bold flex items-center gap-2"><ImageIcon size={20} className="text-primary" /> Room Images</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>

        {/* Existing images */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {images.map(img => (
              <div key={img.id} className="relative group rounded-lg overflow-hidden aspect-video bg-muted">
                <img
                  src={img.imageUrl.startsWith("/objects/") ? `/api/storage${img.imageUrl}` : img.imageUrl}
                  alt={img.altText || "Room image"}
                  className="w-full h-full object-cover"
                  onError={e => (e.currentTarget.src = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400")}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="bg-destructive text-white rounded-lg p-1.5 hover:bg-destructive/90"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">#{img.displayOrder + 1}</div>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-xl mb-6">
            <ImageIcon size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No images yet. Upload or add a URL below.</p>
          </div>
        )}

        {/* Upload file */}
        <div className="flex gap-3 mb-4">
          <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2.5 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold text-sm disabled:opacity-50"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>

        {/* URL input */}
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="Or paste an image URL..."
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            onKeyDown={e => e.key === "Enter" && handleUrlAdd()}
          />
          <button
            onClick={handleUrlAdd}
            disabled={!urlInput.trim()}
            className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 disabled:opacity-50"
          >
            Add URL
          </button>
        </div>

        <AnimatePresence>
          {toast && <Toast message={toast.message} type={toast.type} />}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function RoomForm({ room, onSave, onCancel }: { room?: any; onSave: (data: any) => Promise<void>; onCancel: () => void }) {
  const [form, setForm] = useState(room ? {
    name: room.name, type: room.type, pricePerNight: room.pricePerNight,
    capacity: room.capacity, description: room.description,
    amenities: room.amenities || [], available: room.available, imageUrl: room.imageUrl || ""
  } : emptyRoom);
  const [amenityInput, setAmenityInput] = useState((room?.amenities || []).join(", "));
  const [saving, setSaving] = useState(false);

  const set = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const amenities = amenityInput.split(",").map(a => a.trim()).filter(Boolean);
      await onSave({ ...form, amenities, pricePerNight: Number(form.pricePerNight), capacity: Number(form.capacity) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onCancel}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg p-6 my-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-bold">{room ? "Edit Room" : "Add New Room"}</h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-semibold text-foreground mb-1 block">Room Name *</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} required placeholder="e.g. Ocean Suite" className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1 block">Room Type *</label>
              <select value={form.type} onChange={e => set("type", e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                {ROOM_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1 block">Price/Night ($) *</label>
              <input type="number" min={0} value={form.pricePerNight} onChange={e => set("pricePerNight", e.target.value)} required className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1 block">Capacity (guests) *</label>
              <input type="number" min={1} value={form.capacity} onChange={e => set("capacity", e.target.value)} required className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <input type="checkbox" id="available" checked={form.available} onChange={e => set("available", e.target.checked)} className="w-4 h-4 accent-primary" />
              <label htmlFor="available" className="text-sm font-semibold text-foreground">Available for booking</label>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-1 block">Description *</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} required rows={3} placeholder="Describe this room..." className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-1 block">Amenities (comma-separated)</label>
            <input value={amenityInput} onChange={e => setAmenityInput(e.target.value)} placeholder="WiFi, TV, Ocean View, Mini Bar..." className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-border text-foreground rounded-lg font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save Room"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function DiningForm({ item, onSave, onCancel }: { item?: any; onSave: (data: any) => Promise<void>; onCancel: () => void }) {
  const [form, setForm] = useState(item ? {
    name: item.name, description: item.description, category: item.category,
    price: item.price, imageUrl: item.imageUrl || "", available: item.available, displayOrder: item.displayOrder
  } : emptyDining);
  const [saving, setSaving] = useState(false);
  const set = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave({ ...form, price: Number(form.price), displayOrder: Number(form.displayOrder) }); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onCancel}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg p-6 my-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-bold">{item ? "Edit Menu Item" : "Add Menu Item"}</h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-foreground mb-1 block">Item Name *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} required placeholder="e.g. Wagyu Beef Tenderloin" className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-1 block">Category *</label>
              <select value={form.category} onChange={e => set("category", e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                {DINING_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1 block">Price ($) *</label>
              <input type="number" min={0} step={0.01} value={form.price} onChange={e => set("price", e.target.value)} required className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground mb-1 block">Description *</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} required rows={3} placeholder="Describe this dish..." className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground mb-1 block">Image URL (optional)</label>
            <input type="url" value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)} placeholder="https://..." className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="avail" checked={form.available} onChange={e => set("available", e.target.checked)} className="w-4 h-4 accent-primary" />
            <label htmlFor="avail" className="text-sm font-semibold text-foreground">Available on menu</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-border text-foreground rounded-lg font-semibold text-sm hover:bg-muted">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save Item"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>("rooms");
  const [roomForm, setRoomForm] = useState<any>(null);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [managingImages, setManagingImages] = useState<number | null>(null);
  const [diningForm, setDiningForm] = useState<any>(null);
  const [editingDining, setEditingDining] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const { data: rooms = [], isLoading: roomsLoading, refetch: refetchRooms } = useListRooms();
  const { data: dining = [], isLoading: diningLoading, refetch: refetchDining } = useListDining();
  const { data: settings, refetch: refetchSettings } = useGetSettings();

  const { mutateAsync: createRoom } = useCreateRoom();
  const { mutateAsync: updateRoom } = useUpdateRoom();
  const { mutateAsync: deleteRoom } = useDeleteRoom();
  const { mutateAsync: createDining } = useCreateDiningItem();
  const { mutateAsync: updateDining } = useUpdateDiningItem();
  const { mutateAsync: deleteDining } = useDeleteDiningItem();
  const { mutateAsync: updateSettings } = useUpdateSettings();

  const [settingsForm, setSettingsForm] = useState({ facebookUrl: "", twitterUrl: "", instagramUrl: "", phone: "", email: "", address: "", hotelName: "" });
  const [settingsSaving, setSettingsSaving] = useState(false);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (settings) {
      const s = settings as any;
      setSettingsForm({
        facebookUrl: s.facebookUrl || "",
        twitterUrl: s.twitterUrl || "",
        instagramUrl: s.instagramUrl || "",
        phone: s.phone || "",
        email: s.email || "",
        address: s.address || "",
        hotelName: s.hotelName || "",
      });
    }
  }, [settings]);

  const handleSaveRoom = async (data: any) => {
    try {
      if (editingRoom) {
        await updateRoom({ id: editingRoom.id, data });
        showToast("Room updated successfully!");
      } else {
        await createRoom({ data });
        showToast("Room created successfully!");
      }
      setRoomForm(null);
      setEditingRoom(null);
      refetchRooms();
    } catch {
      showToast("Failed to save room.", "error");
    }
  };

  const handleDeleteRoom = async (id: number) => {
    if (!confirm("Delete this room? This cannot be undone.")) return;
    try {
      await deleteRoom({ id });
      showToast("Room deleted.");
      refetchRooms();
    } catch {
      showToast("Failed to delete room.", "error");
    }
  };

  const handleSaveDining = async (data: any) => {
    try {
      if (editingDining) {
        await updateDining({ id: editingDining.id, data });
        showToast("Menu item updated!");
      } else {
        await createDining({ data });
        showToast("Menu item added!");
      }
      setDiningForm(null);
      setEditingDining(null);
      refetchDining();
    } catch {
      showToast("Failed to save menu item.", "error");
    }
  };

  const handleDeleteDining = async (id: number) => {
    if (!confirm("Delete this menu item?")) return;
    try {
      await deleteDining({ id });
      showToast("Menu item deleted.");
      refetchDining();
    } catch {
      showToast("Failed to delete item.", "error");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    try {
      await updateSettings({ data: settingsForm });
      showToast("Settings saved!");
      refetchSettings();
    } catch {
      showToast("Failed to save settings.", "error");
    } finally {
      setSettingsSaving(false);
    }
  };

  const TABS = [
    { key: "rooms" as Tab, label: "Rooms", icon: BedDouble },
    { key: "dining" as Tab, label: "Dining", icon: UtensilsCrossed },
    { key: "settings" as Tab, label: "Settings", icon: Settings },
  ];

  return (
    <AppLayout>
      <div className="bg-foreground text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Administration Panel</h1>
          <p className="text-white/70">Manage rooms, dining menu, and hotel settings.</p>
        </div>
      </div>

      <div className="bg-background min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">

          {/* Tab Navigation */}
          <div className="flex gap-1 bg-muted p-1 rounded-xl mb-8 w-fit">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    activeTab === tab.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ── ROOMS TAB ── */}
          {activeTab === "rooms" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground">Room Management</h2>
                  <p className="text-muted-foreground text-sm mt-1">{rooms.length} room{rooms.length !== 1 ? "s" : ""} total</p>
                </div>
                <button
                  onClick={() => { setEditingRoom(null); setRoomForm({}); }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Plus size={16} /> Add Room
                </button>
              </div>

              {roomsLoading ? (
                <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}</div>
              ) : (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="text-left p-4 font-semibold text-muted-foreground">Room</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground hidden md:table-cell">Type</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground hidden sm:table-cell">Price/Night</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground hidden lg:table-cell">Capacity</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground hidden md:table-cell">Status</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground hidden lg:table-cell">Images</th>
                        <th className="text-right p-4 font-semibold text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {rooms.map(room => (
                        <tr key={room.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-4">
                            <p className="font-semibold text-foreground">{room.name}</p>
                            <p className="text-xs text-muted-foreground md:hidden capitalize">{room.type} · ${room.pricePerNight}/night</p>
                          </td>
                          <td className="p-4 hidden md:table-cell capitalize text-muted-foreground">{room.type}</td>
                          <td className="p-4 hidden sm:table-cell font-medium text-foreground">${room.pricePerNight}</td>
                          <td className="p-4 hidden lg:table-cell text-muted-foreground">{room.capacity} guests</td>
                          <td className="p-4 hidden md:table-cell">
                            <span className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${room.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {room.available ? "Available" : "Booked"}
                            </span>
                          </td>
                          <td className="p-4 hidden lg:table-cell">
                            <button
                              onClick={() => setManagingImages(room.id)}
                              className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                            >
                              <ImageIcon size={13} /> {room.images?.length || 0} photo{room.images?.length !== 1 ? "s" : ""}
                            </button>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setManagingImages(room.id)}
                                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors lg:hidden"
                                title="Manage Images"
                              >
                                <ImageIcon size={15} />
                              </button>
                              <button
                                onClick={() => { setEditingRoom(room); setRoomForm(room); }}
                                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteRoom(room.id)}
                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {rooms.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                      <BedDouble size={40} className="mx-auto mb-3 opacity-30" />
                      <p>No rooms yet. Add your first room!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── DINING TAB ── */}
          {activeTab === "dining" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground">Dining Menu</h2>
                  <p className="text-muted-foreground text-sm mt-1">{dining.length} item{dining.length !== 1 ? "s" : ""} total</p>
                </div>
                <button
                  onClick={() => { setEditingDining(null); setDiningForm({}); }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Plus size={16} /> Add Item
                </button>
              </div>

              {diningLoading ? (
                <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}</div>
              ) : (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="text-left p-4 font-semibold text-muted-foreground">Name</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground hidden sm:table-cell">Category</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground hidden md:table-cell">Price</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground hidden lg:table-cell">Status</th>
                        <th className="text-right p-4 font-semibold text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {dining.map(item => (
                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-4">
                            <p className="font-semibold text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground sm:hidden capitalize">{item.category} · ${item.price}</p>
                          </td>
                          <td className="p-4 hidden sm:table-cell capitalize text-muted-foreground">{item.category}</td>
                          <td className="p-4 hidden md:table-cell font-medium text-foreground">${item.price}</td>
                          <td className="p-4 hidden lg:table-cell">
                            <span className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${item.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                              {item.available ? "Available" : "Unavailable"}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => { setEditingDining(item); setDiningForm(item); }} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><Pencil size={15} /></button>
                              <button onClick={() => handleDeleteDining(item.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"><Trash2 size={15} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {dining.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                      <UtensilsCrossed size={40} className="mx-auto mb-3 opacity-30" />
                      <p>No menu items yet. Add your first item!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {activeTab === "settings" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-display font-bold text-foreground">Hotel Settings</h2>
                <p className="text-muted-foreground text-sm mt-1">Update your hotel information and social media links.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-display font-bold text-lg text-foreground mb-4 pb-2 border-b border-border">Social Media</h3>
                    <div className="space-y-4">
                      {[
                        { key: "facebookUrl", label: "Facebook URL", placeholder: "https://facebook.com/youhotel" },
                        { key: "twitterUrl", label: "Twitter / X URL", placeholder: "https://twitter.com/yourhotel" },
                        { key: "instagramUrl", label: "Instagram URL", placeholder: "https://instagram.com/yourhotel" },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="text-sm font-semibold text-foreground mb-1 block">{f.label}</label>
                          <input
                            type="url"
                            value={(settingsForm as any)[f.key]}
                            onChange={e => setSettingsForm(s => ({ ...s, [f.key]: e.target.value }))}
                            placeholder={f.placeholder}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-display font-bold text-lg text-foreground mb-4 pb-2 border-b border-border">Contact Information</h3>
                    <div className="space-y-4">
                      {[
                        { key: "hotelName", label: "Hotel Name", placeholder: "The Grand Hotel", type: "text" },
                        { key: "phone", label: "Phone Number", placeholder: "+1 (800) 123-4567", type: "tel" },
                        { key: "email", label: "Email Address", placeholder: "concierge@thegrand.com", type: "email" },
                        { key: "address", label: "Address", placeholder: "123 Luxury Avenue, Beverly Hills, CA 90210", type: "text" },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="text-sm font-semibold text-foreground mb-1 block">{f.label}</label>
                          <input
                            type={f.type}
                            value={(settingsForm as any)[f.key]}
                            onChange={e => setSettingsForm(s => ({ ...s, [f.key]: e.target.value }))}
                            placeholder={f.placeholder}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button type="submit" disabled={settingsSaving} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-base hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
                    {settingsSaving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : "Save Settings"}
                  </button>
                </form>

                <div className="bg-card border border-border rounded-xl p-6 h-fit">
                  <h3 className="font-display font-bold text-lg text-foreground mb-4">Preview</h3>
                  <p className="text-muted-foreground text-sm mb-4">This is how your contact info will appear in the footer:</p>
                  <div className="bg-foreground text-white rounded-xl p-6 space-y-3 text-sm">
                    <p className="font-display font-bold text-xl">{settingsForm.hotelName || "The Grand Hotel"}</p>
                    <p className="text-white/70">{settingsForm.address || "123 Luxury Avenue, Beverly Hills, CA 90210"}</p>
                    <p className="text-white/70">{settingsForm.phone || "+1 (800) 123-4567"}</p>
                    <p className="text-white/70">{settingsForm.email || "concierge@thegrand.com"}</p>
                    <div className="flex gap-3 pt-2">
                      {settingsForm.facebookUrl && <span className="px-2 py-1 bg-white/10 rounded text-xs">Facebook ✓</span>}
                      {settingsForm.twitterUrl && <span className="px-2 py-1 bg-white/10 rounded text-xs">Twitter ✓</span>}
                      {settingsForm.instagramUrl && <span className="px-2 py-1 bg-white/10 rounded text-xs">Instagram ✓</span>}
                      {!settingsForm.facebookUrl && !settingsForm.twitterUrl && !settingsForm.instagramUrl && (
                        <span className="text-white/40 text-xs">No social media links set</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {roomForm !== null && (
          <RoomForm
            room={editingRoom}
            onSave={handleSaveRoom}
            onCancel={() => { setRoomForm(null); setEditingRoom(null); }}
          />
        )}
        {diningForm !== null && (
          <DiningForm
            item={editingDining}
            onSave={handleSaveDining}
            onCancel={() => { setDiningForm(null); setEditingDining(null); }}
          />
        )}
        {managingImages !== null && (
          <ImageManager
            roomId={managingImages}
            onClose={() => { setManagingImages(null); refetchRooms(); }}
          />
        )}
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>
    </AppLayout>
  );
}
