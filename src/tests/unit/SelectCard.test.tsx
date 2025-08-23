import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SelectCard from "../../components/SelectCard/SelectCard";

// 表示する都道府県のモックデータ
vi.mock("../../hooks/usePrefectures", () => ({
  usePrefectures: () => [
    { prefCode: 1, prefName: "北海道" },
    { prefCode: 2, prefName: "青森県" },
    { prefCode: 3, prefName: "岩手県" },
    { prefCode: 4, prefName: "宮城県" },
  ],
}));

describe("SelectCard", () => {
  it("renders prefecture checkboxes", () => {
    render(<SelectCard onChange={vi.fn()} />);

    // 都道府県名が表示されているか
    expect(screen.getByText("北海道")).toBeInTheDocument();
    expect(screen.getByText("青森県")).toBeInTheDocument();
    expect(screen.getByText("岩手県")).toBeInTheDocument();
    expect(screen.getByText("宮城県")).toBeInTheDocument();
  });

  it("calls onChange when checkbox is clicked", () => {
    const mockOnChange = vi.fn();
    render(<SelectCard onChange={mockOnChange} />);

    // クリック前はコールバックが呼ばれていない
    expect(mockOnChange).not.toHaveBeenCalled();

    // 北海道をクリック
    const hokkaidoCheckbox = screen
      .getByText("北海道")
      .closest(".checkbox-item");
    expect(hokkaidoCheckbox).not.toBeNull();
    fireEvent.click(hokkaidoCheckbox!);
    expect(mockOnChange).toHaveBeenCalledWith([1]);

    // 青森県をクリック
    const aomoriCheckbox = screen.getByText("青森県").closest(".checkbox-item");
    expect(aomoriCheckbox).not.toBeNull();
    fireEvent.click(aomoriCheckbox!);
    expect(mockOnChange).toHaveBeenCalledWith([1, 2]);
  });

  it("handles multiple selections and deselections", () => {
    const mockOnChange = vi.fn();
    render(<SelectCard onChange={mockOnChange} />);

    // 複数の都道府県を選択
    const hokkaidoCheckbox = screen
      .getByText("北海道")
      .closest(".checkbox-item");
    const aomoriCheckbox = screen.getByText("青森県").closest(".checkbox-item");
    const iwateCheckbox = screen.getByText("岩手県").closest(".checkbox-item");

    expect(hokkaidoCheckbox).not.toBeNull();
    expect(aomoriCheckbox).not.toBeNull();
    expect(iwateCheckbox).not.toBeNull();

    fireEvent.click(hokkaidoCheckbox!);
    fireEvent.click(aomoriCheckbox!);
    fireEvent.click(iwateCheckbox!);

    // 3つ選択された状態
    expect(mockOnChange).toHaveBeenLastCalledWith([1, 2, 3]);

    // 青森県の選択を解除
    fireEvent.click(aomoriCheckbox!);
    expect(mockOnChange).toHaveBeenLastCalledWith([1, 3]);
  });

  it("displays selected prefectures list", () => {
    const mockOnChange = vi.fn();
    render(<SelectCard onChange={mockOnChange} />);

    // 初期状態では選択された都道府県リストが表示されない
    expect(screen.queryByText("選択された都道府県:")).not.toBeInTheDocument();

    // 北海道を選択
    const hokkaidoCheckbox = screen
      .getByText("北海道")
      .closest(".checkbox-item");
    expect(hokkaidoCheckbox).not.toBeNull();
    fireEvent.click(hokkaidoCheckbox!);

    // 選択された都道府県リストが表示される
    expect(screen.getByText("選択された都道府県:")).toBeInTheDocument();

    // 選択リスト内の北海道を確認
    const selectedList = screen
      .getByText("選択された都道府県:")
      .closest(".selected-list");
    expect(selectedList).not.toBeNull();
    expect(
      within(selectedList! as HTMLElement).getByText("北海道")
    ).toBeInTheDocument();

    // 青森県も選択
    const aomoriCheckbox = screen.getByText("青森県").closest(".checkbox-item");
    expect(aomoriCheckbox).not.toBeNull();
    fireEvent.click(aomoriCheckbox!);
    expect(
      within(selectedList! as HTMLElement).getByText("青森県")
    ).toBeInTheDocument();
  });

  it("handles empty selection correctly", () => {
    const mockOnChange = vi.fn();
    render(<SelectCard onChange={mockOnChange} />);

    // 初期状態
    expect(mockOnChange).not.toHaveBeenCalled();

    // 選択してから解除
    const hokkaidoCheckbox = screen
      .getByText("北海道")
      .closest(".checkbox-item");
    expect(hokkaidoCheckbox).not.toBeNull();
    fireEvent.click(hokkaidoCheckbox!);
    fireEvent.click(hokkaidoCheckbox!);

    // 空の配列が渡される
    expect(mockOnChange).toHaveBeenLastCalledWith([]);
  });

  it("renders section title correctly", () => {
    render(<SelectCard onChange={vi.fn()} />);

    // セクションタイトルが表示される
    expect(screen.getByText("都道府県を選択")).toBeInTheDocument();
  });
});
