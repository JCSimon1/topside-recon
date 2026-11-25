// Kopfbereich der App mit Banner-Hintergrundbild. Rein darstellend, ohne Props.

export default function Header() {
  return (
    <header
      className="rounded-xl mb-6 flex min-h-25 items-end justify-between
                 border-b border-border bg-cover bg-center
                 px-6 pb-4"
      style={{
        backgroundImage:
          "url('/images/misc/monthly_trophy_background_orig.webp')",
      }}
    ></header>
  )
}
