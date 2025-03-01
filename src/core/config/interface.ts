/**
 * config/interface.ts
 *
 * 目的：
 * 設定管理のインターフェース定義を提供します。
 */

import { ConfigData, ConfigTypeMap, ConfigTypeString } from "./types.ts";

/**
 * 設定管理のインターフェース
 *
 * 注: ConfigDataインターフェースのFIXMEコメントについて
 * ConfigManagerはこのファイルで定義されています。ConfigDataは設定データの型を表し、
 * ConfigManagerはその設定データを管理するためのインターフェースです。
 * 両者は異なる役割を持っています。
 */
export interface ConfigManager {
  /**
   * 設定を読み込む
   *
   * TODO : voidじゃなくて何かしらハンドリングできるように型をつけたいね。
   */
  load(): Promise<void>;

  /**
   * 設定を保存する
   */
  save(): Promise<void>;

  /**
   * 特定のタイプの設定を取得する
   * @param type 設定タイプ
   * @returns 指定されたタイプの設定
   */
  getConfig<T extends ConfigTypeString>(type: T): ConfigTypeMap[T];

  /**
   * 特定のタイプの設定を更新する
   * @param type 設定タイプ
   * @param config 更新する設定（部分的）
   */
  updateConfig<T extends ConfigTypeString>(
    type: T,
    config: Partial<ConfigTypeMap[T]>,
  ): Promise<void>;

  /**
   * すべての設定を取得する
   * @returns すべての設定
   *
   * fileを読む場合Promiseが必要なので一旦Promiseにします。
   */
  getAllConfigs(): Promise<ConfigData>;
}
