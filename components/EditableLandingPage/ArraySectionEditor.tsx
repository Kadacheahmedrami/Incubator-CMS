import React, { useState } from 'react';

interface ArraySectionEditorProps<T> {
  title: string;
  items: T[];
  onSave: (newItems: T[]) => void;
  renderItem: (
    item: T,
    index: number,
    editing: boolean,
    onChange: (field: keyof T, value: any) => void,
    onFileChange: (field: keyof T, file: File) => void
  ) => React.ReactNode;
}

const ArraySectionEditor = <T extends { id?: number; order: number }>({
  title,
  items,
  onSave,
  renderItem,
}: ArraySectionEditorProps<T>) => {
  const [editing, setEditing] = useState(false);
  const [localItems, setLocalItems] = useState<T[]>(items);

  const handleFieldChange = (index: number, field: keyof T, value: any) => {
    const updated = [...localItems];
    updated[index] = { ...updated[index], [field]: value };
    setLocalItems(updated);
  };

  const handleFileChange = async (index: number, field: keyof T, file: File) => {
    // File upload logic is provided by the specific section's renderItem callback.
    handleFieldChange(index, field, file);
  };

  const handleSave = () => {
    onSave(localItems);
    setEditing(false);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {editing ? (
        <div>
          {localItems.map((item, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              {renderItem(
                item,
                index,
                true,
                (field, value) => handleFieldChange(index, field, value),
                (field, file) => handleFileChange(index, field, file)
              )}
            </div>
          ))}
          <div className="flex space-x-2">
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
              Save
            </button>
            <button onClick={() => { setLocalItems(items); setEditing(false); }} className="bg-red-600 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          {items.map((item, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              {renderItem(item, index, false, () => {}, () => {})}
            </div>
          ))}
          <button onClick={() => setEditing(true)} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default ArraySectionEditor;
