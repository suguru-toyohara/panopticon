/**
 * progress/types/models.ts
 *
 * 目的：
 * 進捗管理に関連するドメインモデルの型定義を提供します。
 * タスク、マイルストーン、プロジェクトなどの基本的なエンティティの型を定義し、
 * アプリケーション全体で一貫したドメインモデルの取り扱いを可能にします。
 *
 * 主な型定義：
 * - タスク（Task）
 * - マイルストーン（Milestone）
 * - プロジェクト（Project）
 * - 状態定義（Status）
 */

/**
 * タスクの状態を表す列挙型
 */
export enum Status {
  NOT_STARTED = "not_started", // 未着手
  IN_PROGRESS = "in_progress", // 進行中
  COMPLETED = "completed", // 完了
  BLOCKED = "blocked", // ブロック中
}

/**
 * タスクの優先度を表す列挙型
 *
 * MVPの観点から、MUST（必須）とENHANCE（強化）の2種類のみを定義します。
 * 将来的には緊急度と重要度の2軸で優先度を定義することも検討します。
 */
export enum TaskPriority {
  MUST = "must", // 必ずやらなければならないタスク
  ENHANCE = "enhance", // 余裕があれば実施するタスク
}

/**
 * タスクの基本情報を表す型
 */
export interface TaskInfo {
  taskId: string; // タスクID（一意）
  title: string; // タスク名
  description?: string; // タスクの説明
  status: Status; // タスクの状態
  priority: TaskPriority; // タスクの優先度
  estimatedPoints: number; // 見積もりポイント
  elapsedTimeMinute?: number; // 分単位で経過時間
  startTime?: string; // 開始時間（ISO形式の日付文字列）
  endTime?: string; // 終了時間（ISO形式の日付文字列）
  tags?: string[]; // タグ
}

/**
 * マイルストーンの基本情報を表す型
 */
export interface MilestoneInfo {
  milestoneId: string; // マイルストーンID（一意）
  title: string; // マイルストーン名
  description?: string; // マイルストーンの説明
  status: Status; // マイルストーンの状態
  dueDate?: string; // 期限（ISO形式の日付文字列）
  completedDate?: string; // 完了日（ISO形式の日付文字列）
  startDate?: string; //着手開始日 (ISO形式の日付文字列)
}

/**
 * プロジェクトの基本情報を表す型
 */
export interface ProjectInfo {
  projectId: string; // プロジェクトID（一意）
  title: string; // プロジェクト名
  description?: string; // プロジェクトの説明
  status: Status; // プロジェクトの状態
  createdAt: string; // 作成日時（ISO形式の日付文字列）
  updatedAt: string; // 更新日時（ISO形式の日付文字列）
}

/**
 * 履歴エントリーの型定義
 */
export interface HistoryEntry {
  timestamp: string; // タイムスタンプ（ISO形式の日付文字列）
  actionType: string; // アクションタイプ
  description: string; // 説明
}

/**
 * 統計情報の型定義
 */
export interface Statistics {
  totalTasks: number; // 全タスク数
  completedTasks: number; // 完了タスク数
  totalPoints: number; // 全ポイント
  earnedPoints: number; // 獲得ポイント
  averagePointsPerHour: number; // 1時間あたりの平均ポイント
}

/**
 * 関連付け情報の型定義
 */
export interface Relations {
  projectToMilestones: Record<string, string[]>; // プロジェクトIDからマイルストーンIDのマッピング
  milestoneToTasks: Record<string, string[]>; // マイルストーンIDからタスクIDのマッピング
  taskDependencies: Record<string, string[]>; // タスクIDから依存タスクIDのマッピング
  milestoneDependencies: Record<string, string[]>; // マイルストーンIDから依存マイルストーンIDのマッピング
}

/**
 * ユーティリティ関数：現在時刻のISO形式文字列を取得
 */
export function getCurrentISOString(): string {
  return new Date().toISOString();
}

/**
 * ユーティリティ関数：ISO形式の日付文字列からDateオブジェクトを作成
 */
export function createDateFromISOString(isoString: string): Date {
  return new Date(isoString);
}
