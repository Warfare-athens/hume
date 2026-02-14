import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PerfumeCard from "@/components/PerfumeCard";
import { getAllProducts } from "@/lib/db/products";
import { celebrityFavorites } from "@/lib/celebrity-favorites";
import type { PerfumeData } from "@/data/perfumes";

export const dynamic = "force-dynamic";

function toSlug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function sortCelebrities(selected?: string) {
  if (!selected) return celebrityFavorites;
  return [...celebrityFavorites].sort((a, b) => {
    if (a.label === selected) return -1;
    if (b.label === selected) return 1;
    return a.label.localeCompare(b.label);
  });
}

export default async function CelebritiesFavoritesPage({
  searchParams,
}: {
  searchParams: Promise<{ celebrity?: string }>;
}) {
  const { celebrity } = await searchParams;
  const allPerfumes = await getAllProducts();
  const perfumeMap = new Map(allPerfumes.map((p) => [p.id, p]));
  const orderedCelebrities = sortCelebrities(celebrity);

  return (
    <main className="bg-background min-h-screen">
      <Header />

      <section className="pt-28 pb-20 md:pt-36 md:pb-24">
        <div className="container-luxury">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-caption text-muted-foreground mb-4">Curated Picks</p>
            <h1 className="text-headline mb-4">
              Celebrities&apos; <span className="italic">Favorite Perfumes</span>
            </h1>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Explore signature-inspired fragrances linked to SRK, Virat Kohli,
              Taylor Swift, David Beckham, and Johnny Depp.
            </p>
          </div>

          <div className="space-y-16">
            {orderedCelebrities.map((person) => {
              const favorites = person.perfumeIds
                .map((id) => perfumeMap.get(id))
                .filter(Boolean) as PerfumeData[];
              const celebImage = favorites[0]?.woreByImageUrl || person.image;

              return (
                <section key={person.label} id={toSlug(person.label)} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={celebImage}
                      alt={person.label}
                      className="w-16 h-16 rounded-md object-cover border border-border"
                    />
                    <div>
                      <h2 className="font-serif text-2xl md:text-3xl font-light">
                        {person.label}
                      </h2>
                      <p className="text-muted-foreground">{person.description}</p>
                    </div>
                  </div>

                  {favorites.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                      {favorites.map((perfume, index) => (
                        <PerfumeCard
                          key={perfume.id}
                          id={perfume.id}
                          name={perfume.name}
                          inspiration={perfume.inspiration}
                          category={perfume.category}
                          image={perfume.images[0]}
                          price={perfume.price}
                          index={index}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No favorites mapped yet for this celebrity.
                    </p>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
