// Kopfbereich der App mit Banner-Hintergrundbild. Rein darstellend, ohne Props.

export default function Header() {
  return (
    <header
      className="mb-6 flex min-h-75 items-end justify-between
                 border-b border-border bg-cover bg-center
                 px-6 pb-4"
      style={{
        backgroundImage: "url('/topside_recon_banner.png')",
      }}
    ></header>
  );
}
