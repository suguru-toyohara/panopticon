/**
 * progress/types/events.ts
 *
 * 目的：
 * イベントソーシングパターンにおけるイベント型定義を提供します。
 * システム内で発生した変更を表すイベントの型を定義し、
 * 状態の変更履歴を追跡可能にします。
 *
 * 主な型定義：
 * - イベント基本型（Event）
 * - 各種イベント型（ProjectEvent, MilestoneEvent, TaskEvent）
 * - イベント種別（EventType）
 *
 * TODO : tsが300行以上になっている。肥大化すると手に追えなくなるので、分割できるならしたい。
 */

import {
  MilestoneInfo,
  ProjectInfo,
  Status,
  TaskInfo,
  TaskPriority,
} from "./models.ts";

/**
 * イベント種別の列挙型
 */
export enum EventType {
  // プロジェクト関連イベント
  PROJECT_CREATED = "project_created",
  PROJECT_UPDATED = "project_updated",
  PROJECT_DELETED = "project_deleted",
  PROJECT_STATUS_CHANGED = "project_status_changed",

  // マイルストーン関連イベント
  MILESTONE_CREATED = "milestone_created",
  MILESTONE_UPDATED = "milestone_updated",
  MILESTONE_DELETED = "milestone_deleted",
  MILESTONE_STATUS_CHANGED = "milestone_status_changed",
  MILESTONE_ADDED_TO_PROJECT = "milestone_added_to_project",
  MILESTONE_REMOVED_FROM_PROJECT = "milestone_removed_from_project",
  MILESTONE_DEPENDENCY_ADDED = "milestone_dependency_added",
  MILESTONE_DEPENDENCY_REMOVED = "milestone_dependency_removed",

  // タスク関連イベント
  TASK_CREATED = "task_created",
  TASK_UPDATED = "task_updated",
  TASK_DELETED = "task_deleted",
  TASK_STATUS_CHANGED = "task_status_changed",
  TASK_ADDED_TO_MILESTONE = "task_added_to_milestone",
  TASK_REMOVED_FROM_MILESTONE = "task_removed_from_milestone",
  TASK_DEPENDENCY_ADDED = "task_dependency_added",
  TASK_DEPENDENCY_REMOVED = "task_dependency_removed",
  TASK_STARTED = "task_started",
  TASK_COMPLETED = "task_completed",
  TASK_BLOCKED = "task_blocked",
  TASK_UNBLOCKED = "task_unblocked",
  TASK_TIME_LOGGED = "task_time_logged",
}

/**
 * イベント基本型
 */
export interface Event {
  id: string; // イベントID（一意）
  type: EventType; // イベント種別
  timestamp: string; // イベント発生時刻（ISO形式の日付文字列）
  version: number; // イベントバージョン（将来的な互換性のため）
}

/**
 * プロジェクト作成イベント
 */
export interface ProjectCreatedEvent extends Event {
  type: EventType.PROJECT_CREATED;
  payload: {
    project: ProjectInfo;
  };
}

/**
 * プロジェクト更新イベント
 */
export interface ProjectUpdatedEvent extends Event {
  type: EventType.PROJECT_UPDATED;
  payload: {
    projectId: string;
    title?: string;
    description?: string;
  };
}

/**
 * プロジェクト削除イベント
 */
export interface ProjectDeletedEvent extends Event {
  type: EventType.PROJECT_DELETED;
  payload: {
    projectId: string;
  };
}

/**
 * プロジェクト状態変更イベント
 */
export interface ProjectStatusChangedEvent extends Event {
  type: EventType.PROJECT_STATUS_CHANGED;
  payload: {
    projectId: string;
    oldStatus: Status;
    newStatus: Status;
  };
}

/**
 * マイルストーン作成イベント
 */
export interface MilestoneCreatedEvent extends Event {
  type: EventType.MILESTONE_CREATED;
  payload: {
    milestone: MilestoneInfo;
  };
}

/**
 * マイルストーン更新イベント
 */
export interface MilestoneUpdatedEvent extends Event {
  type: EventType.MILESTONE_UPDATED;
  payload: {
    milestoneId: string;
    title?: string;
    description?: string;
    dueDate?: string;
  };
}

/**
 * マイルストーン削除イベント
 */
export interface MilestoneDeletedEvent extends Event {
  type: EventType.MILESTONE_DELETED;
  payload: {
    milestoneId: string;
  };
}

/**
 * マイルストーン状態変更イベント
 */
export interface MilestoneStatusChangedEvent extends Event {
  type: EventType.MILESTONE_STATUS_CHANGED;
  payload: {
    milestoneId: string;
    oldStatus: Status;
    newStatus: Status;
  };
}

/**
 * マイルストーンをプロジェクトに追加イベント
 */
export interface MilestoneAddedToProjectEvent extends Event {
  type: EventType.MILESTONE_ADDED_TO_PROJECT;
  payload: {
    projectId: string;
    milestoneId: string;
  };
}

/**
 * マイルストーンをプロジェクトから削除イベント
 */
export interface MilestoneRemovedFromProjectEvent extends Event {
  type: EventType.MILESTONE_REMOVED_FROM_PROJECT;
  payload: {
    projectId: string;
    milestoneId: string;
  };
}

/**
 * マイルストーン依存関係追加イベント
 */
export interface MilestoneDependencyAddedEvent extends Event {
  type: EventType.MILESTONE_DEPENDENCY_ADDED;
  payload: {
    milestoneId: string;
    dependsOnMilestoneId: string;
  };
}

/**
 * マイルストーン依存関係削除イベント
 */
export interface MilestoneDependencyRemovedEvent extends Event {
  type: EventType.MILESTONE_DEPENDENCY_REMOVED;
  payload: {
    milestoneId: string;
    dependsOnMilestoneId: string;
  };
}

/**
 * タスク作成イベント
 */
export interface TaskCreatedEvent extends Event {
  type: EventType.TASK_CREATED;
  payload: {
    task: TaskInfo;
  };
}

/**
 * タスク更新イベント
 */
export interface TaskUpdatedEvent extends Event {
  type: EventType.TASK_UPDATED;
  payload: {
    taskId: string;
    title?: string;
    description?: string;
    estimatedPoints?: number;
    priority?: TaskPriority;
    tags?: string[];
  };
}

/**
 * タスク削除イベント
 */
export interface TaskDeletedEvent extends Event {
  type: EventType.TASK_DELETED;
  payload: {
    taskId: string;
  };
}

/**
 * タスク状態変更イベント
 */
export interface TaskStatusChangedEvent extends Event {
  type: EventType.TASK_STATUS_CHANGED;
  payload: {
    taskId: string;
    oldStatus: Status;
    newStatus: Status;
  };
}

/**
 * タスクをマイルストーンに追加イベント
 */
export interface TaskAddedToMilestoneEvent extends Event {
  type: EventType.TASK_ADDED_TO_MILESTONE;
  payload: {
    milestoneId: string;
    taskId: string;
  };
}

/**
 * タスクをマイルストーンから削除イベント
 */
export interface TaskRemovedFromMilestoneEvent extends Event {
  type: EventType.TASK_REMOVED_FROM_MILESTONE;
  payload: {
    milestoneId: string;
    taskId: string;
  };
}

/**
 * タスク依存関係追加イベント
 */
export interface TaskDependencyAddedEvent extends Event {
  type: EventType.TASK_DEPENDENCY_ADDED;
  payload: {
    taskId: string;
    dependsOnTaskId: string;
  };
}

/**
 * タスク依存関係削除イベント
 */
export interface TaskDependencyRemovedEvent extends Event {
  type: EventType.TASK_DEPENDENCY_REMOVED;
  payload: {
    taskId: string;
    dependsOnTaskId: string;
  };
}

/**
 * タスク開始イベント
 */
export interface TaskStartedEvent extends Event {
  type: EventType.TASK_STARTED;
  payload: {
    taskId: string;
    startTime: string;
  };
}

/**
 * タスク完了イベント
 */
export interface TaskCompletedEvent extends Event {
  type: EventType.TASK_COMPLETED;
  payload: {
    taskId: string;
    endTime: string;
    elapsedTimeMinute: number;
  };
}

/**
 * タスクブロックイベント
 */
export interface TaskBlockedEvent extends Event {
  type: EventType.TASK_BLOCKED;
  payload: {
    taskId: string;
    reason: string;
  };
}

/**
 * タスクブロック解除イベント
 */
export interface TaskUnblockedEvent extends Event {
  type: EventType.TASK_UNBLOCKED;
  payload: {
    taskId: string;
  };
}

/**
 * タスク時間記録イベント
 */
export interface TaskTimeLoggedEvent extends Event {
  type: EventType.TASK_TIME_LOGGED;
  payload: {
    taskId: string;
    timeMinutes: number;
    timestamp: string;
    description?: string;
  };
}

/**
 * プロジェクト関連イベント型
 */
export type ProjectEvent =
  | ProjectCreatedEvent
  | ProjectUpdatedEvent
  | ProjectDeletedEvent
  | ProjectStatusChangedEvent;

/**
 * マイルストーン関連イベント型
 */
export type MilestoneEvent =
  | MilestoneCreatedEvent
  | MilestoneUpdatedEvent
  | MilestoneDeletedEvent
  | MilestoneStatusChangedEvent
  | MilestoneAddedToProjectEvent
  | MilestoneRemovedFromProjectEvent
  | MilestoneDependencyAddedEvent
  | MilestoneDependencyRemovedEvent;

/**
 * タスク関連イベント型
 */
export type TaskEvent =
  | TaskCreatedEvent
  | TaskUpdatedEvent
  | TaskDeletedEvent
  | TaskStatusChangedEvent
  | TaskAddedToMilestoneEvent
  | TaskRemovedFromMilestoneEvent
  | TaskDependencyAddedEvent
  | TaskDependencyRemovedEvent
  | TaskStartedEvent
  | TaskCompletedEvent
  | TaskBlockedEvent
  | TaskUnblockedEvent
  | TaskTimeLoggedEvent;

/**
 * 全イベント型
 */
export type ProgressEvent = ProjectEvent | MilestoneEvent | TaskEvent;
