"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Globe,
  GraduationCap,
  Headphones,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

// =====================================
// Brand + Config (edit these)
// =====================================
const BRAND = {
  name: "BlueBridge Global Prep",
  tagline: "Get the score. Get the offer. Go global.",
  cityLine: "Kenya-based • Online + In-person",
};

const CONTACT = {
  email: "hello@yourdomain.com",
  phoneDisplay: "+254 7XX XXX XXX",
  phoneTel: "+2547XXXXXXXX",
  whatsappDisplay: "+254 7XX XXX XXX",
  // Use international format without + for wa.me links
  whatsappWaMe: "2547XXXXXXXX",
};

// Calendly OR Google Appointment Schedule embed URL
const BOOKING_EMBED_URL = "https://calendly.com/your-handle/consultation";

// Prices (KES) — replace with your real pricing
const PRICES = {
  ieltsGroup8: 12000,
  ieltsOneOnOne: 4500,
  toeflBootcamp: 18000,
  pteIntensive: 20000,
  admissionsSupport: 45000,
  mockEvaluation: 3500,
  writingTemplates: 1200,
  vocabPack: 900,
  mockBundle: 2500,
};

// =====================================
// Helpers
// =====================================
const container = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, duration: 0.5, ease: "easeOut" },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function formatKES(value: number) {
  // Keep it simple and readable for Kenya pricing
  return `KES ${value.toLocaleString("en-KE")}`;
}

function classNames(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

// =====================================
// UI Pieces
// =====================================
function Glow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-44 -top-44 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(30,94,255,0.28),transparent_55%)] blur-3xl" />
      <div className="absolute -right-48 top-10 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_60%_40%,rgba(17,181,164,0.24),transparent_55%)] blur-3xl" />
      <div className="absolute bottom-[-240px] left-1/3 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,176,32,0.18),transparent_55%)] blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.9),transparent_55%)] opacity-35" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(11,27,58,0.06))]" />
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#E7ECFF] bg-white/70 px-3 py-1 text-sm shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  desc,
  right,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  right?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-10 flex items-end justify-between gap-4"
    >
      <div>
        <Badge className="rounded-full bg-[#0B1B3A] text-white hover:bg-[#0B1B3A]">
          {eyebrow}
        </Badge>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0A1020] md:text-4xl">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-[#0A1020]/70">{desc}</p>
      </div>
      {right ? <div className="hidden md:block">{right}</div> : null}
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#E7ECFF] bg-white/70 p-4 shadow-sm backdrop-blur">
      <div className="text-2xl font-semibold tracking-tight text-[#0A1020]">{value}</div>
      <div className="mt-1 text-sm text-[#0A1020]/70">{label}</div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <motion.div variants={item}>
      <Card className="group relative overflow-hidden rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md">
        <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
          <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(30,94,255,0.22),transparent_60%)] blur-2xl" />
        </div>
        <CardHeader className="space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E7ECFF] bg-white">
            {icon}
          </div>
          <CardTitle className="text-xl text-[#0A1020]">{title}</CardTitle>
          <CardDescription className="text-base text-[#0A1020]/70">
            {desc}
          </CardDescription>
        </CardHeader>
      </Card>
    </motion.div>
  );
}

function ServiceCard({
  title,
  desc,
  bullets,
  icon,
  cta,
  onClick,
}: {
  title: string;
  desc: string;
  bullets: string[];
  icon: React.ReactNode;
  cta: string;
  onClick: () => void;
}) {
  return (
    <motion.div variants={item}>
      <Card className="relative overflow-hidden rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md">
        <CardHeader className="space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E7ECFF] bg-white">
            {icon}
          </div>
          <CardTitle className="text-xl text-[#0A1020]">{title}</CardTitle>
          <CardDescription className="text-base text-[#0A1020]/70">
            {desc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-[#11B5A4]" />
                <span className="text-[#0A1020]/70">{b}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full rounded-2xl bg-[#1E5EFF] text-white hover:bg-[#1E5EFF]/90"
            onClick={onClick}
          >
            {cta} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function Toggle({
  left,
  right,
  value,
  onChange,
}: {
  left: string;
  right: string;
  value: "left" | "right";
  onChange: (v: "left" | "right") => void;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-2xl border border-[#E7ECFF] bg-white/70 p-2 shadow-sm backdrop-blur">
      <button
        className={classNames(
          "rounded-xl px-3 py-2 text-sm transition",
          value === "left" ? "bg-[#0B1B3A] text-white" : "text-[#0A1020]/70"
        )}
        onClick={() => onChange("left")}
      >
        {left}
      </button>
      <button
        className={classNames(
          "rounded-xl px-3 py-2 text-sm transition",
          value === "right" ? "bg-[#0B1B3A] text-white" : "text-[#0A1020]/70"
        )}
        onClick={() => onChange("right")}
      >
        {right}
      </button>
    </div>
  );
}

function PricingCard({
  name,
  price,
  blurb,
  features,
  highlight,
  cta,
  onClick,
}: {
  name: string;
  price: string;
  blurb: string;
  features: string[];
  highlight?: boolean;
  cta: string;
  onClick: () => void;
}) {
  return (
    <motion.div variants={item}>
      <Card
        className={classNames(
          "relative overflow-hidden rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md",
          highlight && "ring-1 ring-[#1E5EFF]/30"
        )}
      >
        {highlight && (
          <div className="absolute right-4 top-4">
            <Badge className="rounded-full bg-[#FFB020] text-[#0B1B3A] hover:bg-[#FFB020]">
              Most popular
            </Badge>
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-xl text-[#0A1020]">{name}</CardTitle>
          <CardDescription className="text-base text-[#0A1020]/70">
            {blurb}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2">
            <div className="text-4xl font-semibold tracking-tight text-[#0A1020]">
              {price}
            </div>
          </div>
          <ul className="mt-6 space-y-3 text-sm">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-[#11B5A4]" />
                <span className="text-[#0A1020]/70">{f}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            className={classNames(
              "w-full rounded-2xl",
              highlight
                ? "bg-[#1E5EFF] text-white hover:bg-[#1E5EFF]/90"
                : "border-[#E7ECFF] bg-white text-[#0A1020] hover:bg-white"
            )}
            variant={highlight ? "default" : "outline"}
            onClick={onClick}
          >
            {cta} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 text-[#FFB020]" />
      ))}
    </div>
  );
}

type ProductCategory =
  | "IELTS"
  | "TOEFL"
  | "PTE"
  | "Writing"
  | "Vocabulary"
  | "Bundles";

type Product = {
  id: string;
  title: string;
  desc: string;
  category: ProductCategory;
  format: "PDF" | "Print" | "PDF + Print";
  price: number;
  popular?: boolean;
};

function ProductCard({
  p,
  onAdd,
}: {
  p: Product;
  onAdd: (p: Product) => void;
}) {
  return (
    <Card className="group relative overflow-hidden rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md">
      {p.popular && (
        <div className="absolute right-4 top-4">
          <Badge className="rounded-full bg-[#0B1B3A] text-white hover:bg-[#0B1B3A]">
            Popular
          </Badge>
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg text-[#0A1020]">{p.title}</CardTitle>
            <CardDescription className="text-sm text-[#0A1020]/70">
              {p.category} • {p.format}
            </CardDescription>
          </div>
          <div className="rounded-2xl border border-[#E7ECFF] bg-white px-3 py-2 text-sm font-medium text-[#0A1020]">
            {formatKES(p.price)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-[#0A1020]/70">{p.desc}</p>
        <div className="flex items-center justify-between">
          <Stars />
          <span className="text-xs text-[#0A1020]/60">Instant access (PDF)</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          className="w-full rounded-2xl bg-[#1E5EFF] text-white hover:bg-[#1E5EFF]/90"
          onClick={() => onAdd(p)}
        >
          Add to cart
        </Button>
        <Button
          className="rounded-2xl border-[#E7ECFF] bg-white"
          variant="outline"
          onClick={() => scrollToId("book")}
        >
          Ask
        </Button>
      </CardFooter>
    </Card>
  );
}

function Carousel({
  items,
}: {
  items: { quote: string; name: string; meta: string }[];
}) {
  const [idx, setIdx] = useState(0);

  const next = () => setIdx((v) => (v + 1) % items.length);
  const prev = () => setIdx((v) => (v - 1 + items.length) % items.length);

  return (
    <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-4"
          >
            <p className="text-base leading-relaxed text-[#0A1020]/90">
              “{items[idx].quote}”
            </p>
            <div>
              <div className="font-medium text-[#0A1020]">{items[idx].name}</div>
              <div className="text-sm text-[#0A1020]/70">{items[idx].meta}</div>
            </div>
          </motion.div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className="rounded-2xl border-[#E7ECFF] bg-white"
              onClick={prev}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="rounded-2xl border-[#E7ECFF] bg-white"
              onClick={next}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MobileMenu({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: { id: string; label: string }[];
}) {
  return (
    <motion.div initial={false} animate={open ? "open" : "closed"} className="md:hidden">
      <motion.div
        variants={{
          open: { opacity: 1, pointerEvents: "auto" as const },
          closed: { opacity: 0, pointerEvents: "none" as const },
        }}
        className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        variants={{ open: { x: 0 }, closed: { x: "100%" } }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="fixed right-0 top-0 z-50 h-full w-[84%] max-w-sm border-l border-[#E7ECFF] bg-white/90 p-5 shadow-xl backdrop-blur"
      >
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-2xl border border-[#E7ECFF] bg-white">
              <Sparkles className="h-5 w-5 text-[#1E5EFF]" />
            </div>
            <div className="font-semibold tracking-tight text-[#0A1020]">
              {BRAND.name}
            </div>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-6 space-y-2">
          {links.map((l) => (
            <button
              key={l.id}
              className="flex w-full items-center justify-between rounded-2xl border border-[#E7ECFF] bg-white/70 px-4 py-3 text-left text-sm shadow-sm"
              onClick={() => {
                scrollToId(l.id);
                onClose();
              }}
            >
              <span className="text-[#0A1020]">{l.label}</span>
              <ArrowRight className="h-4 w-4 text-[#0A1020]/60" />
            </button>
          ))}
        </div>

        <div className="mt-6">
          <Button
            className="w-full rounded-2xl bg-[#1E5EFF] text-white hover:bg-[#1E5EFF]/90"
            onClick={() => {
              scrollToId("book");
              onClose();
            }}
          >
            Book a call
          </Button>
          <p className="mt-3 text-xs text-[#0A1020]/60">
            Fast booking • Clear pricing • Materials available
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// =====================================
// Main Page
// =====================================
export default function BlueBridgeWebsite() {
  const mounted = useIsMounted();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 26 });

  const [menuOpen, setMenuOpen] = useState(false);

  // Pricing toggle: Package vs Monthly (demo)
  const [pricingMode, setPricingMode] = useState<"left" | "right">("left");

  // Test Prep tabs (custom)
  const [exam, setExam] = useState<"IELTS" | "TOEFL" | "PTE">("IELTS");

  // Shop
  const [cat, setCat] = useState<ProductCategory | "All">("All");
  const [q, setQ] = useState("");
  const [cartCount, setCartCount] = useState(0);

  // Eligibility quiz
  const [quiz, setQuiz] = useState({
    goal: "", // "study" | "work" | "both"
    budget: "", // "low" | "mid" | "high"
    timeline: "", // "0-3" | "3-6" | "6+"
  });

  const links = useMemo(
    () => [
      { id: "home", label: "Home" },
      { id: "test", label: "Test Prep" },
      { id: "abroad", label: "Study Abroad" },
      { id: "pricing", label: "Pricing" },
      { id: "shop", label: "Shop" },
      { id: "mock", label: "Mock Eval" },
      { id: "stories", label: "Success" },
      { id: "book", label: "Book" },
      { id: "about", label: "About" },
      { id: "contact", label: "Contact" },
    ],
    []
  );

  const products: Product[] = useMemo(
    () => [
      {
        id: "p1",
        title: "IELTS Writing Templates Pack",
        desc: "Band-boosting structures for Task 1 & Task 2 with examples and checklists.",
        category: "Writing",
        format: "PDF",
        price: PRICES.writingTemplates,
        popular: true,
      },
      {
        id: "p2",
        title: "IELTS Vocabulary Builder",
        desc: "High-frequency collocations + topic lists (education, work, environment, tech).",
        category: "Vocabulary",
        format: "PDF",
        price: PRICES.vocabPack,
      },
      {
        id: "p3",
        title: "TOEFL Speaking Prompts + Rubrics",
        desc: "Practice sets with scoring rubrics and model answers.",
        category: "TOEFL",
        format: "PDF",
        price: 1500,
      },
      {
        id: "p4",
        title: "PTE Core Mock Pack",
        desc: "Timed practice sets aligned to PTE task types + answer strategy notes.",
        category: "PTE",
        format: "PDF",
        price: 1800,
        popular: true,
      },
      {
        id: "p5",
        title: "IELTS Full Mock Bundle",
        desc: "Reading + Listening + Writing mock set with marking guide.",
        category: "Bundles",
        format: "PDF",
        price: PRICES.mockBundle,
      },
      {
        id: "p6",
        title: "IELTS Print Practice Book",
        desc: "A physical practice workbook delivered locally (Nairobi & major towns).",
        category: "IELTS",
        format: "Print",
        price: 3000,
      },
    ],
    []
  );

  const filteredProducts = useMemo(() => {
    const query = q.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCat = cat === "All" ? true : p.category === cat;
      const matchesQ =
        query.length === 0
          ? true
          : `${p.title} ${p.desc} ${p.category} ${p.format}`
              .toLowerCase()
              .includes(query);
      return matchesCat && matchesQ;
    });
  }, [products, cat, q]);

  const pricing = useMemo(() => {
    // Demo: Monthly is 15% of package price, rounded
    const monthly = (v: number) => Math.max(1500, Math.round(v * 0.15 / 100) * 100);

    const isPackage = pricingMode === "left";

    return [
      {
        name: "IELTS Group Class",
        price: isPackage ? formatKES(PRICES.ieltsGroup8) : `${formatKES(monthly(PRICES.ieltsGroup8))} / month`,
        blurb: "Structured lessons + practice + feedback. Best for steady improvement.",
        features: [
          "8 guided sessions",
          "Weekly homework + marking",
          "Speaking drills + band strategies",
          "Class notes + progress tracking",
        ],
        cta: "Book placement test",
      },
      {
        name: "IELTS 1:1 Coaching",
        price: isPackage
          ? `${formatKES(PRICES.ieltsOneOnOne)} / session`
          : `${formatKES(Math.round(PRICES.ieltsOneOnOne * 0.9))} / session`,
        blurb: "Personalized plan with deep feedback and score-focused coaching.",
        features: [
          "Custom band-gap analysis",
          "Writing correction & rewrite plan",
          "Speaking simulation",
          "Flexible schedule (online/in-person)",
        ],
        highlight: true,
        cta: "Book a consultation",
      },
      {
        name: "Study Abroad Support",
        price: isPackage ? formatKES(PRICES.admissionsSupport) : `${formatKES(monthly(PRICES.admissionsSupport))} / month`,
        blurb: "From school selection to SOP review and submission support.",
        features: [
          "Program & school shortlist",
          "SOP/Essay & CV review",
          "Application guidance",
          "Visa prep + interview practice",
        ],
        cta: "Talk to an advisor",
      },
    ];
  }, [pricingMode]);

  const testimonials = useMemo(
    () => [
      {
        quote:
          "The feedback on my writing was the turning point. I moved from 6.0 to 7.5 in four weeks.",
        name: "Brian N.",
        meta: "IELTS • Nairobi",
      },
      {
        quote:
          "The SOP edits were sharp and honest. I got an offer and the visa interview prep made it easy.",
        name: "Amina K.",
        meta: "Study Abroad • Mombasa",
      },
      {
        quote:
          "Speaking practice felt real—like the exam. I finally understood what examiners want.",
        name: "Sharon W.",
        meta: "IELTS • Kisumu (Online)",
      },
    ],
    []
  );

  const quizResult = useMemo(() => {
    if (!quiz.goal || !quiz.budget || !quiz.timeline) return null;

    // Simple heuristic for a helpful recommendation
    const fast = quiz.timeline === "0-3";
    const mid = quiz.timeline === "3-6";
    const highBudget = quiz.budget === "high";

    if (fast && highBudget) {
      return {
        title: "Recommended: Intensive + 1:1 + mock feedback",
        bullets: [
          "Start with a diagnostic + band-gap plan",
          "Add 1:1 coaching for writing/speaking",
          "Do a full mock evaluation every week",
        ],
      };
    }

    if (mid) {
      return {
        title: "Recommended: Group class + materials bundle",
        bullets: [
          "Join the structured group course",
          "Use templates + vocab packs for speed",
          "Book one mock evaluation before exam day",
        ],
      };
    }

    return {
      title: "Recommended: Step-by-step plan + monthly check-ins",
      bullets: [
        "Start with materials + weekly practice",
        "Schedule a mock evaluation once ready",
        "Upgrade to coaching when you hit a plateau",
      ],
    };
  }, [quiz]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const addToCart = (p: Product) => {
    setCartCount((c) => c + 1);
    // A simple microinteraction: auto-scroll to shop top after adding?
    // Keep it subtle: no scroll, just a count.
    void p;
  };

  return (
    <div className="relative min-h-screen bg-[#F6F8FF] text-[#0A1020]">
      {/* Scroll progress */}
      <motion.div
        className="fixed left-0 top-0 z-[60] h-1 w-full origin-left bg-[#1E5EFF]"
        style={{ scaleX: progress }}
      />

      <Glow />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#E7ECFF] bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <button
            onClick={() => scrollToId("home")}
            className="inline-flex items-center gap-2"
          >
            <span className="grid h-9 w-9 place-items-center rounded-2xl border border-[#E7ECFF] bg-white shadow-sm">
              <Sparkles className="h-5 w-5 text-[#1E5EFF]" />
            </span>
            <span className="font-semibold tracking-tight">{BRAND.name}</span>
          </button>

          <nav className="hidden items-center gap-5 md:flex">
            {links.slice(1, 7).map((l) => (
              <button
                key={l.id}
                onClick={() => scrollToId(l.id)}
                className="text-sm text-[#0A1020]/70 transition hover:text-[#0A1020]"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => scrollToId("contact")}
              className="text-sm text-[#0A1020]/70 transition hover:text-[#0A1020]"
            >
              Contact
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-2xl border border-[#E7ECFF] bg-white/70 px-3 py-2 text-sm shadow-sm backdrop-blur md:flex">
              <span className="text-[#0A1020]/70">Cart</span>
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[#0B1B3A] px-2 text-xs font-medium text-white">
                {cartCount}
              </span>
            </div>
            <Button
              className="hidden rounded-2xl border-[#E7ECFF] bg-white text-[#0A1020] hover:bg-white md:inline-flex"
              variant="outline"
              onClick={() => scrollToId("pricing")}
            >
              View pricing
            </Button>
            <Button
              className="rounded-2xl bg-[#1E5EFF] text-white hover:bg-[#1E5EFF]/90"
              onClick={() => scrollToId("book")}
            >
              Book a call <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={links} />

      {/* Hero */}
      <main id="home" className="relative">
        <section className="mx-auto max-w-6xl px-4 pb-10 pt-14 md:pb-16 md:pt-20">
          <motion.div
            variants={container}
            initial="hidden"
            animate={mounted ? "show" : "hidden"}
            className="grid items-center gap-10 md:grid-cols-2"
          >
            <motion.div variants={item} className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <Pill>
                  <BadgeCheck className="h-4 w-4 text-[#11B5A4]" /> British Council Certified
                </Pill>
                <Pill>
                  <Zap className="h-4 w-4 text-[#1E5EFF]" /> Score-focused coaching
                </Pill>
                <Pill>
                  <Globe className="h-4 w-4 text-[#0B1B3A]" /> {BRAND.cityLine}
                </Pill>
              </div>

              <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                {BRAND.tagline}
              </h1>
              <p className="text-pretty text-base leading-relaxed text-[#0A1020]/70 md:text-lg">
                We help students and professionals in Kenya (and worldwide) prepare for
                IELTS, TOEFL, and PTE—plus full study abroad guidance, materials, and mock
                evaluations.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  className="h-11 rounded-2xl bg-[#1E5EFF] text-white hover:bg-[#1E5EFF]/90"
                  onClick={() => scrollToId("book")}
                >
                  Book a free consultation <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  className="h-11 rounded-2xl border-[#E7ECFF] bg-white text-[#0A1020] hover:bg-white"
                  variant="outline"
                  onClick={() => scrollToId("test")}
                >
                  Explore classes
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <Stat label="Students supported" value="1,000+" />
                <Stat label="Avg improvement" value="+1 band" />
                <Stat label="Support" value="Online" />
              </div>

              <div className="rounded-3xl border border-[#E7ECFF] bg-white/70 p-4 shadow-sm backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm">
                    <span className="font-medium">Quick proof:</span>{" "}
                    <span className="text-[#0A1020]/70">
                      Certified trainers • Structured study plans • Real exam strategies
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#0A1020]/60">
                    <Shield className="h-4 w-4" /> Trusted process
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={item}
              className="relative"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            >
              <Card className="relative overflow-hidden rounded-[2rem] border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(30,94,255,0.22),transparent_45%),radial-gradient(circle_at_90%_40%,rgba(17,181,164,0.18),transparent_40%),radial-gradient(circle_at_40%_90%,rgba(255,176,32,0.12),transparent_40%)]" />
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">Your roadmap</CardTitle>
                      <CardDescription className="text-[#0A1020]/70">
                        Clarity → practice → feedback → results.
                      </CardDescription>
                    </div>
                    <Badge className="rounded-full bg-[#0B1B3A] text-white hover:bg-[#0B1B3A]">
                      Kenya
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-[#E7ECFF] bg-white/70 p-4">
                      <div className="text-sm font-medium">Test Prep</div>
                      <div className="mt-1 text-xs text-[#0A1020]/60">
                        IELTS / TOEFL / PTE
                      </div>
                    </div>
                    <div className="rounded-2xl border border-[#E7ECFF] bg-white/70 p-4">
                      <div className="text-sm font-medium">Study Abroad</div>
                      <div className="mt-1 text-xs text-[#0A1020]/60">
                        SOP • applications • visa prep
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-[#E7ECFF] bg-white/70 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Mock evaluation</div>
                        <div className="mt-1 text-xs text-[#0A1020]/60">
                          Band estimate + improvement plan
                        </div>
                      </div>
                      <motion.div
                        className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E7ECFF] bg-white"
                        animate={{ rotate: [0, 3, -2, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <BookOpen className="h-5 w-5 text-[#1E5EFF]" />
                      </motion.div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-[#E7ECFF] bg-white/70 p-4">
                      <div className="text-xs text-[#0A1020]/60">Writing</div>
                      <div className="mt-1 text-lg font-semibold">Feedback</div>
                    </div>
                    <div className="rounded-2xl border border-[#E7ECFF] bg-white/70 p-4">
                      <div className="text-xs text-[#0A1020]/60">Speaking</div>
                      <div className="mt-1 text-lg font-semibold">Simulation</div>
                    </div>
                    <div className="rounded-2xl border border-[#E7ECFF] bg-white/70 p-4">
                      <div className="text-xs text-[#0A1020]/60">Materials</div>
                      <div className="mt-1 text-lg font-semibold">Bundles</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <motion.div
                aria-hidden
                className="pointer-events-none absolute -bottom-8 -left-6 h-32 w-32 rounded-full bg-[#1E5EFF]/20 blur-2xl"
                animate={{ y: [0, -8, 0], x: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -right-10 top-10 h-40 w-40 rounded-full bg-[#11B5A4]/20 blur-2xl"
                animate={{ y: [0, 10, 0], x: [0, -6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Services overview */}
        <section className="mx-auto max-w-6xl px-4 pb-6">
          <SectionHeading
            eyebrow="Services"
            title="Everything you need to prepare and go global."
            desc="Choose structured classes, 1:1 coaching, study abroad support, materials, and mock evaluations—online or in-person." 
            right={
              <Button
                className="rounded-2xl bg-[#1E5EFF] text-white hover:bg-[#1E5EFF]/90"
                onClick={() => scrollToId("book")}
              >
                Talk to us <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            }
          />

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-4 md:grid-cols-4"
          >
            <ServiceCard
              icon={<Headphones className="h-5 w-5 text-[#1E5EFF]" />}
              title="Test Prep"
              desc="IELTS, TOEFL, PTE classes with strategy, practice, and feedback."
              bullets={["Group classes", "1:1 coaching", "Placement test", "Weekly drills"]}
              cta="Explore test prep"
              onClick={() => scrollToId("test")}
            />
            <ServiceCard
              icon={<GraduationCap className="h-5 w-5 text-[#11B5A4]" />}
              title="Study Abroad"
              desc="School selection, SOP/essays, applications, and visa preparation."
              bullets={["Shortlist programs", "SOP & CV review", "Application support", "Visa interview prep"]}
              cta="Explore study abroad"
              onClick={() => scrollToId("abroad")}
            />
            <ServiceCard
              icon={<BookOpen className="h-5 w-5 text-[#0B1B3A]" />}
              title="Materials"
              desc="High-quality learning materials for self-study and quick revision."
              bullets={["Templates", "Vocabulary packs", "Mock sets", "Bundles & discounts"]}
              cta="Browse shop"
              onClick={() => scrollToId("shop")}
            />
            <ServiceCard
              icon={<BadgeCheck className="h-5 w-5 text-[#FFB020]" />}
              title="Mock Evaluation"
              desc="Full feedback + band estimate + improvement plan."
              bullets={["Writing marking", "Speaking review", "Mistake analysis", "15-min feedback call"]}
              cta="Book evaluation"
              onClick={() => scrollToId("mock")}
            />
          </motion.div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading
            eyebrow="How it works"
            title="A simple process that gets results."
            desc="No confusion. Clear steps from your current level to your target score and your next move abroad." 
          />

          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                t: "Free consult",
                d: "We understand your goal, timeline, and target score/program.",
                i: <Calendar className="h-5 w-5 text-[#1E5EFF]" />,
              },
              {
                t: "Diagnostic + plan",
                d: "We map your band-gap and build a focused study roadmap.",
                i: <Zap className="h-5 w-5 text-[#11B5A4]" />,
              },
              {
                t: "Training + materials",
                d: "Classes/coaching + curated materials that accelerate your progress.",
                i: <BookOpen className="h-5 w-5 text-[#0B1B3A]" />,
              },
              {
                t: "Mock + refine",
                d: "We evaluate, correct, and refine until you’re exam-ready.",
                i: <BadgeCheck className="h-5 w-5 text-[#FFB020]" />,
              },
            ].map((s, idx) => (
              <motion.div
                key={s.t}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.05 }}
              >
                <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur">
                  <CardHeader>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E7ECFF] bg-white">
                      {s.i}
                    </div>
                    <CardTitle className="text-lg text-[#0A1020]">{s.t}</CardTitle>
                    <CardDescription className="text-base text-[#0A1020]/70">
                      {s.d}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-[#E7ECFF] bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-medium">Not sure where to start?</div>
                <div className="mt-1 text-sm text-[#0A1020]/70">
                  Book a free consultation—we’ll recommend the best plan for your goal.
                </div>
              </div>
              <Button
                className="rounded-2xl bg-[#1E5EFF] text-white hover:bg-[#1E5EFF]/90"
                onClick={() => scrollToId("book")}
              >
                Book now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Test Prep */}
        <section id="test" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading
            eyebrow="Test Prep"
            title="IELTS, TOEFL, and PTE—taught the right way."
            desc="Choose your exam and see course options, outcomes, and what’s included." 
            right={
              <Button
                variant="outline"
                className="rounded-2xl border-[#E7ECFF] bg-white"
                onClick={() => scrollToId("book")}
              >
                Book placement test
              </Button>
            }
          />

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Toggle
              left="IELTS"
              right="TOEFL"
              value={exam === "IELTS" ? "left" : "right"}
              onChange={(v) => setExam(v === "left" ? "IELTS" : "TOEFL")}
            />
            <div className="md:hidden" />
            <Toggle
              left="PTE"
              right="IELTS"
              value={exam === "PTE" ? "left" : "right"}
              onChange={(v) => setExam(v === "left" ? "PTE" : "IELTS")}
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Who it’s for</CardTitle>
                <CardDescription className="text-base text-[#0A1020]/70">
                  {exam === "IELTS"
                    ? "Students & professionals targeting UK/Canada/Australia and scholarships."
                    : exam === "TOEFL"
                      ? "University applicants aiming for US programs and academic English."
                      : "Candidates who want a faster, computer-based test with clear scoring."}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Course options</CardTitle>
                <CardDescription className="text-base text-[#0A1020]/70">
                  Group classes, 1:1 coaching, and intensive prep based on your timeline.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-[#0A1020]/70">
                <div className="flex items-center justify-between rounded-2xl border border-[#E7ECFF] bg-white/70 px-4 py-3">
                  <span>Group class (package)</span>
                  <span className="font-medium text-[#0A1020]">{formatKES(PRICES.ieltsGroup8)}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-[#E7ECFF] bg-white/70 px-4 py-3">
                  <span>1:1 coaching (per session)</span>
                  <span className="font-medium text-[#0A1020]">{formatKES(PRICES.ieltsOneOnOne)}</span>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Outcomes</CardTitle>
                <CardDescription className="text-base text-[#0A1020]/70">
                  Clear strategy + feedback loops—focused on score improvement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  {[
                    "Band-gap diagnostic",
                    "Writing correction + rewrite plan",
                    "Speaking drills + examiner criteria",
                    "Mock evaluation before exam",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-[#11B5A4]" />
                      <span className="text-[#0A1020]/70">{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle>Free level check</CardTitle>
                <CardDescription className="text-base text-[#0A1020]/70">
                  Get a quick recommendation on the right plan for your score goal.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm text-[#0A1020]/70">Name</label>
                    <Input placeholder="Your name" className="rounded-2xl border-[#E7ECFF] bg-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-[#0A1020]/70">Phone/WhatsApp</label>
                    <Input placeholder="+254..." className="rounded-2xl border-[#E7ECFF] bg-white" />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm text-[#0A1020]/70">Exam</label>
                    <Input
                      placeholder="IELTS / TOEFL / PTE"
                      className="rounded-2xl border-[#E7ECFF] bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-[#0A1020]/70">Target score</label>
                    <Input
                      placeholder="e.g., IELTS 7.0"
                      className="rounded-2xl border-[#E7ECFF] bg-white"
                    />
                  </div>
                </div>
                <Button
                  className="w-full rounded-2xl bg-[#1E5EFF] text-white hover:bg-[#1E5EFF]/90"
                  onClick={() => scrollToId("book")}
                >
                  Get recommendation
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle>What’s included</CardTitle>
                <CardDescription className="text-base text-[#0A1020]/70">
                  Practical training + materials + examiner-style feedback.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {["Lesson notes + drills", "Marking rubrics", "Weekly progress tracking", "Mock evaluation option"].map(
                  (t) => (
                    <div
                      key={t}
                      className="flex items-center justify-between rounded-2xl border border-[#E7ECFF] bg-white/70 px-4 py-3"
                    >
                      <span className="text-sm text-[#0A1020]/70">{t}</span>
                      <Check className="h-4 w-4 text-[#11B5A4]" />
                    </div>
                  )
                )}
                <Button
                  variant="outline"
                  className="mt-2 w-full rounded-2xl border-[#E7ECFF] bg-white"
                  onClick={() => scrollToId("shop")}
                >
                  Browse materials
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Study Abroad */}
        <section id="abroad" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading
            eyebrow="Study Abroad"
            title="Admissions support that feels organized and calm."
            desc="From program selection to SOP/essay review and visa interview practice—we guide every step." 
            right={
              <Button
                className="rounded-2xl bg-[#1E5EFF] text-white hover:bg-[#1E5EFF]/90"
                onClick={() => scrollToId("book")}
              >
                Book admissions consult
              </Button>
            }
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle>Regions we support</CardTitle>
                <CardDescription className="text-base text-[#0A1020]/70">
                  UK • Canada • USA • Australia • Europe (and more)
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {[
                  { t: "United Kingdom", m: "Schools + CAS planning" },
                  { t: "Canada", m: "Programs + SDS guidance" },
                  { t: "USA", m: "TOEFL + essays" },
                  { t: "Australia", m: "GTE + documents" },
                  { t: "Europe", m: "Scholarship routes" },
                  { t: "Online", m: "From anywhere" },
                ].map((r) => (
                  <div
                    key={r.t}
                    className="rounded-2xl border border-[#E7ECFF] bg-white/70 p-4"
                  >
                    <div className="text-sm font-medium">{r.t}</div>
                    <div className="mt-1 text-xs text-[#0A1020]/60">{r.m}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle>Eligibility checker</CardTitle>
                <CardDescription className="text-base text-[#0A1020]/70">
                  A quick guide to what we recommend based on your timeline and budget.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm text-[#0A1020]/70">Goal</label>
                    <select
                      className="h-10 w-full rounded-2xl border border-[#E7ECFF] bg-white px-3 text-sm"
                      value={quiz.goal}
                      onChange={(e) => setQuiz((s) => ({ ...s, goal: e.target.value }))}
                    >
                      <option value="">Select</option>
                      <option value="study">Study</option>
                      <option value="work">Work</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-[#0A1020]/70">Budget</label>
                    <select
                      className="h-10 w-full rounded-2xl border border-[#E7ECFF] bg-white px-3 text-sm"
                      value={quiz.budget}
                      onChange={(e) => setQuiz((s) => ({ ...s, budget: e.target.value }))}
                    >
                      <option value="">Select</option>
                      <option value="low">Low</option>
                      <option value="mid">Mid</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#0A1020]/70">Timeline</label>
                  <select
                    className="h-10 w-full rounded-2xl border border-[#E7ECFF] bg-white px-3 text-sm"
                    value={quiz.timeline}
                    onChange={(e) => setQuiz((s) => ({ ...s, timeline: e.target.value }))}
                  >
                    <option value="">Select</option>
                    <option value="0-3">0–3 months</option>
                    <option value="3-6">3–6 months</option>
                    <option value="6+">6+ months</option>
                  </select>
                </div>

                {quizResult ? (
                  <div className="rounded-3xl border border-[#E7ECFF] bg-white/70 p-4">
                    <div className="text-sm font-medium">{quizResult.title}</div>
                    <ul className="mt-3 space-y-2 text-sm text-[#0A1020]/70">
                      {quizResult.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 text-[#11B5A4]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="mt-4 w-full rounded-2xl bg-[#1E5EFF] text-white hover:bg-[#1E5EFF]/90"
                      onClick={() => scrollToId("book")}
                    >
                      Book a consult
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-[#E7ECFF] bg-white/70 p-4 text-sm text-[#0A1020]/70">
                    Select all fields to see a recommended plan.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {["School selection + shortlist", "SOP/Essay + CV review", "Visa interview prep"].map((t) => (
              <Card
                key={t}
                className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{t}</CardTitle>
                  <CardDescription className="text-base text-[#0A1020]/70">
                    Delivered with clear timelines, checklists, and reviewer-style feedback.
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading
            eyebrow="Pricing"
            title="Clear pricing, flexible options."
            desc="All prices are in KES. Toggle to see package vs monthly (demo)." 
            right={
              <Toggle
                left="Package"
                right="Monthly"
                value={pricingMode}
                onChange={setPricingMode}
              />
            }
          />

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-4 md:grid-cols-3"
          >
            {pricing.map((p) => (
              <PricingCard
                key={p.name}
                name={p.name}
                price={p.price}
                blurb={p.blurb}
                features={p.features}
                highlight={p.highlight}
                cta={p.cta}
                onClick={() => scrollToId("book")}
              />
            ))}
          </motion.div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Bootcamps</CardTitle>
                <CardDescription className="text-base text-[#0A1020]/70">
                  Intensive prep for short timelines.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-[#0A1020]/70">
                <div className="flex items-center justify-between rounded-2xl border border-[#E7ECFF] bg-white/70 px-4 py-3">
                  <span>TOEFL Bootcamp</span>
                  <span className="font-medium text-[#0A1020]">{formatKES(PRICES.toeflBootcamp)}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-[#E7ECFF] bg-white/70 px-4 py-3">
                  <span>PTE Intensive</span>
                  <span className="font-medium text-[#0A1020]">{formatKES(PRICES.pteIntensive)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full rounded-2xl bg-[#1E5EFF] text-white hover:bg-[#1E5EFF]/90"
                  onClick={() => scrollToId("book")}
                >
                  Ask about schedule
                </Button>
              </CardFooter>
            </Card>

            <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Mock evaluation</CardTitle>
                <CardDescription className="text-base text-[#0A1020]/70">
                  Full feedback and band estimate.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-2xl border border-[#E7ECFF] bg-white/70 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#0A1020]/70">Mock Evaluation</span>
                    <span className="font-medium text-[#0A1020]">{formatKES(PRICES.mockEvaluation)}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#0A1020]/60">
                    Writing or speaking feedback with an improvement plan.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-2xl border-[#E7ECFF] bg-white"
                  onClick={() => scrollToId("mock")}
                >
                  See details
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Add-ons</CardTitle>
                <CardDescription className="text-base text-[#0A1020]/70">
                  Upgrade your plan when needed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  {[
                    "SOP/Essay express review",
                    "Visa interview practice",
                    "Extra writing corrections",
                    "Speaking mock simulation",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-[#11B5A4]" />
                      <span className="text-[#0A1020]/70">{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full rounded-2xl bg-[#1E5EFF] text-white hover:bg-[#1E5EFF]/90"
                  onClick={() => scrollToId("contact")}
                >
                  Request custom quote
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Shop */}
        <section id="shop" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading
            eyebrow="Shop Materials"
            title="Buy learning materials and practice packs."
            desc="For students who want self-study materials, templates, vocabulary packs, and mock sets." 
            right={
              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-2xl border border-[#E7ECFF] bg-white/70 px-3 py-2 text-sm shadow-sm backdrop-blur md:flex">
                  <span className="text-[#0A1020]/70">Cart</span>
                  <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[#0B1B3A] px-2 text-xs font-medium text-white">
                    {cartCount}
                  </span>
                </div>
                <Button
                  className="rounded-2xl bg-[#1E5EFF] text-white hover:bg-[#1E5EFF]/90"
                  onClick={() => scrollToId("contact")}
                >
                  Ask about M-Pesa
                </Button>
              </div>
            }
          />

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Filter</CardTitle>
                <CardDescription className="text-base text-[#0A1020]/70">
                  Find what you need fast.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-[#0A1020]/70">Search</label>
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Templates, vocab, mock..."
                    className="rounded-2xl border-[#E7ECFF] bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#0A1020]/70">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {(
                      ["All", "IELTS", "TOEFL", "PTE", "Writing", "Vocabulary", "Bundles"] as const
                    ).map((c) => (
                      <button
                        key={c}
                        onClick={() => setCat(c)}
                        className={classNames(
                          "rounded-full border px-3 py-1 text-sm shadow-sm transition",
                          c === cat
                            ? "border-[#0B1B3A] bg-[#0B1B3A] text-white"
                            : "border-[#E7ECFF] bg-white/70 text-[#0A1020]/70 hover:text-[#0A1020]"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-[#E7ECFF] bg-white/70 p-4">
                  <div className="text-sm font-medium">Payments (placeholder)</div>
                  <div className="mt-1 text-sm text-[#0A1020]/70">
                    M-Pesa + card supported. We’ll share payment instructions after checkout.
                  </div>
                </div>

                <Button
                  className="w-full rounded-2xl bg-[#1E5EFF] text-white hover:bg-[#1E5EFF]/90"
                  onClick={() => scrollToId("book")}
                >
                  Need help choosing?
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} p={p} onAdd={addToCart} />
              ))}

              {filteredProducts.length === 0 ? (
                <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur md:col-span-2">
                  <CardContent className="pt-6">
                    <div className="text-sm text-[#0A1020]/70">
                      No products match your filter. Try another category or search term.
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-[#E7ECFF] bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-medium">Bundle & Save</div>
                <div className="mt-1 text-sm text-[#0A1020]/70">
                  Get templates + vocab + one mock evaluation for faster improvement.
                </div>
              </div>
              <Button
                className="rounded-2xl bg-[#FFB020] text-[#0B1B3A] hover:bg-[#FFB020]/90"
                onClick={() => scrollToId("mock")}
              >
                View mock evaluation
              </Button>
            </div>
          </div>
        </section>

        {/* Mock Evaluation */}
        <section id="mock" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading
            eyebrow="Mock Evaluation"
            title="Know where you stand before exam day."
            desc="Get a band estimate, detailed feedback, mistake analysis, and an improvement plan." 
            right={
              <Button
                className="rounded-2xl bg-[#1E5EFF] text-white hover:bg-[#1E5EFF]/90"
                onClick={() => scrollToId("book")}
              >
                Book evaluation
              </Button>
            }
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle>What you receive</CardTitle>
                <CardDescription className="text-base text-[#0A1020]/70">
                  Actionable feedback that directly improves your score.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  {[
                    "Band estimate / scoring breakdown",
                    "Mistake analysis (what’s holding you back)",
                    "Improvement plan (exact steps)",
                    "Optional 15-min feedback call",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-[#11B5A4]" />
                      <span className="text-[#0A1020]/70">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-3xl border border-[#E7ECFF] bg-white/70 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#0A1020]/70">Mock Evaluation</span>
                    <span className="font-medium text-[#0A1020]">{formatKES(PRICES.mockEvaluation)}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#0A1020]/60">
                    Choose writing or speaking (or both).
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle>Submit sample (UI placeholder)</CardTitle>
                <CardDescription className="text-base text-[#0A1020]/70">
                  Wire this to your backend/email service. For now, it’s a clean form UI.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm text-[#0A1020]/70">Name</label>
                    <Input className="rounded-2xl border-[#E7ECFF] bg-white" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-[#0A1020]/70">Email</label>
                    <Input className="rounded-2xl border-[#E7ECFF] bg-white" placeholder="you@email.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#0A1020]/70">Exam</label>
                  <Input className="rounded-2xl border-[#E7ECFF] bg-white" placeholder="IELTS / TOEFL / PTE" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#0A1020]/70">Sample link / notes</label>
                  <Textarea
                    className="min-h-[110px] rounded-2xl border-[#E7ECFF] bg-white"
                    placeholder="Paste a Google Drive link or describe what you want evaluated..."
                  />
                </div>
                <Button
                  className="w-full rounded-2xl bg-[#1E5EFF] text-white hover:bg-[#1E5EFF]/90"
                  onClick={() => scrollToId("book")}
                >
                  Proceed to booking
                </Button>
                <p className="text-xs text-[#0A1020]/60">
                  Note: this demo doesn’t submit. Replace with your form handler.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Success */}
        <section id="stories" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading
            eyebrow="Success"
            title="Real progress, not guesses."
            desc="Replace these with your students’ testimonials and admission wins." 
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Carousel items={testimonials} />

            <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle>What we track</CardTitle>
                <CardDescription className="text-base text-[#0A1020]/70">
                  We focus on outcomes and consistent improvement.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {["Writing progress", "Speaking fluency", "Reading accuracy", "Listening speed"].map((t) => (
                  <div
                    key={t}
                    className="rounded-2xl border border-[#E7ECFF] bg-white/70 p-4"
                  >
                    <div className="text-sm font-medium">{t}</div>
                    <div className="mt-1 text-xs text-[#0A1020]/60">
                      Weekly drills + feedback
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full rounded-2xl border-[#E7ECFF] bg-white"
                  onClick={() => scrollToId("book")}
                >
                  Start your plan
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Booking */}
        <section id="book" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading
            eyebrow="Book a Call"
            title="Choose a time that works for you."
            desc="Book a free 15-minute consultation or a longer strategy session. (Embed placeholder below.)" 
          />

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur md:col-span-1">
              <CardHeader>
                <CardTitle>Call types</CardTitle>
                <CardDescription className="text-base text-[#0A1020]/70">
                  Two simple options.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[{
                  t: "Free Consultation",
                  d: "15 minutes • quick recommendation",
                }, {
                  t: "Strategy Session",
                  d: "30–45 minutes • deep plan",
                }].map((x) => (
                  <div
                    key={x.t}
                    className="rounded-2xl border border-[#E7ECFF] bg-white/70 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{x.t}</span>
                      <Calendar className="h-4 w-4 text-[#1E5EFF]" />
                    </div>
                    <div className="mt-1 text-sm text-[#0A1020]/70">{x.d}</div>
                  </div>
                ))}

                <div className="rounded-3xl border border-[#E7ECFF] bg-white/70 p-4">
                  <div className="text-sm font-medium">Tip</div>
                  <div className="mt-1 text-sm text-[#0A1020]/70">
                    Add your Calendly or Google Appointment Schedule embed URL in the code
                    constant <span className="font-mono">BOOKING_EMBED_URL</span>.
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button
                  className="w-full rounded-2xl bg-[#1E5EFF] text-white hover:bg-[#1E5EFF]/90"
                  onClick={() => scrollToId("contact")}
                >
                  Prefer WhatsApp?
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-2xl border-[#E7ECFF] bg-white"
                  onClick={() => scrollToId("pricing")}
                >
                  See pricing
                </Button>
              </CardFooter>
            </Card>

            <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur md:col-span-2">
              <CardHeader>
                <CardTitle>Calendar embed (placeholder)</CardTitle>
                <CardDescription className="text-base text-[#0A1020]/70">
                  This iframe will work once you paste a valid scheduling embed URL.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-[16/10] overflow-hidden rounded-3xl border border-[#E7ECFF] bg-white">
                  <iframe
                    title="Booking"
                    src={BOOKING_EMBED_URL}
                    className="h-full w-full"
                    loading="lazy"
                  />
                </div>
                <p className="mt-3 text-xs text-[#0A1020]/60">
                  If your provider blocks iframe embedding, swap to their official embed snippet
                  or link users to a booking page.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* About */}
        <section id="about" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading
            eyebrow="About"
            title="An agency-style experience, with personal care."
            desc="We combine certified training methods with practical coaching, and we keep everything organized—so you always know what to do next." 
          />

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Certified training</CardTitle>
                <CardDescription className="text-base text-[#0A1020]/70">
                  British Council certified + structured scoring rubrics.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Clear systems</CardTitle>
                <CardDescription className="text-base text-[#0A1020]/70">
                  Checklists, timelines, progress tracking, and clear next steps.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Local + global</CardTitle>
                <CardDescription className="text-base text-[#0A1020]/70">
                  Kenya-based with online support for international clients.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="mt-8 rounded-3xl border border-[#E7ECFF] bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-medium">Want this branded to you?</div>
                <div className="mt-1 text-sm text-[#0A1020]/70">
                  Swap the name, colors, images, and certification badges—everything is ready.
                </div>
              </div>
              <Button
                className="rounded-2xl bg-[#1E5EFF] text-white hover:bg-[#1E5EFF]/90"
                onClick={() => scrollToId("contact")}
              >
                Customize now
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading
            eyebrow="FAQ"
            title="Common questions."
            desc="Fast answers about classes, materials, and study abroad support." 
          />

          <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur">
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Do you offer online classes?</AccordionTrigger>
                  <AccordionContent>
                    Yes. We run online sessions and can support clients across Kenya and internationally.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I just buy materials without classes?</AccordionTrigger>
                  <AccordionContent>
                    Yes. You can buy templates, vocab packs, and mock sets—plus you can add a mock evaluation.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I know my current band/level?</AccordionTrigger>
                  <AccordionContent>
                    Book a placement test or request a mock evaluation for writing/speaking feedback and an estimate.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Do you help with SOP and visa interview prep?</AccordionTrigger>
                  <AccordionContent>
                    Yes. Our study abroad support includes SOP/essay review, application guidance, and visa interview practice.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto max-w-6xl px-4 pb-20 pt-10">
          <SectionHeading
            eyebrow="Contact"
            title="Tell us what you need."
            desc="Classes, materials, mock evaluation, or study abroad support—share your goal and we’ll guide you." 
          />

          <div className="grid gap-8 md:grid-cols-2 md:items-start">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="grid gap-3">
                <div className="flex items-center gap-3 rounded-3xl border border-[#E7ECFF] bg-white/70 p-4 shadow-sm backdrop-blur">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E7ECFF] bg-white">
                    <Mail className="h-5 w-5 text-[#1E5EFF]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm text-[#0A1020]/70">{CONTACT.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-3xl border border-[#E7ECFF] bg-white/70 p-4 shadow-sm backdrop-blur">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E7ECFF] bg-white">
                    <Phone className="h-5 w-5 text-[#11B5A4]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Phone</div>
                    <div className="text-sm text-[#0A1020]/70">{CONTACT.phoneDisplay}</div>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${CONTACT.whatsappWaMe}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-3xl border border-[#E7ECFF] bg-white/70 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E7ECFF] bg-white">
                    <MessageCircle className="h-5 w-5 text-[#0B1B3A]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">WhatsApp</div>
                    <div className="text-sm text-[#0A1020]/70">{CONTACT.whatsappDisplay}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#0A1020]/60" />
                </a>
              </div>

              <div className="rounded-3xl border border-[#E7ECFF] bg-white/70 p-6 shadow-sm backdrop-blur">
                <div className="text-sm font-medium">Quick CTA</div>
                <div className="mt-1 text-sm text-[#0A1020]/70">
                  Book a free consultation to get your exact plan.
                </div>
                <Button
                  className="mt-4 w-full rounded-2xl bg-[#1E5EFF] text-white hover:bg-[#1E5EFF]/90"
                  onClick={() => scrollToId("book")}
                >
                  Book a call
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.06 }}
            >
              <Card className="rounded-3xl border border-[#E7ECFF] bg-white/70 shadow-sm backdrop-blur">
                <CardHeader>
                  <CardTitle>Send a message</CardTitle>
                  <CardDescription className="text-base text-[#0A1020]/70">
                    This demo form doesn’t submit—wire it to email/CRM when you deploy.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm text-[#0A1020]/70">Name</label>
                      <Input className="rounded-2xl border-[#E7ECFF] bg-white" placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-[#0A1020]/70">Email</label>
                      <Input className="rounded-2xl border-[#E7ECFF] bg-white" placeholder="you@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-[#0A1020]/70">Service</label>
                    <Input
                      className="rounded-2xl border-[#E7ECFF] bg-white"
                      placeholder="IELTS / TOEFL / PTE / Study Abroad / Materials / Mock"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-[#0A1020]/70">Details</label>
                    <Textarea
                      placeholder="Tell us your goal, timeline, and target score/program..."
                      className="min-h-[120px] rounded-2xl border-[#E7ECFF] bg-white"
                    />
                  </div>
                  <Button className="w-full rounded-2xl bg-[#1E5EFF] text-white hover:bg-[#1E5EFF]/90">
                    Send message <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="text-xs text-[#0A1020]/60">
                    By sending, you agree to be contacted about your request.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#E7ECFF] bg-white/60 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="inline-flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-2xl border border-[#E7ECFF] bg-white shadow-sm">
                  <Sparkles className="h-5 w-5 text-[#1E5EFF]" />
                </span>
                <div>
                  <div className="font-semibold tracking-tight">{BRAND.name}</div>
                  <div className="text-xs text-[#0A1020]/60">Study abroad + exam prep</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {links.slice(0, 8).map((l) => (
                  <Button
                    key={l.id}
                    variant="ghost"
                    className="rounded-2xl"
                    onClick={() => scrollToId(l.id)}
                  >
                    {l.label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="my-8" />

            <div className="flex flex-col gap-2 text-sm text-[#0A1020]/70 md:flex-row md:items-center md:justify-between">
              <div>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</div>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Privacy
                </span>
                <span className="inline-flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Terms
                </span>
              </div>
            </div>
          </div>
        </footer>

        {/* Floating buttons */}
        <motion.button
          className="fixed bottom-5 right-5 z-50 rounded-2xl border border-[#E7ECFF] bg-white/80 p-3 shadow-sm backdrop-blur transition hover:-translate-y-0.5"
          onClick={() => scrollToId("home")}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          aria-label="Back to top"
        >
          <ArrowRight className="h-5 w-5 -rotate-90 text-[#0B1B3A]" />
        </motion.button>

        <a
          href={`https://wa.me/${CONTACT.whatsappWaMe}`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 rounded-2xl border border-[#E7ECFF] bg-white/80 px-4 py-3 text-sm shadow-sm backdrop-blur transition hover:-translate-y-0.5"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-5 w-5 text-[#0B1B3A]" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </main>
    </div>
  );
}
