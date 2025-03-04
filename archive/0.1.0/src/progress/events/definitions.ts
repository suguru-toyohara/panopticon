/**
 * progress/events/definitions.ts
 *
 * 目的：
 * イベント作成のためのヘルパー関数を提供します。
 * 各種イベントを簡単に作成するための関数を定義します。
 */

import {
  EventType,
  MilestoneAddedToProjectEvent,
  MilestoneCreatedEvent,
  MilestoneDeletedEvent,
  MilestoneDependencyAddedEvent,
  MilestoneDependencyRemovedEvent,
  MilestoneRemovedFromProjectEvent,
  MilestoneStatusChangedEvent,
  MilestoneUpdatedEvent,
  ProgressEvent,
  ProjectCreatedEvent,
  ProjectDeletedEvent,
  ProjectStatusChangedEvent,
  ProjectUpdatedEvent,
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
} from "../types/events.ts";
import {
  getCurrentISOString,
  MilestoneInfo,
  ProjectInfo,
  Status,
  TaskInfo,
  TaskPriority,
} from "../types/models.ts";

/**
 * 基本イベント作成関数
 * @param type イベント種別
 * @param payload イベントペイロード
 * @returns イベントオブジェクト
 */
function createEvent<T extends ProgressEvent>(
  type: EventType,
  payload: Omit<T["payload"], "timestamp">,
): T {
  return {
    id: crypto.randomUUID(),
    type,
    timestamp: getCurrentISOString(),
    version: 1,
    payload: payload as T["payload"],
  } as T;
}

// プロジェクト関連イベント作成関数

/**
 * プロジェクト作成イベントを作成
 * @param project プロジェクト情報
 * @returns プロジェクト作成イベント
 */
export function createProjectCreatedEvent(
  project: ProjectInfo,
): ProjectCreatedEvent {
  return createEvent<ProjectCreatedEvent>(EventType.PROJECT_CREATED, {
    project,
  });
}

/**
 * プロジェクト更新イベントを作成
 * @param projectId プロジェクトID
 * @param updates 更新内容
 * @returns プロジェクト更新イベント
 */
export function createProjectUpdatedEvent(
  projectId: string,
  updates: {
    title?: string;
    description?: string;
  },
): ProjectUpdatedEvent {
  return createEvent<ProjectUpdatedEvent>(EventType.PROJECT_UPDATED, {
    projectId,
    ...updates,
  });
}

/**
 * プロジェクト削除イベントを作成
 * @param projectId プロジェクトID
 * @returns プロジェクト削除イベント
 */
export function createProjectDeletedEvent(
  projectId: string,
): ProjectDeletedEvent {
  return createEvent<ProjectDeletedEvent>(EventType.PROJECT_DELETED, {
    projectId,
  });
}

/**
 * プロジェクト状態変更イベントを作成
 * @param projectId プロジェクトID
 * @param oldStatus 旧状態
 * @param newStatus 新状態
 * @returns プロジェクト状態変更イベント
 */
export function createProjectStatusChangedEvent(
  projectId: string,
  oldStatus: Status,
  newStatus: Status,
): ProjectStatusChangedEvent {
  return createEvent<ProjectStatusChangedEvent>(
    EventType.PROJECT_STATUS_CHANGED,
    {
      projectId,
      oldStatus,
      newStatus,
    },
  );
}

// マイルストーン関連イベント作成関数

/**
 * マイルストーン作成イベントを作成
 * @param milestone マイルストーン情報
 * @returns マイルストーン作成イベント
 */
export function createMilestoneCreatedEvent(
  milestone: MilestoneInfo,
): MilestoneCreatedEvent {
  return createEvent<MilestoneCreatedEvent>(EventType.MILESTONE_CREATED, {
    milestone,
  });
}

/**
 * マイルストーン更新イベントを作成
 * @param milestoneId マイルストーンID
 * @param updates 更新内容
 * @returns マイルストーン更新イベント
 */
export function createMilestoneUpdatedEvent(
  milestoneId: string,
  updates: {
    title?: string;
    description?: string;
    dueDate?: string;
  },
): MilestoneUpdatedEvent {
  return createEvent<MilestoneUpdatedEvent>(EventType.MILESTONE_UPDATED, {
    milestoneId,
    ...updates,
  });
}

/**
 * マイルストーン削除イベントを作成
 * @param milestoneId マイルストーンID
 * @returns マイルストーン削除イベント
 */
export function createMilestoneDeletedEvent(
  milestoneId: string,
): MilestoneDeletedEvent {
  return createEvent<MilestoneDeletedEvent>(EventType.MILESTONE_DELETED, {
    milestoneId,
  });
}

/**
 * マイルストーン状態変更イベントを作成
 * @param milestoneId マイルストーンID
 * @param oldStatus 旧状態
 * @param newStatus 新状態
 * @returns マイルストーン状態変更イベント
 */
export function createMilestoneStatusChangedEvent(
  milestoneId: string,
  oldStatus: Status,
  newStatus: Status,
): MilestoneStatusChangedEvent {
  return createEvent<MilestoneStatusChangedEvent>(
    EventType.MILESTONE_STATUS_CHANGED,
    {
      milestoneId,
      oldStatus,
      newStatus,
    },
  );
}

/**
 * マイルストーンをプロジェクトに追加イベントを作成
 * @param projectId プロジェクトID
 * @param milestoneId マイルストーンID
 * @returns マイルストーンをプロジェクトに追加イベント
 */
export function createMilestoneAddedToProjectEvent(
  projectId: string,
  milestoneId: string,
): MilestoneAddedToProjectEvent {
  return createEvent<MilestoneAddedToProjectEvent>(
    EventType.MILESTONE_ADDED_TO_PROJECT,
    {
      projectId,
      milestoneId,
    },
  );
}

/**
 * マイルストーンをプロジェクトから削除イベントを作成
 * @param projectId プロジェクトID
 * @param milestoneId マイルストーンID
 * @returns マイルストーンをプロジェクトから削除イベント
 */
export function createMilestoneRemovedFromProjectEvent(
  projectId: string,
  milestoneId: string,
): MilestoneRemovedFromProjectEvent {
  return createEvent<MilestoneRemovedFromProjectEvent>(
    EventType.MILESTONE_REMOVED_FROM_PROJECT,
    {
      projectId,
      milestoneId,
    },
  );
}

/**
 * マイルストーン依存関係追加イベントを作成
 * @param milestoneId マイルストーンID
 * @param dependsOnMilestoneId 依存先マイルストーンID
 * @returns マイルストーン依存関係追加イベント
 */
export function createMilestoneDependencyAddedEvent(
  milestoneId: string,
  dependsOnMilestoneId: string,
): MilestoneDependencyAddedEvent {
  return createEvent<MilestoneDependencyAddedEvent>(
    EventType.MILESTONE_DEPENDENCY_ADDED,
    {
      milestoneId,
      dependsOnMilestoneId,
    },
  );
}

/**
 * マイルストーン依存関係削除イベントを作成
 * @param milestoneId マイルストーンID
 * @param dependsOnMilestoneId 依存先マイルストーンID
 * @returns マイルストーン依存関係削除イベント
 */
export function createMilestoneDependencyRemovedEvent(
  milestoneId: string,
  dependsOnMilestoneId: string,
): MilestoneDependencyRemovedEvent {
  return createEvent<MilestoneDependencyRemovedEvent>(
    EventType.MILESTONE_DEPENDENCY_REMOVED,
    {
      milestoneId,
      dependsOnMilestoneId,
    },
  );
}

// タスク関連イベント作成関数

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
