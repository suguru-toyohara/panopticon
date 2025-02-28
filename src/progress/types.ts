/**
 * progress/types.ts
 *
 * 目的：
 * 進捗管理に関連する型定義を提供します。
 * タスク、マイルストーン、進捗データなどの型を定義し、
 * アプリケーション全体で一貫した進捗データの取り扱いを可能にします。
 *
 * 主な型定義：
 * - タスク（Task）
 * - マイルストーン（Milestone）
 * - 進捗データ（ProgressData）
 * - 工程表（Project）
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
 * アクションタイプの列挙型
 */
export enum ActionType {
  CREATED = "created", // 作成
  STARTED = "started", // 開始
  UPDATED = "updated", // 更新
  COMPLETED = "completed", // 完了
  BLOCKED = "blocked", // ブロック
  UNBLOCKED = "unblocked", // ブロック解除
}

/**
 * アクションの型定義
 */
export interface Action {
  actionType: ActionType; // アクションタイプ
  description: string; // 説明
}

/**
 * 履歴の型定義
 */
export interface History {
  timestamp: string; // タイムスタンプ（ISO形式の日付文字列）
  action: Action; // アクション
}

/**
 * タスクの優先度を表す列挙型
 *
 * 優先度に関しては特別な要求があって
 * - 優先度を決めたところでどうせどれもPriority HighとかCriticalに全部なっちゃうから意味ないと思っている。
 * - ならば、必ずやらなきゃいけないことと、後回しにしてもいいタスクの二つになると思う
 * という要求があるので、一旦こうしてます。
 * （でも正直迷いポイントでもあり、必要ないかもとも思ってる。議論したい）
 *
 * TODO : 一般的にはタスクは2つの軸があり、
 * - 緊急度 : どれくらい後回しにできるか
 * - 重要度 : どれくらい達成価値があるか
 * の二つであり、これを考慮するべきかなと思うんですが、
 * それを分析してタスクを調整してくれる機能はかなり難易度が高いので、
 * MVPの観点からまずはMUST/ENHANCEの二つしか用意しないことにする。
 * あとあと変更するようにプログラムも書く。
 */
export enum TaskPriority {
  MUST = "must", // 必ずやらなきゃいけないこと
  ENHANCE = "enhance", // やれるといいかもねくらいのやつ
}

/**
 * タスクの型定義
 *
 * MVPの観点から、依存関係は削除し、シンプルな構造にします。
 * タスクはマイルストーンに紐付けられます。
 */
export interface Task {
  taskId: string; // タスクID（一意）
  title: string; // タスク名
  description?: string; // タスクの説明
  status: Status; // タスクの状態
  priority: TaskPriority; // タスクの優先度
  estimatedPoints: number; // 見積もりポイント
  actualPoints?: number; // 実際のポイント
  startTime?: string; // 開始時間（ISO形式の日付文字列）
  endTime?: string; // 終了時間（ISO形式の日付文字列）
  tags?: Array<string>; // タグ
  statusHistory: Array<History>; // 状態変更履歴
}

/**
 * マイルストーンの型定義
 *
 * MVPの観点から、依存関係は削除し、シンプルな構造にします。
 * マイルストーンはプロジェクトに紐付けられます。
 */
export interface Milestone {
  milestoneId: string; // マイルストーンID（一意）
  milestoneStatus: Status; // マイルストーンの状態
  title: string; // マイルストーン名
  description?: string; // マイルストーンの説明
  dueDate?: string; // 期限（ISO形式の日付文字列）
  completedDate?: string; // 完了日（ISO形式の日付文字列）
  statusHistory: Array<History>; // 状態変更履歴
}

/**
 * プロジェクト（工程表）の型定義
 *
 * MVPの観点から、ProjectBaseとProjectDetailsの分離は行わず、
 * シンプルな単一の型定義にします。
 */
export interface Project {
  projectId: string; // 工程表ID（一意）
  projectStatus: Status; // 進行中か完了か未着手か
  title: string; // 工程表名
  description?: string; // 工程表の説明
  createdAt: string; // 作成日時（ISO形式の日付文字列）
  updatedAt: string; // 更新日時（ISO形式の日付文字列）
  statusHistory: Array<History>; // 状態変更履歴
}

/**
 * 進捗データの型定義
 *
 * MVPの観点から、Map構造を使用して効率的なアクセスを実現します。
 */
export interface ProgressData {
  // マップ構造（メモリ上のみ、JSONには変換して保存）
  projectMap: Map<string, Project>; // プロジェクトマップ
  milestoneMap: Map<string, Milestone>; // マイルストーンマップ
  taskMap: Map<string, Task>; // タスクマップ

  // 関連付けマップ
  milestoneIdsInTheProject: Map<string, string[]>; // プロジェクトIDからマイルストーンIDのリスト
  taskIdsInTheMilestone: Map<string, string[]>; // マイルストーンIDからタスクIDのリスト

  // 統計情報
  statistics: {
    totalTasks: number; // 全タスク数
    completedTasks: number; // 完了タスク数
    totalPoints: number; // 全ポイント
    earnedPoints: number; // 獲得ポイント
    averagePointsPerHour: number; // 1時間あたりの平均ポイント
  };
}

/**
 * 永続化用の進捗データ型定義
 *
 * Map構造はJSONに直接変換できないため、永続化時に使用する型定義です。
 * ここもっと詳しく教えて。
 */
export interface SerializedProgressData {
  projects: Record<string, Project>; // プロジェクトマップ（シリアライズ用）
  milestones: Record<string, Milestone>; // マイルストーンマップ（シリアライズ用）
  tasks: Record<string, Task>; // タスクマップ（シリアライズ用）

  projectId2milestoneIds: Record<string, string[]>; // プロジェクトIDからマイルストーンIDのリスト
  milestoneId2taskIds: Record<string, string[]>; // マイルストーンIDからタスクIDのリスト

  statistics: {
    totalTasks: number;
    completedTasks: number;
    totalPoints: number;
    earnedPoints: number;
    averagePointsPerHour: number;
  };
}

/**
 * 進捗イベントの種類
 */
export enum ProgressEventType {
  TASK_CREATED = "progress:task_created", // タスク作成
  TASK_UPDATED = "progress:task_updated", // タスク更新
  TASK_DELETED = "progress:task_deleted", // タスク削除
  TASK_STARTED = "progress:task_started", // タスク開始
  TASK_COMPLETED = "progress:task_completed", // タスク完了
  MILESTONE_CREATED = "progress:milestone_created", // マイルストーン作成
  MILESTONE_UPDATED = "progress:milestone_updated", // マイルストーン更新
  MILESTONE_DELETED = "progress:milestone_deleted", // マイルストーン削除
  MILESTONE_COMPLETED = "progress:milestone_completed", // マイルストーン完了
  PROJECT_CREATED = "progress:project_created", // 工程表作成
  PROJECT_UPDATED = "progress:project_updated", // 工程表更新
  PROJECT_DELETED = "progress:project_deleted", // 工程表削除
  PROGRESS_UPDATED = "progress:updated", // 進捗更新 // NEED CHECK : 必要？これ
}

/**
 * 進捗イベントのデータ型
 *
 * TODO: 以下も追加
 * - Taskのmilestone追加
 * - Taskのdependencyを追加
 * - milestoneのproject追加
 * - milestoneのdependenyを追加
 * 他にもありそう。議論しましょう。
 */
export type ProgressEventData =
  | {
    type:
      | ProgressEventType.TASK_CREATED
      | ProgressEventType.TASK_UPDATED
      | ProgressEventType.TASK_DELETED
      | ProgressEventType.TASK_STARTED
      | ProgressEventType.TASK_COMPLETED;
    task: Task;
    projectId: string;
  }
  | {
    type:
      | ProgressEventType.MILESTONE_CREATED
      | ProgressEventType.MILESTONE_UPDATED
      | ProgressEventType.MILESTONE_DELETED
      | ProgressEventType.MILESTONE_COMPLETED;
    milestone: Milestone;
    projectId: string;
  }
  | {
    type:
      | ProgressEventType.PROJECT_CREATED
      | ProgressEventType.PROJECT_UPDATED
      | ProgressEventType.PROJECT_DELETED;
    project: Project; // NEED CHECK : これでいいんだっけ？
  }
  | {
    type: ProgressEventType.PROGRESS_UPDATED;
    progressData: ProgressData;
  };
