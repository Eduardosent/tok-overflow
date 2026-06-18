interface FactoryTabsProps {
  currentTab: 'my-tokens' | 'new';
  onTabChange: (tab: 'my-tokens' | 'new') => void;
}

export function FactoryTabs({ currentTab, onTabChange }: FactoryTabsProps) {
  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-sm border border-primary rounded-md overflow-hidden">
        <button
          onClick={() => onTabChange('my-tokens')}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            currentTab === 'my-tokens' 
              ? 'bg-primary text-white' 
              : 'bg-white text-primary'
          }`}
        >
          My Tokens
        </button>
        <button
          onClick={() => onTabChange('new')}
          className={`flex-1 py-2 text-sm font-medium transition-colors border-l border-primary ${
            currentTab === 'new' 
              ? 'bg-primary text-white' 
              : 'bg-white text-primary'
          }`}
        >
          New
        </button>
      </div>
    </div>
  );
}