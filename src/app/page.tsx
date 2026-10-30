import type { Metadata } from "next";
import { ListingIndex } from "@/components/listing-index";
import { ListingView } from "@/components/listing-view";
import { listings } from "@/data/listings";

export const metadata: Metadata =
  listings.length === 1
    ? {
        title: { absolute: `${listings[0].text.th.title} — Enexa` },
        description: listings[0].text.th.summary,
        openGraph: {
          title: listings[0].text.th.title,
          description: listings[0].text.th.summary,
          images: [listings[0].photos[0].src],
        },
      }
    : {
        title: "ประกาศ",
        description: "ที่ดินที่ Enexa รับมาขายเอง",
      };

export default function Home() {
  if (listings.length === 1) {
    return <ListingView listing={listings[0]} />;
  }
  return <ListingIndex listings={listings} />;
}
