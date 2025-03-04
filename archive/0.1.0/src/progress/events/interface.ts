/**
 * progress/events/interface.ts
 *
 * 目的：
 * イベントストアのインターフェース定義を提供します。
 * イベントの永続化と取得のための共通インターフェースを定義します。
 */

import { ProgressEvent } from "../types/events.ts";

/**
 * イベントストアのインターフェース
 */
export interface EventStore {
  /**
   * イベントを保存
   * @param event 保存するイベント
   * @returns 保存されたイベント
   */
  saveEvent(event: ProgressEvent): Promise<ProgressEvent>;

  /**
   * 複数のイベントを保存
   * @param events 保存するイベントの配列
   * @returns 保存されたイベントの配列
   */
  saveEvents(events: ProgressEvent[]): Promise<ProgressEvent[]>;

  /**
   * すべてのイベントを取得
   * @returns すべてのイベントの配列
   */
  getAllEvents(): Promise<ProgressEvent[]>;

  /**
   * 特定のイベントIDのイベントを取得
   * @param eventId イベントID
   * @returns イベント（存在しない場合はnull）
   */
  getEventById(eventId: string): Promise<ProgressEvent | null>;

  /**
   * 特定のエンティティに関連するイベントを取得
   * @param entityId エンティティID（プロジェクト、マイルストーン、タスクのID）
   * @returns エンティティに関連するイベントの配列
   *
   * NEED CHECK : project/milestone/taskのUUIDは衝突可能性を考慮しないければならない。
   */
  getEventsByEntityId(entityId: string): Promise<ProgressEvent[]>;

  /**
   * 特定の時間範囲内のイベントを取得
   * @param startTime 開始時間（ISO形式の日付文字列）
   * @param endTime 終了時間（ISO形式の日付文字列）
   * @returns 時間範囲内のイベントの配列
   */
  getEventsByTimeRange(
    startTime: string,
    endTime: string,
  ): Promise<ProgressEvent[]>;

  /**
   * 特定のイベント種別のイベントを取得
   * @param eventType イベント種別
   * @returns 特定のイベント種別のイベントの配列
   */
  getEventsByType(eventType: string): Promise<ProgressEvent[]>;

  /**
   * イベントストアをクリア（主にテスト用）
   */
  clear(): Promise<void>;
}
