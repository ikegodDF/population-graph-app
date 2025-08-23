import "@testing-library/jest-dom";
import { vi, beforeAll, afterAll, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// グローバルクリーンアップ
afterEach(() => {
  cleanup();
  // DOMを完全にクリア
  document.body.innerHTML = "";
});

// グローバルなモック設定
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// 実際のfetchを使用（APIテスト用）
// global.fetch = vi.fn(); // APIテスト時はコメントアウト

// console.errorを抑制（テスト中の警告を減らす）
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is no longer supported")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
