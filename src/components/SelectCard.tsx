import { useState } from "react";
import CheckBox from "./CheckBox";
import { usePrefectures } from "../hooks/usePrefectures";

const SelectCard = ({
  onChange,
}: {
  onChange?: (selected: number[]) => void;
}) => {
  // 選択した都道府県を名前とコードの両方で管理
  const [selectedCodes, setSelectedCodes] = useState<number[]>([]);

  // 取得した都道府県データ
  const prefectures = usePrefectures();

  // チェックボックスの選択処理
  const handleSelect = (prefCode: number) => {
    const target = prefectures.find((p) => p.prefCode === prefCode);
    if (!target) return;

    // 怒られる
    setSelectedCodes((prev) => {
      const next = prev.includes(target.prefCode)
        ? prev.filter((c) => c !== target.prefCode)
        : [...prev, target.prefCode];
      onChange?.(next);
      return next;
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 8,
          rowGap: 8,
        }}
      >
        {prefectures.map((prefecture) => (
          <CheckBox
            key={prefecture.prefCode}
            name={prefecture.prefName}
            onSelect={() => handleSelect(prefecture.prefCode)}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {selectedCodes.map((prefCode) => (
          <p key={prefCode}>
            {prefectures.find((p) => p.prefCode === prefCode)?.prefName}
          </p>
        ))}
      </div>
    </div>
  );
};

export default SelectCard;
