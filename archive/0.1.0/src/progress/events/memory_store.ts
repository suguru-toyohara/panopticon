/**
 * progress/events/memory_store.ts
 *
 * 目的：
 * メモリベースのイベントストア実装を提供します。
 * 主にテスト用や一時的な使用のためのイベントストアです。
 *
 * FIXME: file_store.tsとの重複コードが多いので、共通部分を抽出するリファクタリングが必要
 */

import { ProgressEvent } from "../types/events.ts";
import { EventStore } from "./interface.ts";

/**
 * メモリベースのイベントストア実装（主にテスト用）
 */
export class InMemoryEventStore implements EventStore {
  private events: ProgressEvent[] = [];

  /**
   * イベントを保存
   * @param event 保存するイベント
   * @returns 保存されたイベント
   */
  saveEvent(event: ProgressEvent): Promise<ProgressEvent> {
    this.events.push(event);
    return Promise.resolve(event);
  }

  /**
   * 複数のイベントを保存
   * @param events 保存するイベントの配列
   * @returns 保存されたイベントの配列
   */
  saveEvents(events: ProgressEvent[]): Promise<ProgressEvent[]> {
    this.events.push(...events);
    return Promise.resolve(events);
  }

  /**
   * すべてのイベントを取得
   * @returns すべてのイベントの配列
   */
  getAllEvents(): Promise<ProgressEvent[]> {
    return Promise.resolve([...this.events]);
  }

  /**
   * 特定のイベントIDのイベントを取得
   * @param eventId イベントID
   * @returns イベント（存在しない場合はnull）
   */
  getEventById(eventId: string): Promise<ProgressEvent | null> {
    const event = this.events.find((e) => e.id === eventId);
    return Promise.resolve(event || null);
  }

  /**
   * 特定のエンティティに関連するイベントを取得
   * @param entityId エンティティID（プロジェクト、マイルストーン、タスクのID）
   * @returns エンティティに関連するイベントの配列
   */
  getEventsByEntityId(entityId: string): Promise<ProgressEvent[]> {
    const filteredEvents = this.events.filter((event) => {
      const payload = event.payload;

      if (!payload) {
        return false;
      }

      // プロジェクト関連イベント
      if ("projectId" in payload && payload.projectId === entityId) {
        return true;
      }

      // マイルストーン関連イベント
      if ("milestoneId" in payload && payload.milestoneId === entityId) {
        return true;
      }

      // タスク関連イベント
      if ("taskId" in payload && payload.taskId === entityId) {
        return true;
      }

      // プロジェクト作成イベント
      if (
        "project" in payload && payload.project &&
        "projectId" in payload.project && payload.project.projectId === entityId
      ) {
        return true;
      }

      // マイルストーン作成イベント
      if (
        "milestone" in payload && payload.milestone &&
        "milestoneId" in payload.milestone &&
        payload.milestone.milestoneId === entityId
      ) {
        return true;
      }

      // タスク作成イベント
      if (
        "task" in payload && payload.task && "taskId" in payload.task &&
        payload.task.taskId === entityId
      ) {
        return true;
      }

      // どれにも当てはまらない場合
      return false;
    });

    return Promise.resolve(filteredEvents);
  }

  /**
   * 特定の時間範囲内のイベントを取得
   * @param startTime 開始時間（ISO形式の日付文字列）
   * @param endTime 終了時間（ISO形式の日付文字列）
   * @returns 時間範囲内のイベントの配列
   */
  getEventsByTimeRange(
    startTime: string,
    endTime: string,
  ): Promise<ProgressEvent[]> {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    const filteredEvents = this.events.filter((event) => {
      const eventTime = new Date(event.timestamp).getTime();
      return eventTime >= start && eventTime <= end;
    });

    return Promise.resolve(filteredEvents);
  }

  /**
   * 特定のイベント種別のイベントを取得
   * @param eventType イベント種別
   * @returns 特定のイベント種別のイベントの配列
   */
  getEventsByType(eventType: string): Promise<ProgressEvent[]> {
    const filteredEvents = this.events.filter((event) =>
      event.type === eventType
    );
    return Promise.resolve(filteredEvents);
  }

  /**
   * イベントストアをクリア（主にテスト用）
   */
  clear(): Promise<void> {
    this.events = [];
    return Promise.resolve();
  }
}
