import React from 'react';
import { PromptCard, PromptCategory } from '../../types/aiTypes';

interface Props {
  categories: PromptCategory[];
  cards: PromptCard[];
  onSelect: (prompt: string) => void;
}

export const AIPromptLibrary: React.FC<Props> = ({ categories, cards, onSelect }) => {
  return (
    <div className="space-y-5 pb-4">
      <div className="px-1">
        <h3 className="text-sm font-bold text-[#161616] tracking-tight">What you can ask</h3>
        <p className="text-xs text-[#525252] mt-0.5">Click any prompt to ask your project AI assistant</p>
      </div>

      {categories.map(category => {
        const categoryCards = cards.filter(c => c.category === category.id);
        if (categoryCards.length === 0) return null;

        return (
          <div key={category.id} className="space-y-2">
            <div className="flex items-center gap-1.5 px-1">
              <span className="text-sm">{category.icon}</span>
              <span className="text-xs font-mono font-bold text-[#161616] uppercase tracking-wider">{category.label}</span>
            </div>
            <div className="space-y-1.5">
              {categoryCards.map(card => (
                <button
                  key={card.id}
                  onClick={() => onSelect(card.prompt)}
                  className="w-full text-left rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 hover:border-[#FF6039] hover:shadow-[0_2px_8px_rgba(255,96,57,0.08)] transition-all group"
                >
                  <p className="text-sm font-bold text-[#161616] group-hover:text-[#FF6039] transition-colors">
                    {card.title}
                  </p>
                  <p className="text-xs text-[#525252] mt-0.5 leading-relaxed font-normal">
                    {card.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
