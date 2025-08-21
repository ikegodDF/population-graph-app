export const SwitchingGraphTab = ({
  titles,
  onChange,
}: {
  titles: string[];
  onChange: (tab: string) => void;
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        {titles.map((title) => (
          <button
            key={title}
            onClick={() => {
              console.log(title);
              onChange(title);
            }}
            className="flex flex-col"
          >
            {title}
          </button>
        ))}
      </div>
    </div>
  );
};
