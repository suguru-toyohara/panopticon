/**
 * config/file_config.ts
 *
 * 目的：
 * ファイルベースの設定管理実装を提供します。
 * このクラスは主にファイルIOの責務を担当し、設定の検証は別のクラスに委譲します。
 */

import { dirname, join } from "jsr:@std/path";
import { console } from "../logger.ts";
import { ConfigManager } from "./interface.ts";
import { ConfigData, ConfigTypeMap, ConfigTypeString } from "./types.ts";
import { DEFAULT_CONFIG } from "./constants.ts";
import { ConfigValidator, DefaultConfigValidator } from "./config_validator.ts";
import { mergeConfig } from "./utils.ts";

/**
 * ファイルベースの設定管理実装
 * 主にファイルIOの責務を担当します
 */
export class FileConfigManager implements ConfigManager {
  private configData: ConfigData;
  private configPath: string;
  private configValidator: ConfigValidator;

  constructor(configPath?: string) {
    // ディープコピーを使用して初期設定を複製
    this.configData = structuredClone(DEFAULT_CONFIG);

    // 設定ファイルのパスを決定
    if (configPath) {
      this.configPath = configPath;
    } else {
      const homeDir = Deno.env.get("HOME");
      if (!homeDir) {
        throw new Error("HOME環境変数が設定されていません");
      }
      this.configPath = join(homeDir, ".config", "panopticon", "config.json");
    }

    // 設定バリデータを設定
    this.configValidator = new DefaultConfigValidator();
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
        // 不明なエラー時
        console.error(
          `設定ファイルの確認中にエラーが発生しました: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        throw error;
      }

      // 設定ファイルを読み込む
      const rawConfigString = await Deno.readTextFile(this.configPath);
      let loadedData: Partial<ConfigData> | undefined;

      try {
        loadedData = JSON.parse(rawConfigString) as Partial<ConfigData>;
      } catch (error) {
        console.error(
          `設定ファイルのJSONパースに失敗しました: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        console.warn("JSONパースエラーによりデフォルト設定を使用します。");
        // パース失敗時はloadedDataはundefinedのまま
        loadedData = undefined;
      }

      // 読み込んだ設定をデフォルト設定とマージ
      if (loadedData) {
        this.configData = mergeConfig(DEFAULT_CONFIG, loadedData);
      } else {
        // パース失敗時はデフォルト設定を使用
        this.configData = structuredClone(DEFAULT_CONFIG);
      }

      console.debug("設定反映完了");
    } catch (error) {
      // 全体の処理で何かあった時
      console.error(
        `設定の読み込みに失敗しました: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      throw error; // 不明なエラーで死ぬ場合はちゃんと落とす
    }
  }

  /**
   * 設定を保存する
   */
  async save(): Promise<void> {
    try {
      // 設定ファイルのディレクトリパスを取得
      const configDir = dirname(this.configPath);

      try {
        await Deno.stat(configDir);
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
          console.debug(`設定ディレクトリを作成します: ${configDir}`);
          await Deno.mkdir(configDir, { recursive: true });
        } else {
          console.error(
            `設定ディレクトリの確認中にエラーが発生しました: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
          throw error;
        }
      }

      const serializedConfig = JSON.stringify(this.configData, null, 2);

      // 設定をJSONとして保存
      try {
        await Deno.writeTextFile(
          this.configPath,
          serializedConfig,
        );
      } catch (error) {
        console.error(
          `設定の書き込み時にエラーが発生しました。: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        console.error(`設定lostを防ぐため、configを出力します。`);
        console.error(serializedConfig);
        throw error;
      }

      console.debug(`設定を保存しました: ${this.configPath}`);
    } catch (error) {
      // 不明なエラーで落ちた場合
      console.error(
        `設定の保存に失敗しました: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      throw new Error(
        `設定の保存に失敗しました: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * 特定のタイプの設定を取得する
   */
  getConfig<T extends ConfigTypeString>(type: T): ConfigTypeMap[T] {
    return this.configData[type as keyof ConfigData] as ConfigTypeMap[T];
  }

  /**
   * 特定のタイプの設定を更新する
   */
  async updateConfig<T extends ConfigTypeString>(
    type: T,
    config: Partial<ConfigTypeMap[T]>,
  ): Promise<void> {
    // 設定値の検証を委譲
    if (!this.configValidator.validateConfig(type, config)) {
      throw new Error(`無効な設定値です: ${type}`);
    }

    // 現在の設定と新しい設定をマージ
    const currentConfig = this.getConfig(type);
    const updatedConfig = mergeConfig(currentConfig, config);

    // 設定を更新
    this.configData[type] = updatedConfig;
    
    // 設定を保存
    await this.save();
  }

  /**
   * すべての設定を取得する
   */
  async getAllConfigs(): Promise<ConfigData> {
    // 現在のメモリ内の設定を返す
    return await Promise.resolve(structuredClone(this.configData));
  }
}
