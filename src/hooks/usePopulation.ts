import { useEffect, useState } from "react";

// 人口データの型
export interface PopulationPoint {
  year: number;
  value: number;
}

// 選択した都道府県ごとの人口データ
export type PopulationSeries = Record<string, PopulationPoint[]>;

// 選択した都道府県ごとの人口データまとめ
export type PopulationSeriesMap = Record<number, PopulationSeries>;

export const usePopulation = (prefCodes: number[]) => {
  const [populationByPrefCode, setPopulationByPrefCode] =
    useState<PopulationSeriesMap>({});

  useEffect(() => {
    let aborted = false;

    const fetchPopulation = async () => {
      if (!prefCodes || prefCodes.length === 0) {
        setPopulationByPrefCode({});
        return;
      }

      const requests = prefCodes.map(async (prefCode) => {
        const url = new URL(
          "https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/population/composition/perYear"
        );
        url.searchParams.append("prefCode", prefCode.toString());
        const res = await fetch(url.toString(), {
          headers: {
            "X-API-KEY": import.meta.env.VITE_RESAS_API_KEY || "",
          },
        });
        const json = await res.json();
        const series: PopulationSeries = {};
        json.result.data.map(
          (type: { label: string; data: PopulationPoint[] }) => {
            series[type.label] = type.data;
          }
        );
        return [prefCode, series] as const;
      });

      const entries = await Promise.all(requests);
      if (aborted) return;

      const map: PopulationSeriesMap = {};
      for (const [code, series] of entries) {
        map[code] = series;
      }
      setPopulationByPrefCode(map);
      console.log(map);
    };

    fetchPopulation();

    return () => {
      aborted = true;
    };
  }, [prefCodes]);

  return populationByPrefCode;
};
