import type { Lang } from "@/i18n";

export type Localized = {
  title: string;
  titleLines: string[];
  kicker: string;
  location: string;
  place: string;
  deed: string;
  sale: string;
  role: string;
  summary: string;
  body: string[];
  notes: { label: string; value: string }[];
};

export type Listing = {
  slug: string;
  rai: number;
  ngan: number;
  sqWa: number;
  pricePerRai: number;
  lat: number;
  lng: number;
  text: Record<Lang, Localized>;
  photos: {
    src: string;
    alt: Record<Lang, string>;
    caption: Record<Lang, string>;
    fit?: "contain";
  }[];
};

export const listings: Listing[] = [
  {
    slug: "tha-tan",
    rai: 18,
    ngan: 0,
    sqWa: 55,
    pricePerRai: 120_000,
    lat: 16.696067,
    lng: 100.332314,
    text: {
      th: {
        title: "ที่นาท่าตาล",
        titleLines: ["ที่นา", "ท่าตาล"],
        kicker: "พิษณุโลก",
        location: "ตำบลท่าตาล อำเภอบางกระทุ่ม จังหวัดพิษณุโลก",
        place: "ตำบลท่าตาล อำเภอบางกระทุ่ม",
        deed: "โฉนดที่ดิน",
        sale: "ขายทั้งผืน",
        role: "เจ้าของขายเอง",
        summary:
          "ที่นาโฉนด ตำบลท่าตาล อำเภอบางกระทุ่ม จังหวัดพิษณุโลก ขายทั้งผืน ไร่ละ 120,000 บาท",
        body: [
          "ที่นาโฉนดติดถนนด้านหนองชะเลียง หนองอยู่ฝั่งตรงข้ามถนน ไม่ได้อยู่ในโฉนด ห่างบ้านทำดินแดงประมาณ 1 กิโลเมตร และห่างวัดปากคลองประมาณ 2 กิโลเมตร",
          "แปลงโล่ง แบ่งคันนา ไถเตรียมทำนาแล้ว ดินอุ้มน้ำในร่อง ขายทั้งผืนในราคาไร่ละ 120,000 บาท เจ้าของอยู่กรุงเทพและตอบเอง มีคนในพื้นที่พาเดินแปลงได้เมื่อนัดดูที่",
        ],
        notes: [
          { label: "หนองชะเลียง", value: "ฝั่งตรงข้ามถนน" },
          { label: "บ้านทำดินแดง", value: "ประมาณ 1 กิโลเมตร" },
          { label: "วัดปากคลอง", value: "ประมาณ 2 กิโลเมตร" },
        ],
      },
      en: {
        title: "Tha Tan rice field",
        titleLines: ["Rice field", "Tha Tan"],
        kicker: "Phitsanulok",
        location: "Tha Tan, Bang Krathum, Phitsanulok",
        place: "Tha Tan, Bang Krathum",
        deed: "Chanote title deed",
        sale: "Whole plot",
        role: "Sold by the owner",
        summary:
          "Chanote rice field in Tha Tan, Bang Krathum, Phitsanulok. Whole plot, 120,000 baht per rai.",
        body: [
          "A chanote rice field beside the road along Nong Chaliang. The pond is across the road and is not part of the deed. About 1 km from Ban Tham Din Daeng and about 2 km from Wat Pak Khlong.",
          "The plot is open, divided into paddies, and already plowed. The soil holds water in the furrows. The whole plot is 120,000 baht per rai. The owner lives in Bangkok and replies personally. Someone local can walk the field when a visit is arranged.",
        ],
        notes: [
          { label: "Nong Chaliang", value: "Across the road" },
          { label: "Ban Tham Din Daeng", value: "About 1 km" },
          { label: "Wat Pak Khlong", value: "About 2 km" },
        ],
      },
    },
    photos: [
      {
        src: "/photos/aerial.jpg",
        alt: {
          th: "มุมสูงของที่นา ติดถนนด้านหนองชะเลียง",
          en: "Aerial view of the rice field beside the road along Nong Chaliang",
        },
        caption: {
          th: "มุมสูง ติดถนนด้านหนอง",
          en: "Aerial view, beside the pond road",
        },
        fit: "contain",
      },
      {
        src: "/photos/furrow.jpg",
        alt: {
          th: "ที่นาไถแล้ว มีร่องน้ำกลางแปลง และท้องฟ้าเปิด",
          en: "Plowed rice field with a water furrow down the middle and an open sky",
        },
        caption: {
          th: "ร่องกลางแปลง",
          en: "Center furrow",
        },
      },
      {
        src: "/photos/horizon.jpg",
        alt: {
          th: "ที่นาโล่งมองไปถึงแนวต้นไม้ปลายแปลง",
          en: "Open rice field looking toward the tree line",
        },
        caption: {
          th: "แปลงโล่งถึงแนวต้นไม้",
          en: "Open field to the trees",
        },
      },
      {
        src: "/photos/edge.jpg",
        alt: {
          th: "ริมแปลงที่มีแนวกล้วยและต้นไม้",
          en: "Field edge with bananas and trees",
        },
        caption: {
          th: "แนวต้นไม้ริมแปลง",
          en: "Trees along the edge",
        },
      },
    ],
  },
];

export function getListing(slug: string) {
  return listings.find((listing) => listing.slug === slug);
}

export function areaRai(listing: Listing) {
  return listing.rai + listing.ngan / 4 + listing.sqWa / 400;
}

export function totalBaht(listing: Listing) {
  return Math.round(areaRai(listing) * listing.pricePerRai);
}

export function formatBaht(amount: number) {
  return new Intl.NumberFormat("th-TH").format(amount);
}

export function formatArea(listing: Listing, lang: Lang) {
  if (lang === "en") {
    const parts = [`${listing.rai} rai`];
    if (listing.ngan) parts.push(`${listing.ngan} ngan`);
    if (listing.sqWa) parts.push(`${listing.sqWa} sq wa`);
    return parts.join(" ");
  }
  const parts = [`${listing.rai} ไร่`];
  if (listing.ngan) parts.push(`${listing.ngan} งาน`);
  if (listing.sqWa) parts.push(`${listing.sqWa} ตร.วา`);
  return parts.join(" ");
}

export function mapsUrl(listing: Listing) {
  return `https://www.google.com/maps?q=${listing.lat},${listing.lng}&t=k`;
}

export function mapsEmbed(listing: Listing) {
  return `https://maps.google.com/maps?q=${listing.lat},${listing.lng}&t=k&z=16&output=embed`;
}
