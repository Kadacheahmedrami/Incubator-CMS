// components/LandingPage.tsx
import React from 'react';

async function getLandingPage() {
 const res = await fetch('http://localhost:3000/api/main/landing', {
    // Disable caching to always fetch fresh data
    cache: 'no-cache',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch landing page content');
  }
  return res.json();
}

const LandingPage = async () => {
  const landingPage = await getLandingPage();
  console.log('Landing Page Data:', landingPage); // Debugging log

  const imageUrl = landingPage.landingImage || 'https://source.unsplash.com/1600x900/?nature,landscape';
  const title = landingPage.title || 'Welcome to Our Platform';
  const description =
    landingPage.description || 'Discover amazing content and services tailored just for you.';

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', color: '#333' }}>
      <div
        style={{
          backgroundImage: `url("${imageUrl}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '4rem 1rem',
          color: '#fff',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h1 style={{ fontSize: '3rem', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
          {title}
        </h1>
      </div>
      <section style={{ maxWidth: '800px', margin: '2rem auto', lineHeight: '1.6' }}>
        <p style={{ fontSize: '1.25rem' }}>{description}</p>
      </section>
    </main>
  );
};

export default LandingPage;
