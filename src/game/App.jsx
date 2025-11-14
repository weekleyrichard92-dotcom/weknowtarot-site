import { ImporterGame } from "./Importer";

export function GameApp() {
  return (
    <div className="space-y-8">
      <div className="border border-white/15 rounded-3xl bg-black/30 p-6 shadow-lg">
        <h1 className="text-2xl font-serif gold-text mb-3">Importer Lite</h1>
        <p className="text-white/70 text-sm max-w-3xl">
          Shuffle through our demo deck and lay cards on the table. Click <strong>Shuffle &amp; Deal</strong> to draw a spread, or explore every card in the grid below. This is the same lightweight importer you used on desktop—rebuilt for the browser so you can sample a deck from anywhere.
        </p>
      </div>

      <ImporterGame />
    </div>
  );
}
