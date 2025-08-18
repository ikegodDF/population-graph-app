import { useState } from "react";

const CheckBox = ({
  name,
  onSelect,
}: {
  name: string;
  onSelect: (name: string) => void;
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = () => {
    setIsChecked(!isChecked);
    onSelect(name);
  };

  return (
    <div>
      <input type="checkbox" checked={isChecked} onChange={handleChange} />
      <label>{name}</label>
    </div>
  );
};

export default CheckBox;
