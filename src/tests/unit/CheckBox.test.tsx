import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CheckBox from "../../components/CheckBox/CheckBox";

describe("CheckBox", () => {
  it("renders checkbox with correct name", () => {
    render(<CheckBox name="北海道" onSelect={vi.fn()} />);

    // 都道府県名が表示されているか
    expect(screen.getByText("北海道")).toBeInTheDocument();

    // チェックボックスが存在するか
    const container = screen.getByText("北海道").parentElement;
    const checkbox = container?.querySelector('input[type="checkbox"]');
    expect(checkbox).toBeInTheDocument();
  });

  it("calls onSelect when clicked", () => {
    const mockOnSelect = vi.fn();
    render(<CheckBox name="青森県" onSelect={mockOnSelect} />);

    // クリック前はコールバックが呼ばれていない
    expect(mockOnSelect).not.toHaveBeenCalled();

    // クリックしてコールバックが呼ばれるか
    fireEvent.click(screen.getByText("青森県"));
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it("toggles selected state when clicked", () => {
    render(<CheckBox name="岩手県" onSelect={vi.fn()} />);

    const container = screen.getByText("岩手県").parentElement;
    const checkbox = container?.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;

    // 初期状態は未選択
    expect(checkbox).not.toBeChecked();
    expect(container).not.toHaveClass("selected");

    // クリックして選択状態になる
    fireEvent.click(screen.getByText("岩手県"));
    expect(checkbox).toBeChecked();
    expect(container).toHaveClass("selected");

    // 再度クリックして未選択状態になる
    fireEvent.click(screen.getByText("岩手県"));
    expect(checkbox).not.toBeChecked();
    expect(container).not.toHaveClass("selected");
  });

  it("handles multiple clicks correctly", () => {
    const mockOnSelect = vi.fn();
    render(<CheckBox name="宮城県" onSelect={mockOnSelect} />);

    // 複数回クリックしても正しく動作
    fireEvent.click(screen.getByText("宮城県"));
    fireEvent.click(screen.getByText("宮城県"));
    fireEvent.click(screen.getByText("宮城県"));

    // onSelectは毎回呼ばれる
    expect(mockOnSelect).toHaveBeenCalledTimes(3);

    // 最終的な状態は正しい
    const container = screen.getByText("宮城県").parentElement;
    const checkbox = container?.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    expect(checkbox).toBeChecked(); // 奇数回クリックなので選択状態
  });
});
