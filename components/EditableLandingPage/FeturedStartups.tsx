'use client';

import React, { useEffect, useState } from 'react';

interface Startup {
  id: number;
  name: string;
  idea?: string;
  imageUrl?: string;
  createdAt: string;
}

interface FeaturedStartup {
  id: number;
  startupId: number;
  landingPageId: number;
  order: number;
}

const FeaturedStartupSelector: React.FC = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [featuredRecords, setFeaturedRecords] = useState<FeaturedStartup[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch all startups
  const fetchStartups = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/main/startups');
      if (!res.ok) throw new Error('Failed to fetch startups');
      const data = await res.json();
      setStartups(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Fetch featured startup join records
  const fetchFeaturedRecords = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/main/landing/featured-startups');
      if (!res.ok) throw new Error('Failed to fetch featured startups');
      const data = await res.json();
      setFeaturedRecords(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
    fetchFeaturedRecords();
  }, []);

  // Toggle selection for non-featured startups
  const toggleSelect = (id: number) => {
    const newSet = new Set(selected);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelected(newSet);
  };

  // Handle featuring selected startups
  const handleFeatureSelected = async () => {
    const landingPageId = 1; // adjust this value as needed
    if (selected.size === 0) {
      alert("Please select at least one startup to feature");
      return;
    }
    try {
      setLoading(true);
      for (const startupId of selected) {
        const res = await fetch('/api/main/landing/featured-startups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            landingPageId,
            startupId,
            order: 0, // default order; adjust if needed
          }),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to feature startup');
        }
      }
      setSuccessMsg("Selected startups have been featured successfully.");
      setSelected(new Set());
      await fetchFeaturedRecords();
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle unfeaturing a startup
  const handleUnfeature = async (featuredId: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/main/landing/featured-startups/${featuredId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to unfeature startup');
      await fetchFeaturedRecords();
      setSuccessMsg("Startup has been unfeatured successfully.");
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Create sets for featured and non-featured startups
  const featuredStartupIds = featuredRecords.map((fr) => fr.startupId);
  const featuredStartups = startups.filter((s) =>
    featuredStartupIds.includes(s.id)
  );
  const nonFeaturedStartups = startups.filter(
    (s) => !featuredStartupIds.includes(s.id)
  );

  // Helper to get the join record id for a featured startup
  const getFeaturedRecordId = (startupId: number): number | null => {
    const record = featuredRecords.find((fr) => fr.startupId === startupId);
    return record ? record.id : null;
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h2 className="text-3xl font-bold text-center">Manage Featured Startups</h2>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {successMsg && <p className="text-center text-green-500">{successMsg}</p>}

      {/* Featured Startups Section */}
      <section>
        <h3 className="text-2xl font-semibold mb-4">Featured Startups</h3>
        {featuredStartups.length === 0 ? (
          <p>No featured startups yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredStartups.map((startup) => {
              const featuredId = getFeaturedRecordId(startup.id);
              return (
                <div
                  key={startup.id}
                  className="border rounded p-4 flex flex-col items-center hover:shadow-lg transition"
                >
                  {startup.imageUrl && (
                    <img
                      src={startup.imageUrl}
                      alt={startup.name}
                      className="w-20 h-20 object-cover rounded mb-2"
                    />
                  )}
                  <h4 className="text-xl font-semibold">{startup.name}</h4>
                  <p className="text-sm text-gray-600">{startup.idea}</p>
                  <button
                    onClick={() => {
                      if (featuredId !== null) handleUnfeature(featuredId);
                    }}
                    className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Unfeature
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Non-Featured Startups Section */}
      <section>
        <h3 className="text-2xl font-semibold mb-4">Non-Featured Startups</h3>
        {nonFeaturedStartups.length === 0 ? (
          <p>All startups are featured.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nonFeaturedStartups.map((startup) => (
              <div
                key={startup.id}
                className="border rounded p-4 flex items-center space-x-4 hover:shadow-lg transition"
              >
                {startup.imageUrl && (
                  <img
                    src={startup.imageUrl}
                    alt={startup.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{startup.name}</h3>
                  <p className="text-sm text-gray-600">{startup.idea}</p>
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={selected.has(startup.id)}
                    onChange={() => toggleSelect(startup.id)}
                    className="h-5 w-5 text-blue-600"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        {nonFeaturedStartups.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={handleFeatureSelected}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded"
            >
              Feature Selected Startups
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default FeaturedStartupSelector;
