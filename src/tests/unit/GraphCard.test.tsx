import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import GraphCard from "../../components/GraphCard/GraphCard";

// usePrefecturesフックをモック
vi.mock("../../hooks/usePrefectures", () => ({
  usePrefectures: () => [
    { prefCode: 1, prefName: "北海道" },
    { prefCode: 2, prefName: "青森県" },
    { prefCode: 3, prefName: "岩手県" },
  ],
}));

// usePopulationフックをモック
vi.mock("../../hooks/usePopulation", () => ({
  usePopulation: () => ({
    1: {
      総人口: [
        { year: 2020, value: 1000000 },
        { year: 2021, value: 990000 },
        { year: 2022, value: 980000 },
      ],
      年少人口: [
        { year: 2020, value: 150000 },
        { year: 2021, value: 148000 },
        { year: 2022, value: 146000 },
      ],
      老年人口: [
        { year: 2020, value: 200000 },
        { year: 2021, value: 205000 },
        { year: 2022, value: 210000 },
      ],
    },
    2: {
      総人口: [
        { year: 2020, value: 500000 },
        { year: 2021, value: 495000 },
        { year: 2022, value: 490000 },
      ],
      年少人口: [
        { year: 2020, value: 75000 },
        { year: 2021, value: 74000 },
        { year: 2022, value: 73000 },
      ],
    },
  }),
}));

describe("GraphCard", () => {
  it("renders section title with active tab and prefecture count", () => {
    render(<GraphCard selected={[1, 2]} activeTab="総人口" />);

    // タイトルが正しく表示される
    expect(screen.getByText("総人口の推移 (2都道府県)")).toBeInTheDocument();
  });

  it("displays empty state when no prefectures are selected", () => {
    render(<GraphCard selected={[]} activeTab="総人口" />);

    // 空状態のメッセージが表示される
    expect(screen.getByText("都道府県を選択してください")).toBeInTheDocument();

    // グラフコンテナは表示されない
    expect(
      document.querySelector(".recharts-responsive-container")
    ).not.toBeInTheDocument();
  });

  it("renders chart container when prefectures are selected", () => {
    render(<GraphCard selected={[1, 2]} activeTab="総人口" />);

    // グラフコンテナが表示される
    expect(
      document.querySelector(".recharts-responsive-container")
    ).toBeInTheDocument();
  });

  it("updates title when active tab changes", () => {
    const { rerender } = render(
      <GraphCard selected={[1]} activeTab="総人口" />
    );

    // 総人口のタイトル
    expect(screen.getByText("総人口の推移 (1都道府県)")).toBeInTheDocument();

    // 年少人口に切り替え
    rerender(<GraphCard selected={[1]} activeTab="年少人口" />);
    expect(screen.getByText("年少人口の推移 (1都道府県)")).toBeInTheDocument();

    // 老年人口に切り替え
    rerender(<GraphCard selected={[1]} activeTab="老年人口" />);
    expect(screen.getByText("老年人口の推移 (1都道府県)")).toBeInTheDocument();
  });

  it("updates title when selected prefectures change", () => {
    const { rerender } = render(
      <GraphCard selected={[1]} activeTab="総人口" />
    );

    // 1都道府県選択
    expect(screen.getByText("総人口の推移 (1都道府県)")).toBeInTheDocument();

    // 2都道府県選択
    rerender(<GraphCard selected={[1, 2]} activeTab="総人口" />);
    expect(screen.getByText("総人口の推移 (2都道府県)")).toBeInTheDocument();

    // 3都道府県選択
    rerender(<GraphCard selected={[1, 2, 3]} activeTab="総人口" />);
    expect(screen.getByText("総人口の推移 (3都道府県)")).toBeInTheDocument();
  });

  it("handles single prefecture selection", () => {
    render(<GraphCard selected={[1]} activeTab="総人口" />);

    // 1都道府県選択時の表示
    expect(screen.getByText("総人口の推移 (1都道府県)")).toBeInTheDocument();
    expect(
      document.querySelector(".recharts-responsive-container")
    ).toBeInTheDocument();
  });

  it("handles multiple prefecture selection", () => {
    render(<GraphCard selected={[1, 2, 3]} activeTab="総人口" />);

    // 複数都道府県選択時の表示
    expect(screen.getByText("総人口の推移 (3都道府県)")).toBeInTheDocument();
    expect(
      document.querySelector(".recharts-responsive-container")
    ).toBeInTheDocument();
  });

  it("renders with different population types", () => {
    const { rerender } = render(
      <GraphCard selected={[1]} activeTab="年少人口" />
    );

    // 年少人口のタイトル
    expect(screen.getByText("年少人口の推移 (1都道府県)")).toBeInTheDocument();

    // 老年人口に切り替え
    rerender(<GraphCard selected={[1]} activeTab="老年人口" />);
    expect(screen.getByText("老年人口の推移 (1都道府県)")).toBeInTheDocument();
  });

  it("maintains chart container when switching between population types", () => {
    const { rerender } = render(
      <GraphCard selected={[1, 2]} activeTab="総人口" />
    );

    // グラフコンテナが表示される
    expect(
      document.querySelector(".recharts-responsive-container")
    ).toBeInTheDocument();

    // 人口種別を切り替えてもグラフコンテナは表示され続ける
    rerender(<GraphCard selected={[1, 2]} activeTab="年少人口" />);
    expect(
      document.querySelector(".recharts-responsive-container")
    ).toBeInTheDocument();

    rerender(<GraphCard selected={[1, 2]} activeTab="老年人口" />);
    expect(
      document.querySelector(".recharts-responsive-container")
    ).toBeInTheDocument();
  });
});
