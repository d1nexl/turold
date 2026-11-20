export const site = {
  name: "TUROLD",
  phone: "+420 519 000 140",
  phoneHref: "tel:+420519000140",
  email: "pobyt@turold-penzion.cz",
  street: "Svatokopecká 14",
  city: "692 01 Mikulov",
  region: "Jižní Morava",
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
};

export type RoomId = "ryzlink" | "veltlin" | "palava" | "muskat" | "frankovka" | "rulandske" | "vavrinec" | "sklep";

export type Room = {
  id: RoomId;
  name: string;
  size: number; // m²
  maxGuests: number;
  price: number; // Kč per night for the room, breakfast included
  images: string[];
};

export const rooms: Room[] = [
  { id: "ryzlink", name: "Ryzlink", size: 22, maxGuests: 2, price: 2600, images: ["/img/room-1.webp", "/img/bath-1.webp", "/img/room-detail.webp"] },
  { id: "veltlin", name: "Veltlín", size: 24, maxGuests: 2, price: 2800, images: ["/img/room-2.webp", "/img/room-light.webp", "/img/bath-2.webp"] },
  { id: "palava", name: "Pálava", size: 26, maxGuests: 2, price: 3100, images: ["/img/room-3.webp", "/img/mikulov-window.webp", "/img/bath-1.webp"] },
  { id: "muskat", name: "Muškát", size: 20, maxGuests: 2, price: 2400, images: ["/img/room-4.webp", "/img/room-detail.webp", "/img/bath-2.webp"] },
  { id: "frankovka", name: "Frankovka", size: 28, maxGuests: 3, price: 3300, images: ["/img/room-5.webp", "/img/room-light.webp", "/img/bath-1.webp"] },
  { id: "rulandske", name: "Rulandské", size: 30, maxGuests: 2, price: 3500, images: ["/img/room-6.webp", "/img/glass-view.webp", "/img/bath-2.webp"] },
  { id: "vavrinec", name: "Svatovavřinecké", size: 34, maxGuests: 4, price: 3900, images: ["/img/room-7.webp", "/img/room-detail.webp", "/img/bath-1.webp"] },
  { id: "sklep", name: "Apartmán Sklep", size: 46, maxGuests: 4, price: 4800, images: ["/img/room-8.webp", "/img/cellar-barrels.webp", "/img/bath-2.webp"] },
];

export const seasonImages = [
  "/img/vineyard-gold.webp",
  "/img/harvest.webp",
  "/img/tasting-vineyard.webp",
  "/img/vine-bare.webp",
] as const;
