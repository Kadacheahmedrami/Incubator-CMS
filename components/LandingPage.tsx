  "use client";
  import React from "react";
  import Image from "next/image";
  import { motion } from "framer-motion";
  import type {
    HistoryAndValuesData,
    EventData,
    PartnerData,
    FeaturedStartupData,
    FAQData,
    ProgramData,
    NewsData,
    VisionAndMissionData,
    FooterData,
  } from "@/hooks/useLandingPageData";

  // Update the hero interface.
  export interface HeroData {
    landingImage: string;
    title: string;
    description: string;
  }

  // Our full landing page data now includes an array of hero sections along with other sections.
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

  interface LandingPageProps {
    data: ExtendedLandingPageData;
  }

  export const LandingPage: React.FC<LandingPageProps> = ({ data }) => {
    // Provide safe defaults if any section is missing.
    const safeData: ExtendedLandingPageData = {
      heroSections:
        data.heroSections && data.heroSections.length > 0
          ? data.heroSections
          : [
              {
                landingImage: "/placeholder.svg",
                title: "Innovate. Incubate. Accelerate.",
                description: "Empowering the next generation of startups.",
              },
            ],
      historyAndValues: data.historyAndValues || [],
      events: data.events || [],
      partners: data.partners || [],
      featuredStartups: data.featuredStartups || [],
      faqs: data.faqs || [],
      programs: data.programs || [],
      news: data.news || [],
      visionAndMission: data.visionAndMission || [],
      footer: data.footer || { content: "" },
    };

    return (
      <main className="font-sans text-gray-900">
        <HeroSection heroData={safeData.heroSections!} />
        <HistoryAndValuesSection items={safeData.historyAndValues!} />
        <EventsSection items={safeData.events!} />
        <PartnersSection items={safeData.partners!} />
        <FeaturedStartupsSection items={safeData.featuredStartups!} />
        <FAQSection items={safeData.faqs!} />
        <ProgramsSection items={safeData.programs!} />
        <NewsSection items={safeData.news!} />
        <VisionAndMissionSection items={safeData.visionAndMission!} />
        <CtaSection />
        {safeData.footer && safeData.footer.content && (
          <FooterSection footer={safeData.footer} />
        )}
      </main>
    );
  };

  const HeroSection: React.FC<{ heroData: HeroData[] }> = ({ heroData }) => {
    return (
      <section className="relative">
        {heroData.map((hero, index) => (
          <div key={index} className="h-screen flex items-center justify-center relative">
            <Image
              src={hero.landingImage || "/placeholder.svg"}
              alt={`Hero background ${index + 1}`}
              fill
              style={{ objectFit: "cover" }}
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#000957] to-[#344CB7] opacity-50" />
            <div className="relative z-10 text-center text-white px-4">
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl font-bold mb-4"
              >
                {hero.title}
              </motion.h1>
              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-xl md:text-2xl mx-[10%] mb-8"
              >
                {hero.description}
              </motion.p>
            </div>
          </div>
        ))}
      </section>
    );
  };

  const HistoryAndValuesSection: React.FC<{ items: HistoryAndValuesData[] }> = ({
    items,
  }) => (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">History & Values</h2>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items
              .sort((a, b) => a.order - b.order)
              .map((item, index) => (
                <div key={index} className="bg-gray-100 p-6 rounded-lg shadow">
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
            {items
              .sort((a, b) => a.order - b.order)
              .map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow">
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
              <div key={index} className="p-4">
                {item.logo && (
                  <Image
                    src={item.logo}
                    alt={item.name}
                    width={150}
                    height={100}
                    className="object-contain"
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

  const FeaturedStartupsSection: React.FC<{ items: FeaturedStartupData[] }> = ({
    items,
  }) => (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Startups</h2>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items
              .sort((a, b) => a.order - b.order)
              .map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow">
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
                <div key={index} className="p-4 border rounded">
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
            {items
              .sort((a, b) => a.order - b.order)
              .map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow">
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
            {items
              .sort((a, b) => a.order - b.order)
              .map((item, index) => (
                <div key={index} className="bg-gray-100 p-6 rounded-lg shadow">
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

  const VisionAndMissionSection: React.FC<{ items: VisionAndMissionData[] }> = ({
    items,
  }) => (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Vision & Mission</h2>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {items
              .sort((a, b) => a.order - b.order)
              .map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-2">Vision</h3>
                  <p>{item.vision}</p>
                  <h3 className="text-xl font-semibold mt-4 mb-2">Mission</h3>
                  <p>{item.mission}</p>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-center">No Vision & Mission data available.</p>
        )}
      </div>
    </section>
  );

  const CtaSection: React.FC = () => {
    return (
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
  };

  const FooterSection: React.FC<{ footer: FooterData }> = ({ footer }) => (
    <footer className="py-8 bg-gray-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <div dangerouslySetInnerHTML={{ __html: footer.content }} />
      </div>
    </footer>
  );
