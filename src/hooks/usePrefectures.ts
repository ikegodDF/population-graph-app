import { useEffect, useState } from "react";

interface Prefecture {
  prefCode: number;
  prefName: string;
}

export const usePrefectures = () => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);

  useEffect(() => {
    fetch(
      "https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures",
      {
        headers: {
          "X-API-KEY": import.meta.env.VITE_RESAS_API_KEY || "",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setPrefectures(data.result);
      });
  }, []);

  return prefectures;
};
