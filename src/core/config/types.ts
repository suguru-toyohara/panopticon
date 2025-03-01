/**
 * config/types.ts
 *
 * 目的：
 * 設定関連の型定義を提供します。
 */

/**
 * 基本設定インターフェース
 * すべての設定タイプの基底インターフェース
 */
export interface BaseConfig {
  readonly configType: string; // 設定タイプを識別するための文字列
}

/**
 * タイマー設定
 */
export interface TimerConfig extends BaseConfig {
  readonly configType: "timer";
  workDurationMinutes: number; // 作業時間（分）
  restDurationMinutes: number; // 休憩時間（分）
  longRestDurationMinutes: number; // 長い休憩時間（分）
  longRestIntervalCycle: number; // 長い休憩までのサイクル数
}

/**
 * UI設定
 */
export interface UiConfig extends BaseConfig {
  readonly configType: "ui";
  language: "ja" | "en"; //日本語と英語に対応以外はとりあえずは考えなくていいかな。
}

/**
 * エージェント設定
 */
export interface AgentConfig extends BaseConfig {
  readonly configType: "agent";
  personality: string; // エージェントの人格 //TODO : これも別で型が必要かも。 一旦stringで良い。
  encouragementFrequency: "low" | "medium" | "high"; // 励ましの頻度
}

/**
 * API設定
 */
export interface ApiConfig extends BaseConfig {
  readonly configType: "api";
  openRouterApiKey?: string; // OpenRouter API Key
  // TODO : APIのBackendを選択できるようにしたい。いつかOpenRouterだけでなくAnthropic/OpenAI/Bedrockも対応したい。
}

/**
 * 進捗管理設定
 *
 * TODO : pointsPerHourはいわゆるETA計算時に使う係数でしかないので、
 * "進捗管理設定"とは違うかもね。
 */
export interface ProgressConfig extends BaseConfig {
  readonly configType: "progress";
  pointsPerHour: number; // 1時間あたりのポイント数（デフォルト値）
  showPredictions: boolean;
}

/**
 * 設定タイプのユニオン型
 */
export type ConfigType =
  | TimerConfig
  | UiConfig
  | AgentConfig
  | ApiConfig
  | ProgressConfig;

/**
 * 設定タイプのリテラル型
 */
export type ConfigTypeString = ConfigType["configType"];

/**
 * 設定タイプのマップ型（型安全なルックアップのため）
 */
export interface ConfigTypeMap {
  "timer": TimerConfig;
  "ui": UiConfig;
  "agent": AgentConfig;
  "api": ApiConfig;
  "progress": ProgressConfig;
}

/**
 * 設定データの完全な型
 *
 * FIXME : あれ、こうするんだっけ結局。 interface ConfigManagerはどこいった？
 */
export interface ConfigData {
  timer: TimerConfig;
  ui: UiConfig;
  agent: AgentConfig;
  api: ApiConfig;
  progress: ProgressConfig;
}
