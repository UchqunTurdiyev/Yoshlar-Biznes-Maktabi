import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-navy-950 px-4 text-center text-white">
      <div>
        <p className="font-display text-7xl font-bold text-amber">404</p>
        <h1 className="mt-4 font-display text-2xl font-semibold">Sahifa topilmadi</h1>
        <Link href="/" className="mt-8 inline-block rounded-2xl bg-amber px-6 py-3.5 font-extrabold text-navy-950">Bosh sahifa</Link>
      </div>
    </main>
  );
}
