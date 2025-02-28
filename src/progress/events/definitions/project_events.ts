/**
 * progress/events/definitions/project_events.ts
 *
 * 目的：
 * プロジェクト関連のイベント作成関数を提供します。
 * プロジェクトの作成、更新、削除、状態変更などのイベントを作成する関数を定義します。
 */

import {
  EventType,
  ProjectCreatedEvent,
  ProjectDeletedEvent,
  ProjectStatusChangedEvent,
  ProjectUpdatedEvent,
} from "../../types/events.ts";
import { ProjectInfo, Status } from "../../types/models.ts"; // TODO これ相対パスではなく特定パスから橋渡ししてくれるts欲しいよね.d.tsだっけ
import { createEvent } from "./base.ts";

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
