
const words = ["Strategiya", "Marketing", "Brend", "Sotuv", "Moliya", "Soliq va eksport", "Mentorlik", "Amaliy keyslar"];

export default function Marquee() {
  const row = [...words, ...words];
  return (
    <section aria-label="Dastur yo‘nalishlari" className="relative overflow-hidden border-y border-line bg-white py-5">
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap hover:[animation-play-state:paused]">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-lg font-semibold text-navy-800/80 sm:text-xl">
            {w}
            <span className="h-2 w-2 rotate-45 bg-amber" />
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white" />
    </section>
  );
}
