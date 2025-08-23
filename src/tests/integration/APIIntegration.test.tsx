import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Page from "../../pages/page";

describe("API Integration Tests", () => {
  // テストのタイムアウトを長く設定（API通信のため）
  vi.setConfig({ testTimeout: 10000 });

  it("fetches and displays prefectures from actual API", async () => {
    render(<Page />);

    // 都道府県一覧がAPIから取得されるまで待機
    await waitFor(
      () => {
        expect(screen.getByText("北海道")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // 複数の都道府県が表示されることを確認
    expect(screen.getByText("青森県")).toBeInTheDocument();
    expect(screen.getByText("岩手県")).toBeInTheDocument();
    expect(screen.getByText("宮城県")).toBeInTheDocument();
  });

  it("fetches population data when prefecture is selected", async () => {
    render(<Page />);

    // 都道府県一覧の読み込みを待機
    await waitFor(
      () => {
        expect(screen.getByText("北海道")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // 北海道を選択
    const hokkaidoCheckbox = screen
      .getByText("北海道")
      .closest(".checkbox-item");
    expect(hokkaidoCheckbox).not.toBeNull();
    fireEvent.click(hokkaidoCheckbox!);

    // 人口データの取得を待機
    await waitFor(
      () => {
        expect(
          screen.getByText("総人口の推移 (1都道府県)")
        ).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // グラフコンテナが表示される
    expect(
      document.querySelector(".recharts-responsive-container")
    ).toBeInTheDocument();
  });

  it("handles complete user flow with real API data", async () => {
    render(<Page />);

    // 初期状態
    expect(screen.getByText("総人口の推移 (0都道府県)")).toBeInTheDocument();
    expect(screen.getByText("都道府県を選択してください")).toBeInTheDocument();

    // 都道府県一覧の読み込みを待機
    await waitFor(
      () => {
        expect(screen.getByText("北海道")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // 北海道を選択
    const hokkaidoCheckbox = screen
      .getByText("北海道")
      .closest(".checkbox-item");
    expect(hokkaidoCheckbox).not.toBeNull();
    fireEvent.click(hokkaidoCheckbox!);

    // 人口データの取得を待機
    await waitFor(
      () => {
        expect(
          screen.getByText("総人口の推移 (1都道府県)")
        ).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // 選択された都道府県が表示される
    expect(screen.getByText("選択された都道府県:")).toBeInTheDocument();

    // 選択リスト内の北海道を確認
    const selectedList = screen
      .getByText("選択された都道府県:")
      .closest(".selected-list");
    expect(selectedList).not.toBeNull();
    expect(
      within(selectedList! as HTMLElement).getByText("北海道")
    ).toBeInTheDocument();

    // 人口種別を切り替え
    const youngPopulationTab = screen.getByText("年少人口");
    fireEvent.click(youngPopulationTab);

    // タイトルが更新される
    await waitFor(
      () => {
        expect(
          screen.getByText("年少人口の推移 (1都道府県)")
        ).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it("handles multiple prefecture selection with real data", async () => {
    render(<Page />);

    // 都道府県一覧の読み込みを待機
    await waitFor(
      () => {
        expect(screen.getByText("北海道")).toBeInTheDocument();
        expect(screen.getByText("青森県")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // 北海道と青森県を選択
    const hokkaidoCheckbox = screen
      .getByText("北海道")
      .closest(".checkbox-item");
    const aomoriCheckbox = screen.getByText("青森県").closest(".checkbox-item");

    expect(hokkaidoCheckbox).not.toBeNull();
    expect(aomoriCheckbox).not.toBeNull();

    fireEvent.click(hokkaidoCheckbox!);
    fireEvent.click(aomoriCheckbox!);

    // 2都道府県が選択された状態
    await waitFor(
      () => {
        expect(
          screen.getByText("総人口の推移 (2都道府県)")
        ).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // 選択リストに両方が表示される
    const selectedList = screen
      .getByText("選択された都道府県:")
      .closest(".selected-list");
    expect(selectedList).not.toBeNull();
    expect(
      within(selectedList! as HTMLElement).getByText("北海道")
    ).toBeInTheDocument();
    expect(
      within(selectedList! as HTMLElement).getByText("青森県")
    ).toBeInTheDocument();
  });

  it("switches between population types with real data", async () => {
    render(<Page />);

    // 都道府県一覧の読み込みを待機
    await waitFor(
      () => {
        expect(screen.getByText("北海道")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // 北海道を選択
    const hokkaidoCheckbox = screen
      .getByText("北海道")
      .closest(".checkbox-item");
    expect(hokkaidoCheckbox).not.toBeNull();
    fireEvent.click(hokkaidoCheckbox!);

    // 人口データの取得を待機
    await waitFor(
      () => {
        expect(
          screen.getByText("総人口の推移 (1都道府県)")
        ).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // 各人口種別に切り替えて確認
    const populationTypes = ["総人口", "年少人口", "老年人口", "生産年齢人口"];

    for (const type of populationTypes) {
      const tab = screen.getByText(type);
      fireEvent.click(tab);

      // タイトルが正しく更新される
      await waitFor(
        () => {
          expect(
            screen.getByText(`${type}の推移 (1都道府県)`)
          ).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    }
  });
});
