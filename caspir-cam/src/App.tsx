import React from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { DownloadSection } from './components/DownloadSection';
import { Footer } from './components/Footer';
import './styles.css';
export function App() {
  return <div className="min-h-screen bg-gradient-to-br from-[var(--gradient-start)] via-[var(--gradient-middle)] to-[var(--gradient-end)]">
      <Header />
      <main className="w-full">
        <HeroSection />
        <FeaturesSection />
        <DownloadSection />
      </main>
      <Footer />
    </div>;
}