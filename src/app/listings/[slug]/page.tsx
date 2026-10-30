import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingView } from "@/components/listing-view";
import { getListing, listings } from "@/data/listings";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listings.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = getListing(slug);
  if (!listing) return {};

  return {
    title: { absolute: `${listing.text.th.title} — Enexa` },
    description: listing.text.th.summary,
    openGraph: {
      title: listing.text.th.title,
      description: listing.text.th.summary,
      images: [listing.photos[0].src],
    },
  };
}

export default async function ListingPage({ params }: Props) {
  const { slug } = await params;
  const listing = getListing(slug);
  if (!listing) notFound();
  return <ListingView listing={listing} />;
}
