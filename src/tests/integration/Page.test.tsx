import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Page from "../../pages/page";

// 実際のAPIを使用するため、モックは使用しない

describe("Page Integration (Real API)", () => {
  it("renders all main components", async () => {
    render(<Page />);

    // 各セクションが表示される
    expect(screen.getByText("都道府県を選択")).toBeInTheDocument();
    expect(screen.getByText("人口種別を選択")).toBeInTheDocument();
    expect(screen.getByText("総人口の推移 (0都道府県)")).toBeInTheDocument();

    // 都道府県一覧がAPIから取得されるまで待機
    await waitFor(
      () => {
        expect(screen.getByText("北海道")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it("handles complete user flow: select prefecture and change population type", async () => {
    render(<Page />);

    // 初期状態
    expect(screen.getByText("総人口の推移 (0都道府県)")).toBeInTheDocument();
    expect(screen.getByText("都道府県を選択してください")).toBeInTheDocument();

    // 都道府県一覧がAPIから取得されるまで待機
    await waitFor(
      () => {
        expect(screen.getByText("北海道")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // 北海道を選択（チェックボックスコンテナを指定）
    const hokkaidoCheckbox = screen
      .getByText("北海道")
      .closest(".checkbox-item");
    expect(hokkaidoCheckbox).not.toBeNull();
    fireEvent.click(hokkaidoCheckbox!);

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

    // 人口データの取得を待機
    await waitFor(
      () => {
        expect(
          screen.getByText("総人口の推移 (1都道府県)")
        ).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // グラフが表示される
    expect(
      document.querySelector(".recharts-responsive-container")
    ).toBeInTheDocument();

    // 人口種別を年少人口に切り替え
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

  it("handles multiple prefecture selection", async () => {
    render(<Page />);

    // 都道府県一覧がAPIから取得されるまで待機
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

  it("maintains state consistency across components", async () => {
    render(<Page />);

    // 都道府県一覧がAPIから取得されるまで待機
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

    // 人口種別を切り替え
    const youngPopulationTab = screen.getByText("年少人口");
    fireEvent.click(youngPopulationTab);

    // 状態が一貫している
    await waitFor(
      () => {
        expect(
          screen.getByText("年少人口の推移 (1都道府県)")
        ).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
    expect(screen.getByText("選択された都道府県:")).toBeInTheDocument();
    expect(
      document.querySelector(".recharts-responsive-container")
    ).toBeInTheDocument();
  });

  it("handles prefecture deselection", async () => {
    render(<Page />);

    // 都道府県一覧がAPIから取得されるまで待機
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

    // 選択状態を確認
    await waitFor(
      () => {
        expect(
          screen.getByText("総人口の推移 (1都道府県)")
        ).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // 選択を解除
    fireEvent.click(hokkaidoCheckbox!);

    // 空状態に戻る
    expect(screen.getByText("総人口の推移 (0都道府県)")).toBeInTheDocument();
    expect(screen.getByText("都道府県を選択してください")).toBeInTheDocument();
  });

  it("updates graph when switching population types", async () => {
    render(<Page />);

    // 都道府県一覧がAPIから取得されるまで待機
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
