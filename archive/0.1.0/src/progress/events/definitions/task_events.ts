/**
 * progress/events/definitions/task_events.ts
 *
 * 目的：
 * タスク関連のイベント作成関数を提供します。
 * タスクの作成、更新、削除、状態変更などのイベントを作成する関数を定義します。
 */

import {
  EventType,
  TaskAddedToMilestoneEvent,
  TaskBlockedEvent,
  TaskCompletedEvent,
  TaskCreatedEvent,
  TaskDeletedEvent,
  TaskDependencyAddedEvent,
  TaskDependencyRemovedEvent,
  TaskRemovedFromMilestoneEvent,
  TaskStartedEvent,
  TaskStatusChangedEvent,
  TaskTimeLoggedEvent,
  TaskUnblockedEvent,
  TaskUpdatedEvent,
} from "../../types/events.ts";
import {
  getCurrentISOString,
  Status,
  TaskInfo,
  TaskPriority,
} from "../../types/models.ts";
import { createEvent } from "./base.ts";

/**
 * タスク作成イベントを作成
 * @param task タスク情報
 * @returns タスク作成イベント
 */
export function createTaskCreatedEvent(task: TaskInfo): TaskCreatedEvent {
  return createEvent<TaskCreatedEvent>(EventType.TASK_CREATED, { task });
}

/**
 * タスク更新イベントを作成
 * @param taskId タスクID
 * @param updates 更新内容
 * @returns タスク更新イベント
 */
export function createTaskUpdatedEvent(
  taskId: string,
  updates: {
    title?: string;
    description?: string;
    estimatedPoints?: number;
    priority?: TaskPriority;
    tags?: string[];
  },
): TaskUpdatedEvent {
  return createEvent<TaskUpdatedEvent>(EventType.TASK_UPDATED, {
    taskId,
    ...updates,
  });
}

/**
 * タスク削除イベントを作成
 * @param taskId タスクID
 * @returns タスク削除イベント
 */
export function createTaskDeletedEvent(taskId: string): TaskDeletedEvent {
  return createEvent<TaskDeletedEvent>(EventType.TASK_DELETED, { taskId });
}

/**
 * タスク状態変更イベントを作成
 * @param taskId タスクID
 * @param oldStatus 旧状態
 * @param newStatus 新状態
 * @returns タスク状態変更イベント
 */
export function createTaskStatusChangedEvent(
  taskId: string,
  oldStatus: Status,
  newStatus: Status,
): TaskStatusChangedEvent {
  return createEvent<TaskStatusChangedEvent>(EventType.TASK_STATUS_CHANGED, {
    taskId,
    oldStatus,
    newStatus,
  });
}

/**
 * タスクをマイルストーンに追加イベントを作成
 * @param milestoneId マイルストーンID
 * @param taskId タスクID
 * @returns タスクをマイルストーンに追加イベント
 */
export function createTaskAddedToMilestoneEvent(
  milestoneId: string,
  taskId: string,
): TaskAddedToMilestoneEvent {
  return createEvent<TaskAddedToMilestoneEvent>(
    EventType.TASK_ADDED_TO_MILESTONE,
    {
      milestoneId,
      taskId,
    },
  );
}

/**
 * タスクをマイルストーンから削除イベントを作成
 * @param milestoneId マイルストーンID
 * @param taskId タスクID
 * @returns タスクをマイルストーンから削除イベント
 */
export function createTaskRemovedFromMilestoneEvent(
  milestoneId: string,
  taskId: string,
): TaskRemovedFromMilestoneEvent {
  return createEvent<TaskRemovedFromMilestoneEvent>(
    EventType.TASK_REMOVED_FROM_MILESTONE,
    {
      milestoneId,
      taskId,
    },
  );
}

/**
 * タスク依存関係追加イベントを作成
 * @param taskId タスクID
 * @param dependsOnTaskId 依存先タスクID
 * @returns タスク依存関係追加イベント
 */
export function createTaskDependencyAddedEvent(
  taskId: string,
  dependsOnTaskId: string,
): TaskDependencyAddedEvent {
  return createEvent<TaskDependencyAddedEvent>(
    EventType.TASK_DEPENDENCY_ADDED,
    {
      taskId,
      dependsOnTaskId,
    },
  );
}

/**
 * タスク依存関係削除イベントを作成
 * @param taskId タスクID
 * @param dependsOnTaskId 依存先タスクID
 * @returns タスク依存関係削除イベント
 */
export function createTaskDependencyRemovedEvent(
  taskId: string,
  dependsOnTaskId: string,
): TaskDependencyRemovedEvent {
  return createEvent<TaskDependencyRemovedEvent>(
    EventType.TASK_DEPENDENCY_REMOVED,
    {
      taskId,
      dependsOnTaskId,
    },
  );
}

/**
 * タスク開始イベントを作成
 * @param taskId タスクID
 * @param startTime 開始時間
 * @returns タスク開始イベント
 */
export function createTaskStartedEvent(
  taskId: string,
  startTime: string = getCurrentISOString(),
): TaskStartedEvent {
  return createEvent<TaskStartedEvent>(EventType.TASK_STARTED, {
    taskId,
    startTime,
  });
}

/**
 * タスク完了イベントを作成
 * @param taskId タスクID
 * @param endTime 終了時間
 * @param elapsedTimeMinute 経過時間（分）
 * @returns タスク完了イベント
 */
export function createTaskCompletedEvent(
  taskId: string,
  endTime: string = getCurrentISOString(),
  elapsedTimeMinute: number,
): TaskCompletedEvent {
  return createEvent<TaskCompletedEvent>(EventType.TASK_COMPLETED, {
    taskId,
    endTime,
    elapsedTimeMinute,
  });
}

/**
 * タスクブロックイベントを作成
 * @param taskId タスクID
 * @param reason ブロック理由
 * @returns タスクブロックイベント
 */
export function createTaskBlockedEvent(
  taskId: string,
  reason: string,
): TaskBlockedEvent {
  return createEvent<TaskBlockedEvent>(EventType.TASK_BLOCKED, {
    taskId,
    reason,
  });
}

/**
 * タスクブロック解除イベントを作成
 * @param taskId タスクID
 * @returns タスクブロック解除イベント
 */
export function createTaskUnblockedEvent(
  taskId: string,
): TaskUnblockedEvent {
  return createEvent<TaskUnblockedEvent>(EventType.TASK_UNBLOCKED, {
    taskId,
  });
}

/**
 * タスク時間記録イベントを作成
 * @param taskId タスクID
 * @param timeMinutes 時間（分）
 * @param description 説明
 * @returns タスク時間記録イベント
 *
 * NEED CHECK : これなんだっけ
 */
export function createTaskTimeLoggedEvent(
  taskId: string,
  timeMinutes: number,
  description?: string,
): TaskTimeLoggedEvent {
  return createEvent<TaskTimeLoggedEvent>(EventType.TASK_TIME_LOGGED, {
    taskId,
    timeMinutes,
    description,
  });
}
