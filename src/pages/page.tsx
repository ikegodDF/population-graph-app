import { useState } from "react";
import SelectCard from "../components/SelectCard/SelectCard";
import GraphCard from "../components/GraphCard/GraphCard";
import { SwitchingGraphTab } from "../components/SwitchingGraphTab/SwitchingGraphTab";

const Page = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<string>("総人口");

  return (
    <div className="container">
      <SelectCard onChange={setSelected} />
      <SwitchingGraphTab
        titles={["総人口", "年少人口", "老年人口", "生産年齢人口"]}
        onChange={setActiveTab}
        activeTab={activeTab}
      />
      <GraphCard selected={selected} activeTab={activeTab} />
    </div>
  );
};

export default Page;
