import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { usePopulation } from "../../hooks/usePopulation";
import { usePrefectures } from "../../hooks/usePrefectures";
import "./GraphCard.css";

type GraphProps = { selected?: number[]; activeTab?: string };

const GraphCard = ({ selected = [], activeTab = "総人口" }: GraphProps) => {
  const prefectures = usePrefectures();
  const codeToName = useMemo(() => {
    const map = new Map<number, string>();
    prefectures.forEach((p) => map.set(p.prefCode, p.prefName));
    return map;
  }, [prefectures]);

  const populationByPref = usePopulation(selected);

  const years = useMemo(() => {
    const set = new Set<number>();
    for (const code of selected) {
      const s = populationByPref[code]?.[activeTab] ?? [];
      s.forEach((pt) => set.add(pt.year));
    }
    return Array.from(set).sort((a, b) => a - b);
  }, [selected, activeTab, populationByPref]);

  const chartData = useMemo(() => {
    return years.map((year) => {
      const row: Record<string, number | string> = { year };
      for (const code of selected) {
        const label = codeToName.get(code) ?? String(code);
        const pt = (populationByPref[code]?.[activeTab] ?? []).find(
          (p) => p.year === year
        );
        row[label] = pt?.value ?? 0;
      }
      return row;
    });
  }, [years, selected, activeTab, populationByPref, codeToName]);

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7f50",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
    "#8884d8",
  ];

  const lineLabels = selected.map(
    (code) => codeToName.get(code) ?? String(code)
  );

  return (
    <div className="card graph-container">
      <h2 className="text-xl font-semibold mb-4">
        {activeTab}の推移 ({selected.length}都道府県)
      </h2>
      {selected.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">都道府県を選択してください</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 16, right: 24, left: 72, bottom: 16 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis
              width={64}
              tickFormatter={(v) =>
                new Intl.NumberFormat("ja-JP", { notation: "compact" }).format(
                  v as number
                )
              }
              tickLine={false}
            />
            <Tooltip />
            <Legend />
            {lineLabels.map((label, idx) => (
              <Line
                key={label}
                type="monotone"
                dataKey={label}
                stroke={COLORS[idx % COLORS.length]}
                dot={true}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GraphCard;
