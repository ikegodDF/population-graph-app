import { useState } from "react";
import "./CheckBox.css";

interface CheckBoxProps {
  name: string;
  onSelect: () => void;
}

const CheckBox = ({ name, onSelect }: CheckBoxProps) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
    onSelect();
  };

  return (
    <div
      className={`checkbox-item ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => {}} // Controlled by parent
        readOnly
      />
      <span>{name}</span>
    </div>
  );
};

export default CheckBox;
