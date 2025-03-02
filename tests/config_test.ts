/**
 * config_test.ts
 *
 * 目的：
 * 設定管理モジュールの機能をテストします。
 *
 * テスト内容：
 * - 設定の読み込み/保存機能
 * - エラーケースの処理
 */

import { assertEquals, assertRejects } from "jsr:@std/assert";
import { assertSpyCalls, spy } from "jsr:@std/testing/mock";
import { join } from "jsr:@std/path";
import { FileConfigManager } from "../src/core/config/file_config.ts";
import { DEFAULT_CONFIG } from "../src/core/config/constants.ts";
import { mergeConfig } from "../src/core/config/utils.ts";

// テスト用のヘルパー関数
async function withTempDir(fn: (tempDir: string) => Promise<void>) {
  // テスト用の一時ディレクトリを作成
  const tempDir = await Deno.makeTempDir({ prefix: "config_test_" });
  try {
    // テスト関数を実行
    await fn(tempDir);
  } finally {
    // テスト終了後に一時ディレクトリを削除
    await Deno.remove(tempDir, { recursive: true });
  }
}

// マージ機能のテスト
Deno.test("FileConfigManager - 設定のマージ機能", async () => {
    // FIXME : ここに必要な処理を入れる。
    // 基本的なマージテスト
    const target = { a: 1, b: 2 };
    const source = { b: 3};
    const result = mergeConfig(target, source);
    assertEquals(result, { a: 1, b: 3});

    // ネストされたオブジェクトのマージテスト
    const targetNested = { a: 1, b: { x: 1, y: 2 },c: 1 };
    const sourceNested = { b: { y: 3, x: 4 }, c: 5 };
    const resultNested = mergeConfig(targetNested, sourceNested);
    assertEquals(resultNested, { a: 1, b: { x: 4, y: 3 }, c: 5 });

    // 配列のマージテスト（上書き）
    const targetArray = { a: 1, b: [1, 2, 3] };
    const sourceArray = { b: [4, 5] };
    const resultArray = mergeConfig(targetArray, sourceArray);
    assertEquals(resultArray, { a: 1, b: [4, 5] });

    // undefinedのスキップテスト
    const targetUndef = { a: 1, b: 2 };
    const sourceUndef = { a: undefined };
    const resultUndef = mergeConfig(targetUndef, sourceUndef);
    assertEquals(resultUndef, { a: 1, b: 2});
});

// 設定の読み込み/保存のテスト
Deno.test("FileConfigManager - 設定の読み込みと保存", async () => {
  await withTempDir(async (tempDir) => {
    // テスト用の設定ファイルパス
    const configPath = join(tempDir, "config.json");

    // FileConfigManagerのインスタンスを作成
    const configManager = new FileConfigManager(configPath);

    // 初期設定を保存
    await configManager.save();

    // 設定ファイルが作成されたことを確認
    const fileInfo = await Deno.stat(configPath);
    assertEquals(fileInfo.isFile, true);

    // 設定ファイルの内容を確認
    const fileContent = await Deno.readTextFile(configPath);
    const savedConfig = JSON.parse(fileContent);
    assertEquals(savedConfig, DEFAULT_CONFIG);

    // 設定を読み込み //mergeが必要なのでここは考慮しなくて良い。
    await configManager.load();

    // 設定が正しく読み込まれたことを確認
    const timerConfig = configManager.getConfig("timer");
    assertEquals(timerConfig, DEFAULT_CONFIG.timer);

    // 設定を更新
    const updatedTimerConfig = {
      workDurationMinutes: 30,
      restDurationMinutes: 10,
    };
    await configManager.updateConfig("timer", updatedTimerConfig);

    // 更新された設定を確認
    const updatedConfig = configManager.getConfig("timer");
    assertEquals(updatedConfig.workDurationMinutes, 30);
    assertEquals(updatedConfig.restDurationMinutes, 10);

    // 設定ファイルが更新されたことを確認
    const updatedFileContent = await Deno.readTextFile(configPath);
    const updatedSavedConfig = JSON.parse(updatedFileContent);
    assertEquals(updatedSavedConfig.timer.workDurationMinutes, 30);
    assertEquals(updatedSavedConfig.timer.restDurationMinutes, 10);

    // getAllConfigsのテスト
    const allConfigs = await configManager.getAllConfigs();
    assertEquals(allConfigs.timer.workDurationMinutes, 30);
    assertEquals(allConfigs.timer.restDurationMinutes, 10);
  });
});

// 設定ファイルが存在しない場合のテスト
Deno.test("FileConfigManager - 設定ファイルが存在しない場合", async () => {
  await withTempDir(async (tempDir) => {
    // 存在しない設定ファイルパス
    const configPath = join(tempDir, "non_existent", "config.json");

    // FileConfigManagerのインスタンスを作成
    const configManager = new FileConfigManager(configPath);

    // 設定を読み込み（デフォルト設定が使用される）
    await configManager.load();

    // 設定ファイルが作成されたことを確認
    const fileInfo = await Deno.stat(configPath);
    assertEquals(fileInfo.isFile, true);

    // 設定ファイルの内容を確認
    const fileContent = await Deno.readTextFile(configPath);
    const savedConfig = JSON.parse(fileContent);
    assertEquals(savedConfig, DEFAULT_CONFIG);
  });
});

// 無効な設定値のテスト
Deno.test("FileConfigManager - 無効な設定値", async () => {
  await withTempDir(async (tempDir) => {
    // テスト用の設定ファイルパス
    const configPath = join(tempDir, "config.json");

    // FileConfigManagerのインスタンスを作成
    const configManager = new FileConfigManager(configPath);

    // 無効なタイマー設定（負の値）
    const invalidTimerConfig = {
      workDurationMinutes: -10,
    };

    // 無効な設定の更新は失敗するはず
    await assertRejects(
      async () => {
        await configManager.updateConfig("timer", invalidTimerConfig);
      },
      Error,
      "無効な設定値です",
    );

    // // 無効なUI設定（サポートされていない言語）
    // TODO : これは型ベースですでに入らないようになるからなんかvalidateするのもおかしくないかなー
    // const invalidUiConfig = {
    //   language: "fr",
    // };

    // // 無効な設定の更新は失敗するはず
    // await assertRejects(
    //   async () => {
    //     await configManager.updateConfig("ui", invalidUiConfig);
    //   },
    //   Error,
    //   "無効な設定値です"
    // );
  });
});

// 破損した設定ファイルのテスト
Deno.test("FileConfigManager - 破損した設定ファイル", async () => {
  await withTempDir(async (tempDir) => {
    // テスト用の設定ファイルパス
    const configPath = join(tempDir, "config.json");

    // 破損した設定ファイルを作成
    await Deno.writeTextFile(configPath, "{ this is not valid JSON }");

    // コンソールエラーをスパイ
    const consoleSpy = spy(console, "error");
    const consoleWarnSpy = spy(console, "warn");

    try {
      // FileConfigManagerのインスタンスを作成
      const configManager = new FileConfigManager(configPath);

      // 設定を読み込み（デフォルト設定が使用される）
      await configManager.load();

      // エラーと警告が出力されたことを確認
      assertSpyCalls(consoleSpy, 1);
      assertSpyCalls(consoleWarnSpy, 1);

      // デフォルト設定が使用されたことを確認
      const timerConfig = configManager.getConfig("timer");
      assertEquals(timerConfig, DEFAULT_CONFIG.timer);

      // 設定ファイルが修復されたことを確認
      const fileContent = await Deno.readTextFile(configPath);
      const savedConfig = JSON.parse(fileContent);
      assertEquals(savedConfig, DEFAULT_CONFIG);
    } finally {
      // スパイを復元
      consoleSpy.restore();
      consoleWarnSpy.restore();
    }
  });
});
