import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SwitchingGraphTab } from "../../components/SwitchingGraphTab/SwitchingGraphTab";

describe("SwitchingGraphTab", () => {
  const defaultTitles = ["総人口", "年少人口", "老年人口", "生産年齢人口"];

  it("renders all tab titles", () => {
    const mockOnChange = vi.fn();
    render(
      <SwitchingGraphTab
        titles={defaultTitles}
        onChange={mockOnChange}
        activeTab="総人口"
      />
    );

    // 全てのタブタイトルが表示されているか
    expect(screen.getByText("総人口")).toBeInTheDocument();
    expect(screen.getByText("年少人口")).toBeInTheDocument();
    expect(screen.getByText("老年人口")).toBeInTheDocument();
    expect(screen.getByText("生産年齢人口")).toBeInTheDocument();
  });

  it("renders section title correctly", () => {
    const mockOnChange = vi.fn();
    render(
      <SwitchingGraphTab
        titles={defaultTitles}
        onChange={mockOnChange}
        activeTab="総人口"
      />
    );

    // セクションタイトルが表示される
    expect(screen.getByText("人口種別を選択")).toBeInTheDocument();
  });

  it("calls onChange when tab is clicked", () => {
    const mockOnChange = vi.fn();
    render(
      <SwitchingGraphTab
        titles={defaultTitles}
        onChange={mockOnChange}
        activeTab="総人口"
      />
    );

    // クリック前はコールバックが呼ばれていない
    expect(mockOnChange).not.toHaveBeenCalled();

    // 年少人口タブをクリック
    const youngPopulationTab = screen.getByText("年少人口");
    fireEvent.click(youngPopulationTab);
    expect(mockOnChange).toHaveBeenCalledWith("年少人口");
  });

  it("handles multiple tab clicks", () => {
    const mockOnChange = vi.fn();
    render(
      <SwitchingGraphTab
        titles={defaultTitles}
        onChange={mockOnChange}
        activeTab="総人口"
      />
    );

    // 複数のタブをクリック
    fireEvent.click(screen.getByText("総人口"));
    fireEvent.click(screen.getByText("老年人口"));
    fireEvent.click(screen.getByText("生産年齢人口"));

    // 各クリックでonChangeが呼ばれる
    expect(mockOnChange).toHaveBeenCalledTimes(3);
    expect(mockOnChange).toHaveBeenNthCalledWith(1, "総人口");
    expect(mockOnChange).toHaveBeenNthCalledWith(2, "老年人口");
    expect(mockOnChange).toHaveBeenNthCalledWith(3, "生産年齢人口");
  });

  it("applies active class to current tab", () => {
    const mockOnChange = vi.fn();
    render(
      <SwitchingGraphTab
        titles={defaultTitles}
        onChange={mockOnChange}
        activeTab="老年人口"
      />
    );

    // アクティブなタブにactiveクラスが適用される
    const activeTab = screen.getByText("老年人口");
    expect(activeTab).toHaveClass("active");

    // 非アクティブなタブにはactiveクラスが適用されない
    const inactiveTab = screen.getByText("総人口");
    expect(inactiveTab).not.toHaveClass("active");
  });

  it("handles empty titles array", () => {
    const mockOnChange = vi.fn();
    render(
      <SwitchingGraphTab titles={[]} onChange={mockOnChange} activeTab="" />
    );

    // タブが表示されない
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("handles single title", () => {
    const mockOnChange = vi.fn();
    render(
      <SwitchingGraphTab
        titles={["総人口"]}
        onChange={mockOnChange}
        activeTab="総人口"
      />
    );

    // 1つのタブのみが表示される
    expect(screen.getByText("総人口")).toBeInTheDocument();
    expect(screen.queryByText("年少人口")).not.toBeInTheDocument();
  });
});
