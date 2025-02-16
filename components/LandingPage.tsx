"use client"
import type React from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface LandingPageData {
  landingImage?: string
  title?: string
  description?: string
}

interface LandingPageProps {
  data: LandingPageData
}

export const LandingPage: React.FC<LandingPageProps> = ({ data }) => {
  const imageUrl = data.landingImage || "/placeholder.svg"
  const title = data.title || "Innovate. Incubate. Accelerate."
  const description = data.description || "Empowering the next generation of startups."

  return (
    <main className="font-sans text-gray-900">
      <HeroSection imageUrl={imageUrl} title={title} description={description} />
      <FeaturesSection />
      <CtaSection />
    </main>
  )
}

interface HeroSectionProps {
  imageUrl: string
  title: string
  description: string
}

const HeroSection: React.FC<HeroSectionProps> = ({ imageUrl, title, description }) => {
  return (
    <section className="relative h-screen flex items-center justify-center">
      <Image src={imageUrl || "/placeholder.svg"} alt="Hero background" layout="fill" objectFit="cover"   unoptimized />
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="relative z-10 text-center text-white px-4">
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xl md:text-2xl mb-8"
        >
          {description}
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg"
        >
          Get Started
        </motion.button>
      </div>
    </section>
  )
}

const FeaturesSection: React.FC = () => {
  const features = [
    { title: "Expert Mentorship", description: "Learn from industry leaders" },
    { title: "Funding Opportunities", description: "Access to investor networks" },
    { title: "State-of-the-art Facilities", description: "Work in a modern environment" },
    { title: "Global Network", description: "Connect with partners worldwide" },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Incubator?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  title: string
  description: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

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
  )
}

