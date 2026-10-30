export default function Header() {
  return (
    <header
      className="mb-6 flex min-h-[300px] items-end justify-between
                 border-b border-border bg-cover bg-center
                 px-6 pb-4"
      style={{
        backgroundImage: "url('/public/topside_recon_banner.png')",
      }}
    ></header>
  );
}
