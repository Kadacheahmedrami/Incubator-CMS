import React from 'react';
import ArraySectionEditor from './ArraySectionEditor';
import type { VisionAndMissionItem } from '@/hooks/useLandingPageData';

interface VisionAndMissionEditorProps {
  items: VisionAndMissionItem[];
  onSave: (newItems: VisionAndMissionItem[]) => void;
}

const VisionAndMissionEditor: React.FC<VisionAndMissionEditorProps> = ({ items, onSave }) => {
  return (
    <ArraySectionEditor<VisionAndMissionItem>
      title="Vision & Mission"
      items={items}
      onSave={onSave}
      renderItem={(item, index, editing, onChange) => (
        <>
          <textarea
            value={item.vision}
            onChange={(e) => onChange('vision', e.target.value)}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Vision"
          />
          <textarea
            value={item.mission}
            onChange={(e) => onChange('mission', e.target.value)}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Mission"
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

export default VisionAndMissionEditor;
