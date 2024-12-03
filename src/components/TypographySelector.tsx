import React from 'react';
import { X } from 'lucide-react';

interface TypographySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (font: string) => void;
}

const fonts = [
  { name: 'Montserrat', class: 'font-montserrat' },
  { name: 'Merriweather', class: 'font-merriweather' },
  { name: 'Inter', class: 'font-inter' },
  { name: 'Bebas Neue', class: 'font-bebas' },
  { name: 'Libre Baskerville', class: 'font-baskerville' }
];

const TypographySelector: React.FC<TypographySelectorProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Select Typography</h3>
          <button onClick={onClose} className="p-1 hover:bg-zinc-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          {fonts.map((font) => (
            <button
              key={font.name}
              onClick={() => {
                onSelect(font.class);
                onClose();
              }}
              className={`w-full px-4 py-3 text-left rounded-lg hover:bg-zinc-800 transition-colors ${font.class}`}
            >
              <span className="text-lg">The quick brown fox jumps over the lazy dog</span>
              <p className="text-sm text-zinc-400 mt-1">{font.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypographySelector;