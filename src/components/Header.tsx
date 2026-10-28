export default function Header() {
  return (
    <header className="mb-6 flex items-end justify-between border-b border-border pb-4">
      <div className="flex items-baseline gap-3">
        <div className="font-display text-3xl font-bold">
          {" "}
          Arc Raiders <span className="text-accent">Salvage Log</span>
        </div>
        <div className="font-mono text-xs text-text-faint">
          {" "}
          Tracker Status{" "}
        </div>
      </div>
    </header>
  );
}
