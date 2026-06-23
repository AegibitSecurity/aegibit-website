import Image from "next/image";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { ArrowUpRight } from "lucide-react";

/**
 * WebsiteGallery, a premium screenshot gallery of websites AEGIBIT has
 * designed and built across industries.
 *
 * Honesty note: these are real sites we built. OJAS Fitness is a live
 * client on its own domain; the others are showcase builds. The section
 * frames them as "websites we have built" (true for all) and does not
 * claim each is a paying client.
 */

interface Site {
  name: string;
  category: string;
  url: string;
  img: string;
  live?: boolean;
}

const SITES: Site[] = [
  { name: "Kris Cross Gym", category: "Fitness studio", url: "https://kris-cross-gym.vercel.app/", img: "/work/kris-cross-gym.jpg" },
  { name: "AURELIA", category: "Fine dining", url: "https://aurelia-ebon.vercel.app/", img: "/work/aurelia-ebon.jpg" },
  { name: "Vyom Estates", category: "Luxury real estate", url: "https://vyom-estates.vercel.app/", img: "/work/vyom-estates.jpg" },
  { name: "OJAS Fitness O.9", category: "Fitness studio", url: "https://ojasfitness09.com/", img: "/work/ojas-fitness.jpg", live: true },
  { name: "Burimar Abha Boutique", category: "Boutique and fashion", url: "https://burimar-abha-boutique.vercel.app/", img: "/work/burimar-abha-boutique.jpg" },
];

export function WebsiteGallery() {
  return (
    <section className="px-6 lg:px-12 py-20 md:py-24 border-t" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#000" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[11px] uppercase font-medium mb-4" style={{ color: "#F97316", letterSpacing: "0.2em" }}>
            Design range
          </p>
          <h2 className="font-light mb-4" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#fff" }}>
            Websites we have built
          </h2>
          <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "#A1A1AA" }}>
            A selection of sites we have designed and shipped, across fitness, hospitality, real estate, and retail. Tap any one to open it live.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SITES.map((s) => (
            <TrackedLink
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              ctaId={`gallery_${s.name.toLowerCase().replace(/\W+/g, "_")}`}
              ctaLabel={s.name}
              ctaSection="website_gallery"
              className="group block rounded-2xl overflow-hidden transition-transform duration-300 hover:-translate-y-1"
              style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#0D0D0D" }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={s.img}
                  alt={`${s.name} website designed and built by AEGIBIT`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 45%, transparent 70%)" }} />
                {s.live && (
                  <span
                    className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold"
                    style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", color: "#10B981", letterSpacing: "0.1em" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#10B981" }} />
                    Live client
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase font-bold mb-1" style={{ color: "#F97316", letterSpacing: "0.14em" }}>
                      {s.category}
                    </p>
                    <h3 className="font-medium leading-tight" style={{ fontSize: "1.15rem", color: "#fff" }}>
                      {s.name}
                    </h3>
                  </div>
                  <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#fff" }}>
                    View <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            </TrackedLink>
          ))}
        </div>
      </div>
    </section>
  );
}
