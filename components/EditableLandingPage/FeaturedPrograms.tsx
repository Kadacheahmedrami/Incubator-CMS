'use client';

import React, { useEffect, useState } from 'react';

interface Program {
  id: number;
  title: string;
  landingImage: string;
  description: string;
}

interface FeaturedProgram {
  id: number;
  programId: number;
  landingPageId: number;
  order: number;
  program: Program;
}

const FeaturedProgramsSelector: React.FC = () => {
  const [entries, setEntries] = useState<Program[]>([]);
  const [featuredRecords, setFeaturedRecords] = useState<FeaturedProgram[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchEntries();
    fetchFeaturedRecords();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/main/Programs');
      if (!res.ok) throw new Error('Failed to fetch programs');
      const data = await res.json();
      setEntries(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchFeaturedRecords = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/main/landing/featured-programs');
      if (!res.ok) throw new Error('Failed to fetch featured entries');
      const data = await res.json();
      setFeaturedRecords(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const toggleSelect = (id: number) => {
    const newSet = new Set(selected);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelected(newSet);
  };

  const handleFeatureSelected = async () => {
    const landingPageId = 1;
    if (selected.size === 0) {
      alert("Please select at least one program to feature");
      return;
    }
    try {
      setLoading(true);
      for (const entryId of selected) {
        const res = await fetch('/api/main/landing/featured-programs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            landingPageId,
            programId: entryId,
            order: 0,
          }),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to feature program');
        }
      }
      setSuccessMsg("Selected programs have been featured successfully.");
      setSelected(new Set());
      await fetchFeaturedRecords();
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleUnfeature = async (featuredId: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/main/landing/featured-programs/${featuredId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to unfeature program');
      await fetchFeaturedRecords();
      setSuccessMsg("Program has been unfeatured successfully.");
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const featuredEntryIds = featuredRecords.map((fr) => fr.programId);
  const featuredEntries = entries.filter((entry) => featuredEntryIds.includes(entry.id));
  const nonFeaturedEntries = entries.filter((entry) => !featuredEntryIds.includes(entry.id));

  const getFeaturedRecordId = (entryId: number): number | null => {
    const record = featuredRecords.find((fr) => fr.programId === entryId);
    return record ? record.id : null;
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h2 className="text-3xl font-bold text-center">Manage Featured Programs</h2>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {successMsg && <p className="text-center text-green-500">{successMsg}</p>}

      {/* Featured Entries Section */}
      <section>
        <h3 className="text-2xl font-semibold mb-4">Featured Programs</h3>
        {featuredEntries.length === 0 ? (
          <p>No programs are featured yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredEntries.map((entry) => {
              const featuredId = getFeaturedRecordId(entry.id);
              return (
                <div
                  key={entry.id}
                  className="border rounded p-4 flex flex-col items-center hover:shadow-lg transition"
                >
                  {entry.landingImage && (
                    <img
                      src={entry.landingImage}
                      alt={entry.title}
                      className="w-20 h-20 object-cover rounded mb-2"
                    />
                  )}
                  <h4 className="text-xl font-semibold">{entry.title}</h4>
                  <p className="text-sm text-gray-600">{entry.description}</p>
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

      {/* Non-Featured Entries Section */}
      <section>
        <h3 className="text-2xl font-semibold mb-4">Available Programs</h3>
        {nonFeaturedEntries.length === 0 ? (
          <p>All programs are featured.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nonFeaturedEntries.map((entry) => (
              <div
                key={entry.id}
                className="border rounded p-4 flex items-center space-x-4 hover:shadow-lg transition"
              >
                {entry.landingImage && (
                  <img
                    src={entry.landingImage}
                    alt={entry.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{entry.title}</h3>
                  <p className="text-sm text-gray-600">{entry.description}</p>
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={selected.has(entry.id)}
                    onChange={() => toggleSelect(entry.id)}
                    className="h-5 w-5 text-blue-600"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        {nonFeaturedEntries.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={handleFeatureSelected}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded"
            >
              Feature Selected Programs
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default FeaturedProgramsSelector;
