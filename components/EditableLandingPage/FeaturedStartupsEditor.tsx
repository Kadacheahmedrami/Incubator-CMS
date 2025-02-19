import React from 'react';
import ArraySectionEditor from './ArraySectionEditor';
import type { FeaturedStartupItem } from '@/hooks/useLandingPageData';

interface FeaturedStartupsEditorProps {
  items: FeaturedStartupItem[];
  onSave: (newItems: FeaturedStartupItem[]) => void;
}

const FeaturedStartupsEditor: React.FC<FeaturedStartupsEditorProps> = ({ items, onSave }) => {
  return (
    <ArraySectionEditor<FeaturedStartupItem>
      title="Featured Startups"
      items={items}
      onSave={onSave}
      renderItem={(item, index, editing, onChange) => (
        <>
          <input
            type="number"
            value={item.startupId}
            onChange={(e) => onChange('startupId', Number(e.target.value))}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Startup ID"
          />
          <input
            type="number"
            value={item.order}
            onChange={(e) => onChange('order', Number(e.target.value))}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Order"
          />
        </>
      )}
    />
  );
};

export default FeaturedStartupsEditor;
