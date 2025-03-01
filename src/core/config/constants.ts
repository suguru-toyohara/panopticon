/**
 * config/constants.ts
 *
 * 目的：
 * 設定関連の定数を提供します。
 */

import { ConfigData } from "./types.ts";

/**
 * デフォルト設定
 */
export const DEFAULT_CONFIG: ConfigData = {
  timer: {
    configType: "timer",
    workDurationMinutes: 25,
    restDurationMinutes: 5,
    longRestDurationMinutes: 30,
    longRestIntervalCycle: 4,
  },
  ui: {
    configType: "ui",
    language: "ja",
  },
  agent: {
    configType: "agent",
    personality: "friendly",
    encouragementFrequency: "medium",
  },
  api: {
    configType: "api",
  },
  progress: {
    configType: "progress",
    pointsPerHour: 2,
    showPredictions: true,
  },
};
