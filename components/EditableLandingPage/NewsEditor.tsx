import React from 'react';
import ArraySectionEditor from './ArraySectionEditor';
import type { NewsItem } from '@/hooks/useLandingPageData';

interface NewsEditorProps {
  items: NewsItem[];
  onSave: (newItems: NewsItem[]) => void;
}

const NewsEditor: React.FC<NewsEditorProps> = ({ items, onSave }) => {
  return (
    <ArraySectionEditor<NewsItem>
      title="News"
      items={items}
      onSave={onSave}
      renderItem={(item, index, editing, onChange, onFileChange) => (
        <>
          <input
            type="text"
            value={item.title}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Title"
          />
          <textarea
            value={item.description}
            onChange={(e) => onChange('description', e.target.value)}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Description"
          />
          <input
            type="number"
            value={item.order}
            onChange={(e) => onChange('order', Number(e.target.value))}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Order"
          />
          <div className="mb-2">
            {item.landingImage && (
              <img src={item.landingImage} alt="News Image" width={200} height={120} className="object-cover mb-2" />
            )}
            {editing && (
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileChange('landingImage', file);
              }} />
            )}
          </div>
        </>
      )}
    />
  );
};

export default NewsEditor;
