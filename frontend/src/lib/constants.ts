export const BRAND = {
  name: 'BlueBridge Global Prep',
  tagline: 'Get the score. Get the offer. Go global.',
  city: 'Kenya-based · Online + In-person',
}

export const CONTACT = {
  email: 'ndindasharon9@gmail.com',
  phone: '070366879',
  whatsappWaMe: '25470366879',
  whatsappDisplay: '+254 703 668 79',
}

export const BOOKING_EMBED_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2B8DLKXdguUj5rSlKtyGK5jVGQ5ErsQPq74atqR0kGwDfpoBswKRfkkAflg4CofJpt4c46VH1a?gv=true'

export const PRICES = {
  ieltsGroup: 12000,
  ieltsOneOnOne: 4500,
  toeflBootcamp: 18000,
  pteIntensive: 20000,
  admissionsSupport: 45000,
  mockEvaluation: 3500,
  writingTemplates: 1200,
  vocabPack: 900,
  speakingPrompts: 1500,
  pteCoreMock: 1800,
  ieltsMockBundle: 2500,
  ieltsPrintBook: 3000,
}

export interface Product {
  id: string
  title: string
  category: string
  format: string
  price: number
  badge?: string
  stars: number
  reviews: number
}

export const PRODUCTS: Product[] = [
  { id: 'p1', title: 'IELTS Writing Templates Pack', category: 'IELTS', format: 'PDF', price: 1200, badge: 'Popular', stars: 5, reviews: 148 },
  { id: 'p2', title: 'IELTS Vocabulary Builder',     category: 'IELTS', format: 'PDF', price: 900,  stars: 4, reviews: 93 },
  { id: 'p3', title: 'TOEFL Speaking Prompts + Rubrics', category: 'TOEFL', format: 'PDF', price: 1500, stars: 5, reviews: 61 },
  { id: 'p4', title: 'PTE Core Mock Pack',            category: 'PTE',   format: 'PDF', price: 1800, badge: 'Popular', stars: 5, reviews: 74 },
  { id: 'p5', title: 'IELTS Full Mock Bundle',        category: 'IELTS', format: 'PDF', price: 2500, stars: 5, reviews: 112 },
  { id: 'p6', title: 'IELTS Print Practice Book',     category: 'IELTS', format: 'Print', price: 3000, stars: 4, reviews: 38 },
]

export const TESTIMONIALS = [
  {
    name: 'Brian N.',
    detail: 'IELTS Academic, Nairobi',
    quote: "The feedback on my writing was the turning point. I moved from 6.0 to 7.5 in just four weeks of focused practice.",
    score: 'Band 7.5',
  },
  {
    name: 'Amina K.',
    detail: 'Study Abroad, Mombasa → UK',
    quote: "The SOP edits were sharp and honest. I got an offer from my first-choice university and the visa interview prep made everything easy.",
    score: 'Offer secured',
  },
  {
    name: 'Sharon W.',
    detail: 'IELTS, Kisumu — Online',
    quote: "Speaking practice felt completely real — like the actual exam. I finally understood what examiners look for and my score jumped from 6.5 to 8.0.",
    score: 'Band 8.0',
  },
]

export const FAQS = [
  { q: 'Do you offer online classes?', a: 'Yes — all our classes are available online via Zoom or Google Meet. We also offer in-person sessions in Nairobi.' },
  { q: 'Can I buy materials without joining classes?', a: 'Absolutely. Visit our shop to purchase individual PDFs, bundles, or print materials with no commitment required.' },
  { q: 'How do I find out my current band / level?', a: 'Book a free placement session. We will assess your current level and recommend the right programme.' },
  { q: 'Do you help with SOP writing and visa interview prep?', a: 'Yes — our study abroad package includes SOP drafting and review, school selection, and full visa interview coaching.' },
  { q: 'What payment methods do you accept?', a: 'We accept M-Pesa (STK Push) and major debit/credit cards. Payment instructions are shared after booking.' },
]
