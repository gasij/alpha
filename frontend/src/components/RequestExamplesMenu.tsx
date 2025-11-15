import React, { useState } from 'react';
import { Category } from '../types';

interface RequestExamplesMenuProps {
  categories: Category[];
  selectedCategory: string;
  onExampleClick: (example: string) => void;
}

interface ExampleRequest {
  category: string;
  examples: string[];
}

const requestExamples: ExampleRequest[] = [
  {
    category: 'general',
    examples: [
      'Как начать свой бизнес?',
      'Какие документы нужны для регистрации ИП?',
      'Как составить бизнес-план?',
      'Какие налоги платит малый бизнес?',
    ],
  },
  {
    category: 'marketing',
    examples: [
      'Как продвигать бизнес в социальных сетях?',
      'Составь план маркетинговой кампании',
      'Как увеличить продажи?',
      'Какие каналы рекламы эффективны для малого бизнеса?',
    ],
  },
  {
    category: 'legal',
    examples: [
      'Какие права есть у предпринимателя?',
      'Как составить договор с клиентом?',
      'Какие документы нужны для найма сотрудников?',
      'Как защитить интеллектуальную собственность?',
    ],
  },
  {
    category: 'finance',
    examples: [
      'Как вести учет доходов и расходов?',
      'Какие налоги нужно платить?',
      'Как составить финансовый план?',
      'Как получить кредит для бизнеса?',
    ],
  },
  {
    category: 'documents',
    examples: [
      'Помоги составить договор оказания услуг',
      'Как оформить трудовой договор?',
      'Нужен шаблон коммерческого предложения',
      'Как составить акт выполненных работ?',
    ],
  },
];

const RequestExamplesMenu: React.FC<RequestExamplesMenuProps> = ({
  categories,
  selectedCategory,
  onExampleClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentCategory = categories.find((c) => c.id === selectedCategory);
  const examples = requestExamples.find((e) => e.category === selectedCategory)?.examples || [];

  if (examples.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-4 py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 text-foreground hover:bg-primary/5 hover:text-primary border-l-4 border-transparent hover:border-primary/30 animate-scale-in bg-white"
      >
        <span className="relative z-10 flex items-center justify-between">
          <span>Примеры запросов</span>
          <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </span>
      </button>

      {isOpen && (
        <div className="mt-2 bg-white rounded-lg border border-border shadow-lg p-2 animate-fade-in">
          <div className="text-xs text-muted-foreground mb-2 px-2 font-medium">
            {currentCategory?.name}
          </div>
          <ul className="flex flex-col gap-1">
            {examples.map((example, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    onExampleClick(example);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-all duration-200 text-xs sm:text-sm"
                >
                  {example}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RequestExamplesMenu;

