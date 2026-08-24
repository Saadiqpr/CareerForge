import { useId, useState, type KeyboardEvent } from "react";

type Tab = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type AccessibleTabsProps = {
  tabs: Tab[];
};

export default function AccessibleTabs({ tabs }: AccessibleTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const baseId = useId();

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setActiveTab((current) => (current + 1) % tabs.length);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setActiveTab((current) => (current - 1 + tabs.length) % tabs.length);
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActiveTab(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      setActiveTab(tabs.length - 1);
    }
  };

  if (tabs.length === 0) {
    return null;
  }

  const active = tabs[activeTab];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Content sections"
        className="flex gap-2 border-b"
      >
        {tabs.map((tab, index) => {
          const tabId = `${baseId}-tab-${tab.id}`;
          const panelId = `${baseId}-panel-${tab.id}`;
          const selected = index === activeTab;

          return (
            <button
              key={tab.id}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveTab(index)}
              onKeyDown={handleKeyDown}
              className="px-4 py-2"
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id={`${baseId}-panel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active.id}`}
        tabIndex={0}
        className="p-4"
      >
        {active.content}
      </div>
    </div>
  );
}