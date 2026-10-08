import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { buildMetadata, buildBreadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import {
  ShoppingBasket, MapPin, Clock, Languages, Repeat, Camera, Banknote,
  Store, ClipboardList, Boxes, Users, Bike, Wallet, Smartphone, Monitor,
  MailCheck, ArrowRight, LogIn, Download, MessageSquare,
} from "lucide-react";

/**
 * /products/gokart, the public GoKarT product page.
 *
 * GoKarT is AEGIBIT's quick-commerce product, running on the Cortex
 * engine. Two audiences that must never be confused:
 *   - SHOPPERS order from neighbourhood stores in the GoKarT Android app
 *     (/download/gokart-android, see next.config.ts).
 *   - MERCHANTS run their store in the same GoKarT app plus the web
 *     console at gokart.aegibit.com. Store onboarding is invitation-only:
 *     there is no public sign-up, so the merchant CTA is "sign in" for
 *     invited stores and "talk to us" for everyone else.
 *
 * Honesty bar: every capability below is shipped in the Cortex repo
 * (server-computed ETAs on real road routes and rider location, Bengali
 * and English, cash on delivery, reorder, snap-or-say lists; merchant
 * orders, stock, customers, chat, delivery, payments, invites). Online
 * payment is not claimed, cash on delivery is the live method. No
 * customer counts, no invented metrics, no client names.
 *
 * Brand: always "GoKarT", never the retired working name. Orange accent
 * matches the app's own theme primary.
 */

const PAGE_PATH = "/products/gokart";
const ANDROID_DOWNLOAD = "/download/gokart-android";
const MERCHANT_LOGIN_URL = "https://gokart.aegibit.com/login";
const TALK_TO_US = "mailto:contact@aegibit.com?subject=GoKarT for my store";

const ACCENT = "#F58220"; // GoKarT orange, the app's theme primary
const MERCHANT_ACCENT = "#10B981"; // a separate colour so the store half never reads as the shopper half

export const metadata: Metadata = buildMetadata({
  title: "GoKarT - Quick commerce from your neighbourhood stores",
  description:
    "GoKarT delivers groceries and daily needs fast from the stores in your own neighbourhood, with honest arrival times and an app in Bengali and English. Store owners run orders, stock, customers, delivery and payments from the GoKarT app and web console. Powered by AEGIBIT.",
  path: PAGE_PATH,
  keywords: [
    "GoKarT",
    "GoKarT app",
    "quick commerce",
    "grocery delivery app",
    "local grocery delivery",
    "neighbourhood store delivery",
    "kirana delivery app",
    "fast delivery app India",
    "Bengali grocery app",
    "online store for kirana shops",
    "quick commerce software for stores",
    "AEGIBIT",
  ],
});

// Shopper half. Each tile maps to a shipped consumer-app capability.
const SHOPPER_FEATURES = [
  {
    icon: MapPin,
    title: "Stores you already know",
    body: "GoKarT shows you the shops near your home, not a far-off warehouse. Order the groceries and daily needs you would have walked down the road for, and they come to your door.",
  },
  {
    icon: Clock,
    title: "Arrival times you can believe",
    body: "Your arrival time is worked out from the real road route, the store's packing time and where your rider is right now, and it updates as they move. If an order is running late, GoKarT tells you so.",
  },
  {
    icon: Languages,
    title: "In Bengali and English",
    body: "Use the whole app in Bengali or in English and switch whenever you like. Shopping should feel like talking to your local shopkeeper.",
  },
  {
    icon: Camera,
    title: "Say it or snap it",
    body: "Type your list, say it out loud, or take a photo of a handwritten list or a product. GoKarT finds the matching items in your store and puts them in your cart.",
  },
  {
    icon: Repeat,
    title: "Your regulars in one tap",
    body: "Buy again what you order every week, repeat a whole past order, or set up a regular order so the milk and bread simply arrive.",
  },
  {
    icon: Banknote,
    title: "Pay at your door",
    body: "Pay cash when your order arrives. Track it from the store to your door, and see every past order and bill in your account.",
  },
] as const;

// Merchant half. Each tile maps to a shipped GoKarT store-console screen.
const MERCHANT_FEATURES = [
  {
    icon: ClipboardList,
    title: "Orders",
    body: "New orders appear on your phone as they come in. Accept, pack and hand over in a few taps, and every order shows exactly where it is.",
  },
  {
    icon: Boxes,
    title: "Stock",
    body: "Keep prices and stock current from your phone or computer, so customers order from what is really on your shelf.",
  },
  {
    icon: Users,
    title: "Customers",
    body: "See who your regulars are and what they order, and chat with a customer about their order right inside GoKarT.",
  },
  {
    icon: Bike,
    title: "Delivery",
    body: "Hand orders to delivery and follow each one to the door, with the same honest arrival time your customer sees.",
  },
  {
    icon: Wallet,
    title: "Payments",
    body: "Every order's payment in one place, including cash collected at the door, so the day's takings add up at closing time.",
  },
  {
    icon: Store,
    title: "Your team, your access",
    body: "Add your staff with their own logins and only the access they need. Remove someone and they are signed out everywhere at once.",
  },
] as const;

const SHOPPER_FAQS = [
  {
    q: "What is GoKarT?",
    a: "GoKarT is a quick-commerce app that delivers groceries and daily needs from stores in your own neighbourhood. You order in the app, the store packs it, and it is delivered to your door with a live, honest arrival time.",
  },
  {
    q: "How do I get the GoKarT app?",
    a: "GoKarT is available for Android. Download it from www.aegibit.com/download/gokart-android, sign in with your phone number, and pick a store near you.",
  },
  {
    q: "Is GoKarT available in Bengali?",
    a: "Yes. The whole GoKarT app works in Bengali and in English, and you can switch between them at any time.",
  },
  {
    q: "How do I pay for a GoKarT order?",
    a: "Pay cash when your order arrives at your door. Every order and bill is saved in your account.",
  },
] as const;

const MERCHANT_FAQS = [
  {
    q: "How does my store join GoKarT?",
    a: "Store onboarding is by invitation. Talk to us at contact@aegibit.com, we set up your store, and you receive an email invitation. Accept it, set your password, and you are signed in to your store in the GoKarT app and on the web.",
  },
  {
    q: "Do I need a computer to run my store on GoKarT?",
    a: "No. You can run everything from the GoKarT Android app. The web console at gokart.aegibit.com is there when a bigger screen helps.",
  },
  {
    q: "Is the store app separate from the shopping app?",
    a: "It is the same GoKarT app. When you sign in with your store invitation, the app opens your store. Shoppers who download GoKarT see only the shopping side.",
  },
] as const;

const FAQS = [...SHOPPER_FAQS, ...MERCHANT_FAQS];

function productJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}${PAGE_PATH}#app`,
    name: "GoKarT",
    applicationCategory: "ShoppingApplication",
    applicationSubCategory: "Quick commerce, Grocery delivery",
    operatingSystem: "Android, Web",
    url: `${SITE_URL}${PAGE_PATH}`,
    downloadUrl: `${SITE_URL}${ANDROID_DOWNLOAD}`,
    inLanguage: ["bn", "en"],
    description:
      "GoKarT is a quick-commerce app by AEGIBIT that delivers groceries and daily needs from neighbourhood stores, with arrival times computed from real road routes and live rider location, in Bengali and English. Store owners run orders, stock, customers, delivery and payments from the same GoKarT app and the web console at gokart.aegibit.com.",
    author: { "@id": `${SITE_URL}/#org` },
    brand: { "@id": `${SITE_URL}/#org` },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      description: "The GoKarT shopping app is free to download.",
    },
    featureList: [
      "Order from stores in your neighbourhood",
      "Arrival times from real road routes, store packing time and live rider location",
      "Full app in Bengali and English",
      "Type, say or photograph your shopping list",
      "Buy again, repeat a past order, or set a regular order",
      "Cash on delivery with live order tracking",
      "Store console: orders, stock, customers, delivery and payments",
      "Store team access with per-person logins",
      "Invitation-only store onboarding",
    ],
  };
}

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}${PAGE_PATH}#faq`,
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function FaqList({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className="space-y-4">
      {items.map((f) => (
        <div key={f.q} className="rounded-2xl p-6" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h3 className="font-medium mb-2" style={{ fontSize: "1.02rem", color: "#fff" }}>{f.q}</h3>
          <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>{f.a}</p>
        </div>
      ))}
    </div>
  );
}

export default function GoKarTPage() {
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "GoKarT", href: PAGE_PATH },
  ]);

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <main id="main-content" style={{ background: "#000" }}>
        {/* Hero: one line on what GoKarT is, then two clearly separate doors */}
        <section className="relative px-6 lg:px-12 pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(245,130,32,0.14) 0%, transparent 70%)" }} />
          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.35)" }}>
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#10B981" }} />
                <span className="text-[11px] uppercase font-medium" style={{ color: "#10B981", letterSpacing: "0.2em" }}>
                  Live · Android and web
                </span>
              </div>
              <h1 className="font-light leading-tight mb-6" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", color: "#fff" }}>
                GoKarT.{" "}
                <span style={{ background: `linear-gradient(135deg, #fff 0%, ${ACCENT} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Your neighbourhood stores, delivered fast.
                </span>
              </h1>
              <p className="text-base md:text-lg leading-relaxed mb-12" style={{ color: "#A1A1AA" }}>
                GoKarT is quick commerce built around the shops down your road. Shoppers get groceries and daily needs at
                the door with an arrival time they can trust. Store owners get one app to run orders, stock and delivery.
                Powered by AEGIBIT.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <a
                href="#shop"
                className="group rounded-2xl p-7 block transition-transform hover:-translate-y-0.5"
                style={{ background: "linear-gradient(180deg, #1a0f05 0%, #0a0a0a 100%)", border: "1px solid rgba(245,130,32,0.35)" }}
              >
                <ShoppingBasket size={22} style={{ color: ACCENT }} className="mb-4" />
                <p className="text-[11px] uppercase font-bold mb-2" style={{ color: ACCENT, letterSpacing: "0.16em" }}>I want to shop</p>
                <h2 className="font-medium mb-2" style={{ fontSize: "1.3rem", color: "#fff" }}>Shop GoKarT</h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#A1A1AA" }}>
                  Order from stores near you, in Bengali or English, and pay at your door.
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: ACCENT }}>
                  For shoppers <ArrowRight size={15} />
                </span>
              </a>
              <a
                href="#merchants"
                className="group rounded-2xl p-7 block transition-transform hover:-translate-y-0.5"
                style={{ background: "linear-gradient(180deg, #04140f 0%, #0a0a0a 100%)", border: "1px solid rgba(16,185,129,0.35)" }}
              >
                <Store size={22} style={{ color: MERCHANT_ACCENT }} className="mb-4" />
                <p className="text-[11px] uppercase font-bold mb-2" style={{ color: MERCHANT_ACCENT, letterSpacing: "0.16em" }}>I own a store</p>
                <h2 className="font-medium mb-2" style={{ fontSize: "1.3rem", color: "#fff" }}>Run your store</h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#A1A1AA" }}>
                  Orders, stock, customers, delivery and payments, on your phone and on the web.
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: MERCHANT_ACCENT }}>
                  For store owners <ArrowRight size={15} />
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* ───────────── SHOPPERS ───────────── */}
        <section id="shop" className="px-6 lg:px-12 py-20 md:py-24 border-t scroll-mt-24" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[11px] uppercase font-medium mb-4" style={{ color: ACCENT, letterSpacing: "0.2em" }}>
                Shop GoKarT · For shoppers
              </p>
              <h2 className="font-light mb-5" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#fff" }}>
                Fast local delivery, without the guesswork
              </h2>
              <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "#A1A1AA" }}>
                Open GoKarT, pick a store near you, and fill your cart the way you like. Your order is packed by a shop in
                your own area and delivered to your door, and you always know when it will arrive.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              {SHOPPER_FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="rounded-2xl p-7" style={{ background: "#0D0D0D", border: "1px solid rgba(245,130,32,0.18)" }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(245,130,32,0.12)", border: "1px solid rgba(245,130,32,0.28)" }}>
                      <Icon size={20} style={{ color: ACCENT }} />
                    </div>
                    <h3 className="font-medium mb-2" style={{ fontSize: "1.1rem", color: "#fff" }}>{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>{f.body}</p>
                  </div>
                );
              })}
            </div>
            <div className="rounded-2xl p-8 text-center" style={{ background: "linear-gradient(180deg, #1a0f05 0%, #0a0a0a 100%)", border: "1px solid rgba(245,130,32,0.30)" }}>
              <h3 className="font-light mb-3" style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)", color: "#fff" }}>
                Get GoKarT on your phone
              </h3>
              <p className="text-sm leading-relaxed max-w-xl mx-auto mb-7" style={{ color: "#A1A1AA" }}>
                Free to download for Android. Sign in with your phone number and start shopping from the stores near you.
              </p>
              <a
                href={ANDROID_DOWNLOAD}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5"
                style={{ background: ACCENT, color: "#000" }}
              >
                <Download size={16} /> Download GoKarT for Android
              </a>
            </div>
          </div>
        </section>

        {/* ───────────── MERCHANTS ───────────── */}
        <section id="merchants" className="px-6 lg:px-12 py-20 md:py-24 border-t scroll-mt-24" style={{ borderColor: "rgba(16,185,129,0.20)", background: "linear-gradient(180deg, #020a07 0%, #000 40%)" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[11px] uppercase font-medium mb-4" style={{ color: MERCHANT_ACCENT, letterSpacing: "0.2em" }}>
                Run your store · For store owners
              </p>
              <h2 className="font-light mb-5" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#fff" }}>
                Your shop, online, without the extra work
              </h2>
              <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "#A1A1AA" }}>
                GoKarT gives a neighbourhood store everything it needs to take orders online and deliver them: one place
                for orders, stock, customers, delivery and payments. Run it from your phone at the counter, or from the
                web console when you want a bigger screen.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              {MERCHANT_FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="rounded-2xl p-7" style={{ background: "#0D0D0D", border: "1px solid rgba(16,185,129,0.18)" }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.28)" }}>
                      <Icon size={20} style={{ color: MERCHANT_ACCENT }} />
                    </div>
                    <h3 className="font-medium mb-2" style={{ fontSize: "1.1rem", color: "#fff" }}>{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>{f.body}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid md:grid-cols-3 gap-5 mb-12">
              <div className="rounded-2xl p-6" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.07)" }}>
                <Smartphone size={18} style={{ color: MERCHANT_ACCENT }} className="mb-3" />
                <h3 className="font-medium mb-2" style={{ fontSize: "1rem", color: "#fff" }}>The GoKarT app</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>
                  The same GoKarT app shoppers use. Sign in with your store invitation and it opens your store instead.
                </p>
              </div>
              <div className="rounded-2xl p-6" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.07)" }}>
                <Monitor size={18} style={{ color: MERCHANT_ACCENT }} className="mb-3" />
                <h3 className="font-medium mb-2" style={{ fontSize: "1rem", color: "#fff" }}>The web console</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>
                  gokart.aegibit.com, the same store on a computer, with a full view of the day&apos;s orders, stock and payments.
                </p>
              </div>
              <div className="rounded-2xl p-6" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.07)" }}>
                <MailCheck size={18} style={{ color: MERCHANT_ACCENT }} className="mb-3" />
                <h3 className="font-medium mb-2" style={{ fontSize: "1rem", color: "#fff" }}>Invitation only</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>
                  Stores join by invitation. We set up your store with you, then send an email invite to accept and sign in.
                </p>
              </div>
            </div>

            <div className="rounded-2xl p-8 text-center" style={{ background: "linear-gradient(180deg, #04140f 0%, #0a0a0a 100%)", border: "1px solid rgba(16,185,129,0.30)" }}>
              <h3 className="font-light mb-3" style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)", color: "#fff" }}>
                Bring your store to GoKarT
              </h3>
              <p className="text-sm leading-relaxed max-w-xl mx-auto mb-7" style={{ color: "#A1A1AA" }}>
                Already invited? Sign in to your store. Want your shop on GoKarT? Talk to us and we will set it up with you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <a
                  href={MERCHANT_LOGIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5"
                  style={{ background: MERCHANT_ACCENT, color: "#000" }}
                >
                  <LogIn size={16} /> Sign in to your store
                </a>
                <a
                  href={TALK_TO_US}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm"
                  style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
                >
                  <MessageSquare size={15} /> Talk to us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ, split by audience (also emitted as FAQPage schema) */}
        <section className="px-6 lg:px-12 py-20 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[11px] uppercase font-medium mb-4" style={{ color: ACCENT, letterSpacing: "0.2em" }}>
                Questions
              </p>
              <h2 className="font-light" style={{ fontSize: "clamp(1.7rem, 3vw, 2.3rem)", color: "#fff" }}>
                GoKarT, answered
              </h2>
            </div>
            <h3 className="text-[11px] uppercase font-bold mb-4" style={{ color: ACCENT, letterSpacing: "0.16em" }}>For shoppers</h3>
            <div className="mb-10"><FaqList items={SHOPPER_FAQS} /></div>
            <h3 className="text-[11px] uppercase font-bold mb-4" style={{ color: MERCHANT_ACCENT, letterSpacing: "0.16em" }}>For store owners</h3>
            <FaqList items={MERCHANT_FAQS} />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
