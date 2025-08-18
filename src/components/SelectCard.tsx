import { useState } from "react";
import CheckBox from "./CheckBox";
import { usePrefectures } from "../hooks/usePrefectures";

const SelectCard = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const prefectures = usePrefectures();

  const handleSelect = (name: string) => {
    if (selected.includes(name)) {
      setSelected(selected.filter((item) => item !== name));
    } else {
      setSelected([...selected, name]);
    }
  };

  return (
    <div>
      {prefectures.map((prefecture) => (
        <CheckBox
          key={prefecture.prefCode}
          name={prefecture.prefName}
          onSelect={handleSelect}
        />
      ))}
      <div className="flex flex-col gap-2">
        {selected.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
};

export default SelectCard;
