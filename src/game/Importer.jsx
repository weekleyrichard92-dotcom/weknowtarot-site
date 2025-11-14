import { useEffect, useMemo, useState } from "react";

const DEFAULT_SPREADS = [
  { key: "single", label: "Single Draw", size: 1, positions: ["Focus"] },
  { key: "triple", label: "Three Card", size: 3, positions: ["Left", "Center", "Right"] },
  { key: "line", label: "Five in Line", size: 5, positions: ["1", "2", "3", "4", "5"] },
];
function shuffle(source) {
  const arr = [...source];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function useDeck() {
  const [cards, setCards] = useState([]);
  const [spreadKey, setSpreadKey] = useState(DEFAULT_SPREADS[0].key);
  const [drawn, setDrawn] = useState([]);

  useEffect(() => {
    fetch("/game/cards.json")
      .then(res => res.json())
      .then(data => setCards(data ?? []))
      .catch(() => setCards([]));
  }, []);

  useEffect(() => {
    setDrawn([]);
  }, [spreadKey]);

  const spread = useMemo(() => DEFAULT_SPREADS.find(s => s.key === spreadKey) ?? DEFAULT_SPREADS[0], [spreadKey]);

  return {
    cards,
    spread,
    spreadKey,
    setSpreadKey,
    drawn,
    setDrawn,
  };
}

export function ImporterGame() {
  const { cards, spread, spreadKey, setSpreadKey, drawn, setDrawn } = useDeck();

  const handleDraw = () => {
    if (!cards.length) return;
    const pile = shuffle(cards).slice(0, spread.size);
    setDrawn(pile);
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap gap-4 items-end">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium">Spread</span>
          <select value={spreadKey} onChange={e => setSpreadKey(e.target.value)} className="border border-white/20 bg-black/40 px-3 py-2 rounded-xl">
            {DEFAULT_SPREADS.map(spread => (
              <option key={spread.key} value={spread.key}>{spread.label}</option>
            ))}
          </select>
        </label>
        <button
          className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={handleDraw}
          disabled={!cards.length}
        >
          Shuffle &amp; Deal
        </button>
        <button
          className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition"
          onClick={() => setDrawn([])}
          disabled={!drawn.length}
        >
          Clear Table
        </button>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {drawn.length ? (
          drawn.map((card, idx) => (
            <article key={card.id} className="border border-white/15 rounded-2xl overflow-hidden bg-black/40 shadow">
              <img src={card.image} alt={card.name} className="w-full h-48 object-cover" />
              <div className="p-3">
                <p className="font-semibold text-sm text-white/90">{card.name}</p>
                <p className="text-xs text-white/50 mt-1">Position: {spread.positions[idx] ?? `Card ${idx + 1}`}</p>
              </div>
            </article>
          ))
        ) : (
          <div className="sm:col-span-3 text-sm text-white/60 border border-dashed border-white/20 rounded-2xl p-8">
            {cards.length
              ? <>Click <strong>Shuffle &amp; Deal</strong> to lay your first spread.</>
              : <>Loading deck assets…</>
            }
          </div>
        )}
      </section>

      <section className="border border-white/15 rounded-2xl bg-black/40 p-5 space-y-4">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-serif gold-text">Entire Deck</h2>
          <span className="text-xs text-white/50">{cards.length} cards</span>
        </header>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 max-h-[420px] overflow-auto pr-1">
          {cards.map(card => (
            <figure key={card.id} className="border border-white/10 rounded-xl overflow-hidden bg-black/30">
              <img src={card.image} alt={card.name} className="w-full h-28 object-cover" />
              <figcaption className="text-[11px] text-white/60 px-2 py-1 text-center">{card.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
