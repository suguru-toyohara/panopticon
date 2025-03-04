/**
 * progress/events/definitions/milestone_events.ts
 *
 * 目的：
 * マイルストーン関連のイベント作成関数を提供します。
 * マイルストーンの作成、更新、削除、状態変更などのイベントを作成する関数を定義します。
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
} from "../../types/events.ts";
import { MilestoneInfo, Status } from "../../types/models.ts";
import { createEvent } from "./base.ts";

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
