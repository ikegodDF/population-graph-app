import "./SwitchingGraphTab.css";

export const SwitchingGraphTab = ({
  titles,
  onChange,
  activeTab,
}: {
  titles: string[];
  onChange: (tab: string) => void;
  activeTab: string;
}) => {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">人口種別を選択</h2>
      <div className="tab-container">
        {titles.map((title) => (
          <button
            key={title}
            onClick={() => onChange(title)}
            className={`tab-button ${activeTab === title ? "active" : ""}`}
          >
            {title}
          </button>
        ))}
      </div>
    </div>
  );
};
