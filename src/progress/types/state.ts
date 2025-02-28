/**
 * progress/types/state.ts
 *
 * 目的：
 * イベントソーシングパターンにおけるアプリケーション状態の型定義を提供します。
 * イベントを適用した結果として構築される状態の型を定義し、
 * アプリケーション全体の一貫した状態管理を可能にします。
 *
 * 主な型定義：
 * - アプリケーション状態（AppState）
 * - プロジェクト状態（ProjectState）
 * - マイルストーン状態（MilestoneState）
 * - タスク状態（TaskState）
 */

import {
  MilestoneInfo,
  ProjectInfo,
  Relations,
  Statistics,
  TaskInfo,
} from "./models.ts";

/**
 * タスク状態
 */
export interface TaskState {
  tasks: Record<string, TaskInfo>; // タスクID -> タスク情報のマッピング
  taskHistory: Record<
    string,
    Array<{ timestamp: string; description: string }>
  >; // タスクID -> 履歴のマッピング
}

/**
 * マイルストーン状態
 */
export interface MilestoneState {
  milestones: Record<string, MilestoneInfo>; // マイルストーンID -> マイルストーン情報のマッピング
  milestoneHistory: Record<
    string,
    Array<{ timestamp: string; description: string }>
  >; // マイルストーンID -> 履歴のマッピング
}

/**
 * プロジェクト状態
 */
export interface ProjectState {
  projects: Record<string, ProjectInfo>; // プロジェクトID -> プロジェクト情報のマッピング
  projectHistory: Record<
    string,
    Array<{ timestamp: string; description: string }>
  >; // プロジェクトID -> 履歴のマッピング
}

/**
 * 関係状態
 */
export interface RelationState {
  projectToMilestones: Record<string, string[]>; // プロジェクトID -> マイルストーンIDのリストのマッピング
  milestoneToTasks: Record<string, string[]>; // マイルストーンID -> タスクIDのリストのマッピング
  taskDependencies: Record<string, string[]>; // タスクID -> 依存タスクIDのリストのマッピング
  milestoneDependencies: Record<string, string[]>; // マイルストーンID -> 依存マイルストーンIDのリストのマッピング
}

/**
 * 統計状態
 */
export interface StatisticsState {
  totalTasks: number; // 全タスク数
  completedTasks: number; // 完了タスク数
  totalPoints: number; // 全ポイント
  earnedPoints: number; // 獲得ポイント
  averagePointsPerHour: number; // 1時間あたりの平均ポイント
  // 追加の統計情報
  /**
   * NEED CHECK : taskStartTimesは必ずタスク終了時に記載しないと整合性が合わなくなりそうなので注意。
   * taskStartした瞬間に統計に書き込まないような仕様にしましょう。
   */
  taskCompletionTimes: Record<string, number>; // タスクID -> 完了までの時間（分）のマッピング
  taskEarnedPoints: Record<string, number>; // タスクID → 完了で得たpoint
  taskStartTimes: Record<string, string>; // タスクID -> 開始時刻のマッピング
  taskEndTimes: Record<string, string>; // タスクID -> 終了時刻のマッピング
}

/**
 * アプリケーション状態
 *
 * いわゆるこれがGlobal State
 */
export interface AppState {
  projects: ProjectState; // プロジェクト状態
  milestones: MilestoneState; // マイルストーン状態
  tasks: TaskState; // タスク状態
  relations: RelationState; // 関係状態
  statistics: StatisticsState; // 統計状態
  lastUpdated: string; // 最終更新時刻（ISO形式の日付文字列）
  version: number; // 状態バージョン
}

/**
 * 初期アプリケーション状態を作成
 */
export function createInitialState(): AppState {
  return {
    projects: {
      projects: {},
      projectHistory: {},
    },
    milestones: {
      milestones: {},
      milestoneHistory: {},
    },
    tasks: {
      tasks: {},
      taskHistory: {},
    },
    relations: {
      projectToMilestones: {},
      milestoneToTasks: {},
      taskDependencies: {},
      milestoneDependencies: {},
    },
    statistics: {
      totalTasks: 0,
      completedTasks: 0,
      totalPoints: 0,
      earnedPoints: 0,
      averagePointsPerHour: 0, // 計算時、div0にならないように注意
      taskCompletionTimes: {},
      taskEarnedPoints: {},
      taskStartTimes: {},
      taskEndTimes: {},
    },
    lastUpdated: new Date().toISOString(),
    version: 1,
  };
}

/**
 * 状態のスナップショットを作成
 * @param state アプリケーション状態
 * @returns 状態のスナップショット（ディープコピー）
 */
export function createStateSnapshot(state: AppState): AppState {
  return JSON.parse(JSON.stringify(state)) as AppState;
}

/**
 * 状態を永続化形式に変換
 * @param state アプリケーション状態
 * @returns 永続化可能な状態オブジェクト
 */
export function serializeState(state: AppState): string {
  return JSON.stringify(state);
}

/**
 * 永続化形式から状態を復元
 * @param serialized 永続化された状態文字列
 * @returns 復元されたアプリケーション状態
 */
export function deserializeState(serialized: string): AppState {
  return JSON.parse(serialized) as AppState;
}
