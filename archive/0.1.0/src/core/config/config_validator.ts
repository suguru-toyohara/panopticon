/**
 * config/config_validator.ts
 *
 * 目的：
 * 設定値の検証ロジックを提供します。
 * このファイルは設定の検証に関する責務を担当し、ファイルIOや設定管理とは分離されています。
 */

import {
  AgentConfig,
  ApiConfig,
  ConfigTypeMap,
  ConfigTypeString,
  ProgressConfig,
  TimerConfig,
  UiConfig,
} from "./types.ts";

/**
 * 設定検証のインターフェース
 */
export interface ConfigValidator {
  /**
   * 設定値を検証する
   * @param type 設定タイプ
   * @param config 検証する設定（部分的）
   * @returns 検証結果（true: 有効、false: 無効）
   */
  validateConfig<T extends ConfigTypeString>(
    type: T,
    config: Partial<ConfigTypeMap[T]>,
  ): boolean;
}

/**
 * デフォルトの設定検証実装
 */
export class DefaultConfigValidator implements ConfigValidator {
  /**
   * 設定値を検証する
   */
  validateConfig<T extends ConfigTypeString>(
    type: T,
    config: Partial<ConfigTypeMap[T]>,
  ): boolean {
    // 各設定タイプに対する検証ロジック
    switch (type) {
      case "timer":
        return this.validateTimerConfig(config as Partial<TimerConfig>);
      case "ui":
        return this.validateUiConfig(config as Partial<UiConfig>);
      case "agent":
        return this.validateAgentConfig(config as Partial<AgentConfig>);
      case "api":
        return this.validateApiConfig(config as Partial<ApiConfig>);
      case "progress":
        return this.validateProgressConfig(config as Partial<ProgressConfig>);
      default:
        return false;
    }
  }

  /**
   * タイマー設定を検証する
   */
  private validateTimerConfig(config: Partial<TimerConfig>): boolean {
    // 値の型と範囲の検証
    // TODO : 一旦今はこれで良いけど、ちゃんと範囲は決めよう。 DurationMinutesは120m以下にするとかね。今はやらないけど。
    if (
      "workDurationMinutes" in config &&
      (typeof config.workDurationMinutes !== "number" ||
        config.workDurationMinutes <= 0)
    ) return false;
    if (
      "restDurationMinutes" in config &&
      (typeof config.restDurationMinutes !== "number" ||
        config.restDurationMinutes <= 0)
    ) return false;
    if (
      "longRestDurationMinutes" in config &&
      (typeof config.longRestDurationMinutes !== "number" ||
        config.longRestDurationMinutes <= 0)
    ) return false;
    if (
      "longRestIntervalCycle" in config &&
      (typeof config.longRestIntervalCycle !== "number" ||
        config.longRestIntervalCycle <= 0)
    ) return false;

    return true;
  }

  /**
   * UI設定を検証する
   */
  private validateUiConfig(config: Partial<UiConfig>): boolean {
    // 値の型と範囲の検証
    if ("language" in config) {
      if (typeof config.language !== "string") return false; //これは冗長かも？
      if (!["ja", "en"].includes(config.language)) return false;
    }

    return true;
  }

  /**
   * エージェント設定を検証する
   */
  private validateAgentConfig(config: Partial<AgentConfig>): boolean {
    // 値の型と範囲の検証
    if ("personality" in config && typeof config.personality !== "string") {
      return false;
    }

    if ("encouragementFrequency" in config) {
      if (typeof config.encouragementFrequency !== "string") return false; //これも冗長かも
      if (!["low", "medium", "high"].includes(config.encouragementFrequency)) {
        return false;
      }
    }

    return true;
  }

  /**
   * API設定を検証する
   */
  private validateApiConfig(config: Partial<ApiConfig>): boolean {
    // openRouterApiKeyはオプショナル
    // FIXME: これだとDefaultがすでにバリデーション違反になってしまうから修正してほしい。
    // というかAPIconfigって現状いらないかも。実装しなくていいよ。
    if (
      "openRouterApiKey" in config && config.openRouterApiKey !== undefined &&
      typeof config.openRouterApiKey !== "string"
    ) {
      return false;
    }

    return true;
  }

  /**
   * 進捗管理設定を検証する
   */
  private validateProgressConfig(config: Partial<ProgressConfig>): boolean {
    // 値の型と範囲の検証
    if (
      "pointsPerHour" in config &&
      (typeof config.pointsPerHour !== "number" || config.pointsPerHour <= 0)
    ) return false;
    if (
      "showPredictions" in config && typeof config.showPredictions !== "boolean"
    ) return false;

    return true;
  }
}
