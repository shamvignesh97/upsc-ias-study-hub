import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { battleCardDefs, getBattleCard } from "@/data/battle/cards";
import BattleCardView from "@/components/battle/BattleCardView";
import Disclaimer from "@/components/Disclaimer";

export function generateStaticParams() {
  return battleCardDefs.map((c) => ({ cardId: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cardId: string }>;
}): Promise<Metadata> {
  const { cardId } = await params;
  const card = getBattleCard(cardId);
  return {
    title: card ? `${card.title} · Battle card` : "Battle card",
    description: card?.rank.chanceLabel,
  };
}

export default async function BattleCardPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = await params;
  const card = getBattleCard(cardId);
  if (!card) notFound();
  return (
    <div className="space-y-6">
      <Link href="/battle" className="text-sm font-medium text-amber-800 underline">
        ← All battle cards
      </Link>
      <BattleCardView card={card} />
      <Disclaimer />
    </div>
  );
}
