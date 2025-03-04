/**
 * progress/events/definitions/index.ts
 *
 * 目的：
 * イベント定義モジュールのエントリーポイントを提供します。
 * すべてのイベント作成関数をエクスポートします。
 */

// 基本イベント作成関数
export { createEvent } from "./base.ts";

// プロジェクト関連イベント作成関数
export {
  createProjectCreatedEvent,
  createProjectDeletedEvent,
  createProjectStatusChangedEvent,
  createProjectUpdatedEvent,
} from "./project_events.ts";

// マイルストーン関連イベント作成関数
export {
  createMilestoneAddedToProjectEvent,
  createMilestoneCreatedEvent,
  createMilestoneDeletedEvent,
  createMilestoneDependencyAddedEvent,
  createMilestoneDependencyRemovedEvent,
  createMilestoneRemovedFromProjectEvent,
  createMilestoneStatusChangedEvent,
  createMilestoneUpdatedEvent,
} from "./milestone_events.ts";

// タスク関連イベント作成関数
export {
  createTaskAddedToMilestoneEvent,
  createTaskBlockedEvent,
  createTaskCompletedEvent,
  createTaskCreatedEvent,
  createTaskDeletedEvent,
  createTaskDependencyAddedEvent,
  createTaskDependencyRemovedEvent,
  createTaskRemovedFromMilestoneEvent,
  createTaskStartedEvent,
  createTaskStatusChangedEvent,
  createTaskTimeLoggedEvent,
  createTaskUnblockedEvent,
  createTaskUpdatedEvent,
} from "./task_events.ts";
