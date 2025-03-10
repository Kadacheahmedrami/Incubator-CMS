"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// --- Data Interfaces ---
export interface HeroData {
  id?: number;
  landingImage: string;
  title: string;
  description: string;
  landingPageId: number;
}

export interface HistoryAndValuesData {
  id: number;
  title: string;
  landingImage: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FeaturedHistoryAndValue {
  id: number;
  historyAndValueId: number;
  landingPageId: number;
  order: number;
  historyAndValue: HistoryAndValuesData;
}

export interface EventData {
  id: number;
  title: string;
  landingImage: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FeaturedEvent {
  id: number;
  eventId: number;
  landingPageId: number;
  order: number;
  event: EventData;
}

export interface PartnerData {
  id?: number;
  name: string;
  logo: string;
  url?: string | null;
  landingPageId: number;
}

export interface StartupData {
  id: number;
  name: string;
  description?: string | null;
}

export interface FeaturedStartupData {
  id?: number;
  startupId: number;
  order: number;
  landingPageId: number;
  startup?: StartupData;
}

export interface FAQData {
  id?: number;
  question: string;
  answer: string;
  order: number;
  landingPageId: number;
}

export interface ProgramData {
  id: number;
  title: string;
  landingImage: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FeaturedProgram {
  id: number;
  programId: number;
  landingPageId: number;
  order: number;
  program: ProgramData;
}

export interface NewsData {
  id: number;
  title: string;
  landingImage: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FeaturedNews {
  id: number;
  newsId: number;
  landingPageId: number;
  order: number;
  news: NewsData;
}

export interface VisionAndMissionData {
  id?: number;
  vision: string;
  mission: string;
  order: number;
  landingPageId: number;
}

export interface FooterData {
  id?: number;
  content: string;
  landingPageId: number;
}

export interface LandingPageData {
  heroSections: HeroData[];
  featuredHistoryAndValues: FeaturedHistoryAndValue[];
  featuredEvents: FeaturedEvent[];
  partners: PartnerData[];
  featuredStartups: FeaturedStartupData[];
  faqs: FAQData[];
  featuredPrograms: FeaturedProgram[];
  featuredNews: FeaturedNews[];
  visionAndMission: VisionAndMissionData[];
  footer: FooterData | null;
}

export interface ExtendedLandingPageData {
  heroSections?: HeroData[];
  historyAndValues?: HistoryAndValuesData[];
  events?: EventData[];
  partners?: PartnerData[];
  featuredStartups?: FeaturedStartupData[];
  faqs?: FAQData[];
  programs?: ProgramData[];
  news?: NewsData[];
  visionAndMission?: VisionAndMissionData[];
  footer?: FooterData;
}

interface LandingPageClientProps {
  landingPageData: LandingPageData;
}

// --- Main Component ---
export default function LandingPageClient({ landingPageData }: LandingPageClientProps) {
  // Fallback data for heroSections and footer if not provided.
  const safeData: LandingPageData = {
    heroSections: landingPageData.heroSections || [],
    featuredHistoryAndValues: landingPageData.featuredHistoryAndValues || [],
    featuredEvents: landingPageData.featuredEvents || [],
    partners: landingPageData.partners || [],
    featuredStartups: landingPageData.featuredStartups || [],
    faqs: landingPageData.faqs || [],
    featuredPrograms: landingPageData.featuredPrograms || [],
    featuredNews: landingPageData.featuredNews || [],
    visionAndMission: landingPageData.visionAndMission || [],
    footer: landingPageData.footer || null,
  };

  return (
    <main className="font-sans text-gray-900">
      <HeroSection heroData={safeData.heroSections} />
      <HistoryAndValuesSection items={safeData.featuredHistoryAndValues.map(f => f.historyAndValue)} />
      <EventsSection items={safeData.featuredEvents.map(f => f.event)} />
      <PartnersSection items={safeData.partners} />
      <FeaturedStartupsSection items={safeData.featuredStartups} />
      <FAQSection items={safeData.faqs} />
      <ProgramsSection items={safeData.featuredPrograms.map(f => f.program)} />
      <NewsSection items={safeData.featuredNews.map(f => f.news)} />
      <VisionAndMissionSection items={safeData.visionAndMission} />
      <CtaSection />
      {safeData.footer && safeData.footer.content && <FooterSection footer={safeData.footer} />}
    </main>
  );
}

// --- Sections ---

const HeroSection: React.FC<{ heroData: HeroData[] }> = ({ heroData }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroData.length]);

  return (
    <section className="relative h-screen">
      {heroData.map((hero, index) => (
        <motion.div
          key={hero.id ?? index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: index === current ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          style={{ zIndex: index === current ? 10 : 0 }}
        >
          <Image
            src={hero.landingImage || "/placeholder.svg"}
            alt={`Hero background ${index + 1}`}
            fill
            style={{ objectFit: "cover" }}
            unoptimized
          />
          <div className="absolute inset-0 flex flex-col h-full bg-gradient-to-b from-[#000957] to-[#344CB7] opacity-50" />
          <div className="relative z-10 my-[40vh] text-center text-white px-4">
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ opacity: index === current ? 1 : 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              {hero.title}
            </motion.h1>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ opacity: index === current ? 1 : 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl md:text-2xl mx-[10%] text-yellow-500 mb-8"
            >
              {hero.description}
            </motion.p>
            <div className="flex flex-wrap w-full mt-16">
              <button className="flex-1 basis-[200px] mx-8 my-2 bg-yellow-500 rounded-lg py-2 text-white flex justify-center items-center text-2xl transition duration-200 ease-in-out border-yellow-500 border-[3px] transform hover:bg-transparent hover:text-yellow-500">
                Explore Now
              </button>
              <button className="flex-1 basis-[200px] mx-8 my-2 rounded-lg py-2 border-yellow-500 border-[3px] text-yellow-500 flex justify-center items-center text-2xl transition duration-200 ease-in-out transform hover:bg-yellow-500 hover:text-white">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
};

const HistoryAndValuesSection: React.FC<{ items: HistoryAndValuesData[] }> = ({ items }) => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">History & Values</h2>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div key={item.id ?? index} className="bg-gray-100 p-6 rounded-lg shadow">
              {item.landingImage && (
                <Image
                  src={item.landingImage}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="object-cover mb-4"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No History & Values data available.</p>
      )}
    </div>
  </section>
);

const EventsSection: React.FC<{ items: EventData[] }> = ({ items }) => (
  <section className="py-20 bg-gray-50">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Events</h2>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div key={item.id ?? index} className="bg-white p-6 rounded-lg shadow">
              {item.landingImage && (
                <Image
                  src={item.landingImage}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="object-cover mb-4"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No Events data available.</p>
      )}
    </div>
  </section>
);

const PartnersSection: React.FC<{ items: PartnerData[] }> = ({ items }) => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Partners</h2>
      {items.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-8">
          {items.map((item, index) => (
            <div key={item.id ?? index} className="p-4">
              {item.logo && (
                <Image
                  src={item.logo}
                  alt={item.name}
                  width={150}
                  height={100}
                  className="object-contain"
                  unoptimized
                />
              )}
              <p className="text-center mt-2">{item.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No Partners data available.</p>
      )}
    </div>
  </section>
);

const FeaturedStartupsSection: React.FC<{ items: FeaturedStartupData[] }> = ({ items }) => (
  <section className="py-20 bg-gray-100">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Featured Startups</h2>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div key={item.id ?? index} className="bg-white p-6 rounded-lg shadow">
              <p>
                <strong>Startup ID:</strong> {item.startupId}
              </p>
              {item.startup && (
                <p>
                  <strong>Name:</strong> {item.startup.name}
                </p>
              )}
              <p>
                <strong>Order:</strong> {item.order}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No Featured Startups data available.</p>
      )}
    </div>
  </section>
);

const FAQSection: React.FC<{ items: FAQData[] }> = ({ items }) => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">FAQs</h2>
      {items.length > 0 ? (
        <div className="space-y-4">
          {items
            .sort((a, b) => a.order - b.order)
            .map((item, index) => (
              <div key={item.id ?? index} className="p-4 border rounded">
                <h3 className="text-xl font-semibold mb-2">{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
        </div>
      ) : (
        <p className="text-center">No FAQs data available.</p>
      )}
    </div>
  </section>
);

const ProgramsSection: React.FC<{ items: ProgramData[] }> = ({ items }) => (
  <section className="py-20 bg-gray-50">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Programs</h2>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div key={item.id ?? index} className="bg-white p-6 rounded-lg shadow">
              {item.landingImage && (
                <Image
                  src={item.landingImage}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="object-cover mb-4"
                  unoptimized
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No Programs data available.</p>
      )}
    </div>
  </section>
);

const NewsSection: React.FC<{ items: NewsData[] }> = ({ items }) => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">News</h2>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div key={item.id ?? index} className="bg-gray-100 p-6 rounded-lg shadow">
              {item.landingImage && (
                <Image
                  src={item.landingImage}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="object-cover mb-4"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No News data available.</p>
      )}
    </div>
  </section>
);

const VisionAndMissionSection: React.FC<{ items: VisionAndMissionData[] }> = ({ items }) => (
  <section className="py-20 bg-gray-50">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Vision & Mission</h2>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items
            .sort((a, b) => a.order - b.order)
            .map((item, index) => (
              <div key={item.id ?? index} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">Vision</h3>
                <p>{item.vision}</p>
                <h3 className="text-xl font-semibold mt-4 mb-2">Mission</h3>
                <p>{item.mission}</p>
              </div>
            ))}
        </div>
      ) : null}
    </div>
  </section>
);

const CtaSection: React.FC = () => (
  <section className="py-20 bg-blue-600 text-white">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-4">Ready to Launch Your Startup?</h2>
      <p className="text-xl mb-8">Join our incubator program today.</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg"
      >
        Apply Now
      </motion.button>
    </div>
  </section>
);

const FooterSection: React.FC<{ footer: FooterData }> = ({ footer }) => (
  <footer className="py-8 bg-gray-800 text-white">
    <div className="container mx-auto px-4 text-center" dangerouslySetInnerHTML={{ __html: footer.content }} />
  </footer>
);
