/**
 * config.ts
 *
 * 目的：
 * パノプティコンアプリケーションの設定管理を担当するモジュールです。
 * ユーザー設定の読み込み、保存、アクセスの機能を提供し、アプリケーション全体で一貫した設定を維持します。
 *
 * 主な機能：
 * - 設定ファイルの読み込みと保存
 * - デフォルト設定の提供
 * - 設定値の型安全なアクセス
 * - 設定変更の検証
 */

import { console } from "./logger.ts";

/**
 * アプリケーション設定のインターフェース
 */
export interface ConfigData {
  // タイマー関連の設定
  timer: {
    workDuration: number; // 作業時間（分）
    restDuration: number; // 休憩時間（分）
    longRestDuration: number; // 長い休憩時間（分）
    longRestInterval: number; // 長い休憩までのサイクル数
  };

  // UI関連の設定
  ui: {
    language: string; // 言語設定（"ja"または"en"）
  };

  // エージェント関連の設定
  agent: {
    personality: string; // エージェントの人格
    encouragementFrequency: "low" | "medium" | "high"; // 励ましの頻度
  };

  // API設定
  api: {
    openRouterApiKey?: string; // OpenRouter API Key
  };

  // 進捗管理関連の設定
  progress: {
    pointsPerHour: number; // 1時間あたりのポイント数（デフォルト値）
    // これって、推論結果によって変わっていく想定かな？
    showPredictions: boolean;
  };
}

/**
 * 設定管理クラスのデフォルト設定
 */
const DEFAULT_CONFIG: ConfigData = {
  timer: {
    workDuration: 25, // 仕事サイクル時間:25分
    restDuration: 5, // 休憩サイクル時間:5分
    longRestDuration: 30, // 長い休憩サイクル時間:30分
    longRestInterval: 4, // 4サイクルごとに長い休憩
  },
  ui: {
    language: "ja",
  },
  agent: {
    personality: "friendly",
    encouragementFrequency: "medium",
  },
  api: {}, //つまり初期設定ではundefになることを前提に書くべき
  progress: {
    pointsPerHour: 2, // 1時間あたり2ポイント
    showPredictions: true,
  },
};

/**
 * 設定管理クラス
 */
export class Config {
  private configData: ConfigData;
  private configPath: string;

  constructor(configPath?: string) {
    this.configData = { ...DEFAULT_CONFIG };
    this.configPath = configPath ||
      `${Deno.env.get("HOME")}/.config/panopticon/config.json`;
  }

  /**
   * 設定を読み込む
   */
  async load(): Promise<void> {
    try {
      // 設定ファイルが存在するか確認
      try {
        await Deno.stat(this.configPath);
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
          // 設定ファイルが存在しない場合は、デフォルト設定を保存
          await this.save();
          return;
        }
        throw error;
      }

      // 設定ファイルを読み込む
      const rawConfigString = await Deno.readTextFile(this.configPath);
      const loadedData = JSON.parse(rawConfigString) as Partial<ConfigData>;

      // 読み込んだ設定をデフォルト設定とマージ
      this.configData = this.mergeConfig(DEFAULT_CONFIG, loadedData);
    } catch (error) {
      console.error("設定の読み込みに失敗しました:", error);
      // エラーが発生した場合はデフォルト設定を使用
      this.configData = { ...DEFAULT_CONFIG };
    }
  }

  /**
   * 設定を保存する
   */
  async save(): Promise<void> {
    try {
      // 設定ディレクトリが存在するか確認し、存在しない場合は作成
      const configDir = this.configPath.substring(
        0,
        this.configPath.lastIndexOf("/"),
      );
      try {
        await Deno.stat(configDir);
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
          await Deno.mkdir(configDir, { recursive: true });
        } else {
          throw error;
        }
      }

      // 設定をJSONとして保存
      await Deno.writeTextFile(
        this.configPath,
        JSON.stringify(this.configData, null, 2),
      );
    } catch (error) {
      console.error("設定の保存に失敗しました:", error);
      // TODO : 今後エラー表示やconsole表示、TUIを作る時に特別な関数を使うようになるはず。
    }
  }

  /**
   * 設定値を取得する
   */
  get<K extends keyof ConfigData>(key: K): ConfigData[K] {
    return this.configData[key];
  }

  /**
   * 設定値を更新する
   *
   * TODO : 更新時validationだったり何かしらロジックを挟みそうだね。
   */
  async update<K extends keyof ConfigData>(
    key: K,
    value: ConfigData[K],
  ): Promise<void> {
    this.configData[key] = value;
    await this.save();
  }

  /**
   * 設定をマージする（再帰的）
   */
  private mergeConfig<T extends Record<string, any>>(
    defaultConfig: T,
    userConfig: Partial<T>,
  ): T {
    const result = { ...defaultConfig };

    for (const key in userConfig) {
      if (
        typeof userConfig[key] === "object" &&
        userConfig[key] !== null &&
        typeof defaultConfig[key] === "object" &&
        defaultConfig[key] !== null
      ) {
        // オブジェクトの場合は再帰的にマージ
        result[key] = this.mergeConfig(defaultConfig[key], userConfig[key]);
      } else if (userConfig[key] !== undefined) {
        // プリミティブ値の場合は上書き
        result[key] = userConfig[key];
      }
    }

    return result;
  }
}
