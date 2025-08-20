import { useState } from "react";
import SelectCard from "../components/SelectCard";
import GraphCard from "../components/GraphCard";

const Page = () => {
  const [selected, setSelected] = useState<number[]>([]);

  return (
    <div>
      <SelectCard onChange={setSelected} />
      <GraphCard selected={selected} />
    </div>
  );
};

export default Page;
