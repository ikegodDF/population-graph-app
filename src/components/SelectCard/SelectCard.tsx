import { useState } from "react";
import CheckBox from "../CheckBox/CheckBox";
import { usePrefectures } from "../../hooks/usePrefectures";
import "./SelectCard.css";

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

    setSelectedCodes((prev) => {
      const next = prev.includes(target.prefCode)
        ? prev.filter((c) => c !== target.prefCode)
        : [...prev, target.prefCode];
      onChange?.(next);
      return next;
    });
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">都道府県を選択</h2>
      <div className="checkbox-container">
        {prefectures.map((prefecture) => (
          <CheckBox
            key={prefecture.prefCode}
            name={prefecture.prefName}
            onSelect={() => handleSelect(prefecture.prefCode)}
          />
        ))}
      </div>
      {selectedCodes.length > 0 && (
        <div className="selected-list">
          <h3 className="text-sm font-medium mb-2">選択された都道府県:</h3>
          <div>
            {selectedCodes.map((prefCode) => (
              <span key={prefCode} className="selected-item">
                {prefectures.find((p) => p.prefCode === prefCode)?.prefName}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectCard;
