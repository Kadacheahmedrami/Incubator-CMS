"use client";

import FeaturedHistoryAndValuesSelector from '@/components/EditableLandingPage/FeturedHistoryAndValues';
import FeaturedEventsSelector from '@/components/EditableLandingPage/FeaturedEvents';
import FeaturedNewsSelector from '@/components/EditableLandingPage/FeaturedNews';
import FeaturedProgramsSelector from '@/components/EditableLandingPage/FeaturedPrograms';

export default function Page() {
  return (
    <>
        <div className="space-y-12 py-8">
      <div>
        <FeaturedHistoryAndValuesSelector />
      </div>
      <div>
        <FeaturedEventsSelector />
      </div>
      <div>
        <FeaturedNewsSelector />
      </div>
      <div>
        <FeaturedProgramsSelector />
      </div>
    </div>
    </>

  );
}