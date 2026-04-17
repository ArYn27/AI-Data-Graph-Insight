import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Features from '../components/Features';
import Workflow from '../components/Workflow';
import TechStack from '../components/TechStack';
import Footer from '../components/Footer';

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Workflow />
        <TechStack />
      </main>
      <Footer />
    </>
  );
}

export default Home;
