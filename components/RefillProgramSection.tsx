import Link from "next/link";

export default function RefillProgramSection() {
  return (
    <section className="pt-16 md:pt-20 pb-10 md:pb-14">
      <div className="container-luxury">
        <div className="overflow-hidden border border-border bg-black lg:grid lg:grid-cols-[1fr_1.1fr]">
          <div className="relative min-h-[440px] lg:min-h-[520px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/bg-refill.png')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20 lg:bg-none" />
            <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-8 lg:hidden">
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/75">Sustainable Luxury</p>
              <h2 className="mt-3 font-serif text-4xl font-light italic text-white">The Refill Program</h2>
              <p className="mt-3 max-w-[560px] text-sm text-white/80 leading-relaxed">
                Refill your used HUME bottle for just ₹800 and continue your signature scent journey
                with a conscious, premium replenishment service.
              </p>
              <Link
                href="/refill-subscription"
                className="mt-5 inline-flex h-11 items-center justify-center border border-white bg-white px-6 text-[11px] uppercase tracking-[0.24em] text-black transition-colors hover:bg-white/90"
              >
                Explore Refill Program
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex lg:flex-col lg:justify-center lg:px-10 xl:px-14">
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/65">Sustainable Luxury</p>
            <h2 className="mt-3 font-serif text-5xl font-light italic text-white">The Refill Program</h2>
            <p className="mt-4 max-w-[560px] text-base text-white/80 leading-relaxed">
              Refill your used HUME bottle for just ₹800 and continue your signature scent journey
              with a conscious, premium replenishment service.
            </p>
            <Link
              href="/refill-subscription"
              className="mt-7 inline-flex h-11 w-fit items-center justify-center border border-white bg-white px-6 text-[11px] uppercase tracking-[0.24em] text-black transition-colors hover:bg-white/90"
            >
              Explore Refill Program
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
