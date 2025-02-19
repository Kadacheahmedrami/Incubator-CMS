import React from 'react';
import ArraySectionEditor from './ArraySectionEditor';
import type { PartnerItem } from '@/hooks/useLandingPageData';

interface PartnersEditorProps {
  items: PartnerItem[];
  onSave: (newItems: PartnerItem[]) => void;
}

const PartnersEditor: React.FC<PartnersEditorProps> = ({ items, onSave }) => {
  return (
    <ArraySectionEditor<PartnerItem>
      title="Partners"
      items={items}
      onSave={onSave}
      renderItem={(item, index, editing, onChange, onFileChange) => (
        <>
          <input
            type="text"
            value={item.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Partner Name"
          />
          <input
            type="text"
            value={item.url || ''}
            onChange={(e) => onChange('url', e.target.value)}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Partner URL"
          />
          <div className="mb-2">
            {item.logo && (
              <img src={item.logo} alt="Partner Logo" width={200} height={120} className="object-cover mb-2" />
            )}
            {editing && (
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileChange('logo', file);
              }} />
            )}
          </div>
        </>
      )}
    />
  );
};

export default PartnersEditor;
