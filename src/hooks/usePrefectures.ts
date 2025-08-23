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
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.result) {
          setPrefectures(data.result);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch prefectures:", error);
        // エラー時は空配列を設定して、アプリが続行できるようにする
        setPrefectures([]);
      });
  }, []);

  return prefectures;
};
