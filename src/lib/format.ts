export const fmtMoney = (n: number) => "$" + n.toLocaleString("de-DE");
export const fmtXP = (n: number) => n.toLocaleString("de-DE");

export const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("de-DE", {
    timeZone: "UTC",
  });
};
