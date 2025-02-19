import React from 'react';
import ArraySectionEditor from './ArraySectionEditor';
import type { FAQItem } from '@/hooks/useLandingPageData';

interface FAQsEditorProps {
  items: FAQItem[];
  onSave: (newItems: FAQItem[]) => void;
}

const FAQsEditor: React.FC<FAQsEditorProps> = ({ items, onSave }) => {
  return (
    <ArraySectionEditor<FAQItem>
      title="FAQs"
      items={items}
      onSave={onSave}
      renderItem={(item, index, editing, onChange) => (
        <>
          <input
            type="text"
            value={item.question}
            onChange={(e) => onChange('question', e.target.value)}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Question"
          />
          <textarea
            value={item.answer}
            onChange={(e) => onChange('answer', e.target.value)}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Answer"
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

export default FAQsEditor;
