import React, { useState } from 'react';
import type { FooterData } from '@/hooks/useLandingPageData';

interface FooterEditorProps {
  footer: FooterData;
  onSave: (newFooter: FooterData) => void;
}

const FooterEditor: React.FC<FooterEditorProps> = ({ footer, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [localFooter, setLocalFooter] = useState<FooterData>(footer);

  const handleSave = () => {
    onSave(localFooter);
    setEditing(false);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Footer</h2>
      {editing ? (
        <div className="p-4 border rounded">
          <textarea
            value={localFooter.content}
            onChange={(e) => setLocalFooter({ ...localFooter, content: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Footer Content"
          />
          <div className="flex space-x-2 mt-2">
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
              Save
            </button>
            <button onClick={() => { setLocalFooter(footer); setEditing(false); }} className="bg-red-600 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 border rounded">
          <div dangerouslySetInnerHTML={{ __html: footer.content }} />
          <button onClick={() => setEditing(true)} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default FooterEditor;
