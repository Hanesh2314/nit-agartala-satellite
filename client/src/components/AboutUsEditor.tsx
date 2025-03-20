import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { AboutUsEditorProps } from '@/types';

export default function AboutUsEditor({ content, onSave }: AboutUsEditorProps) {
  const [editedContent, setEditedContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate a delay before calling onSave
    setTimeout(() => {
      onSave(editedContent);
      setIsSaving(false);
    }, 500);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">About Us Content</label>
        <Textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          rows={8}
          className="bg-gray-800/50 border-gray-700 resize-none"
          placeholder="Enter content for About Us section..."
        />
        <p className="mt-2 text-xs text-gray-500">
          This content will be displayed in the About Us section of the website.
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving || !editedContent.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </div>
  );
}
