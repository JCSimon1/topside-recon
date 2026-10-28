import { useEffect, useState } from "react";
import { useSaveLootAmount } from "../api/queries";
import type { LootItem } from "../api/types";
import { fmtMoney } from "../lib/format";

interface LootRowProps {
  item: LootItem;
}

export default function LootRow({ item }: LootRowProps) {
  const [draft, setDraft] = useState<number | null>(null);
  const amount = draft ?? item.amount;
  const { mutate } = useSaveLootAmount();

  useEffect(() => {
    if (draft === null) return;

    const timer = setTimeout(() => {
      mutate(
        { key: item.key, amount: draft },
        // Entwurf nur verwerfen, wenn inzwischen nicht weitergetippt wurde
        { onSuccess: () => setDraft((d) => (d === draft ? null : d)) },
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [draft, item.key, mutate]);

  return (
    <tr className="border-b border-border-soft font-mono last:border-b-0">
      <td className="px-2.5 py-2.5 font-sans">{item.name}</td>
      <td className="px-2.5 py-2.5 text-right text-positive">
        {fmtMoney(item.price)}
      </td>
      <td className="px-2.5 py-2.5 text-right">
        <input
          type="number"
          min={0}
          step={1}
          value={amount}
          onChange={(e) => setDraft(Math.max(0, Number(e.target.value) || 0))}
          className="w-[90px] rounded-sm border border-border bg-panel-alt px-2 py-1.5 text-right text-[13.5px] outline-none focus:border-accent-2"
        />
      </td>
      <td className="px-2.5 py-2.5 text-right text-positive">
        {fmtMoney(item.price * amount)}
      </td>
    </tr>
  );
}
