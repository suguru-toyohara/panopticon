/**
 * progress/events/store.ts
 *
 * 目的：
 * イベントソーシングパターンにおけるイベントストアの実装を提供します。
 * イベントの永続化と取得を担当し、イベントの履歴を管理します。
 *
 * 主な機能：
 * - イベントの保存
 * - イベントの取得
 * - イベントストリームの提供
 *
 * FIXME : 力尽きてるので、分割必須
 */

import { ProgressEvent } from "../types/events.ts";
import { getCurrentISOString } from "../types/models.ts";

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

/**
 * ファイルベースのイベントストア実装
 */
export class FileEventStore implements EventStore {
  private storageDir: string;
  private eventsFile: string;
  private events: ProgressEvent[] = [];
  private initialized = false;

  /**
   * コンストラクタ
   * @param storageDir ストレージディレクトリ
   */
  constructor(
    storageDir: string = `${Deno.env.get("HOME")}/.config/panopticon/events`,
  ) {
    this.storageDir = storageDir;
    this.eventsFile = `${this.storageDir}/events.jsonl`;
  }

  /**
   * イベントストアを初期化
   */
  private async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // ストレージディレクトリが存在するか確認し、存在しない場合は作成
      try {
        await Deno.stat(this.storageDir);
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
          await Deno.mkdir(this.storageDir, { recursive: true });
        } else {
          throw error;
        }
      }

      // イベントファイルが存在するか確認し、存在する場合は読み込み
      try {
        await Deno.stat(this.eventsFile);
        await this.loadEvents();
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
          // ファイルが存在しない場合は空の配列を使用
          this.events = [];
        } else {
          throw error;
        }
      }

      this.initialized = true;
    } catch (error) {
      console.error("イベントストアの初期化に失敗しました:", error);
      throw error;
    }
  }

  /**
   * イベントをファイルから読み込み
   */
  private async loadEvents(): Promise<void> {
    try {
      const content = await Deno.readTextFile(this.eventsFile);
      const lines = content.trim().split("\n");

      this.events = lines
        .filter((line) => line.trim() !== "")
        .map((line) => JSON.parse(line) as ProgressEvent);
    } catch (error) {
      console.error("イベントの読み込みに失敗しました:", error);
      this.events = [];
    }
  }

  /**
   * イベントをファイルに保存
   * @param event 保存するイベント
   */
  private async appendEventToFile(event: ProgressEvent): Promise<void> {
    try {
      const eventJson = JSON.stringify(event);
      await Deno.writeTextFile(this.eventsFile, eventJson + "\n", {
        append: true,
      });
    } catch (error) {
      console.error("イベントの保存に失敗しました:", error);
      throw error;
    }
  }

  /**
   * 複数のイベントをファイルに保存
   * @param events 保存するイベントの配列
   */
  private async appendEventsToFile(events: ProgressEvent[]): Promise<void> {
    try {
      const eventsJson = events.map((event) => JSON.stringify(event)).join(
        "\n",
      );
      await Deno.writeTextFile(this.eventsFile, eventsJson + "\n", {
        append: true,
      });
    } catch (error) {
      console.error("イベントの保存に失敗しました:", error);
      throw error;
    }
  }

  /**
   * イベントを保存
   * @param event 保存するイベント
   * @returns 保存されたイベント
   */
  async saveEvent(event: ProgressEvent): Promise<ProgressEvent> {
    await this.initialize();

    // イベントをメモリに追加
    this.events.push(event);

    // イベントをファイルに追加
    await this.appendEventToFile(event);

    return event;
  }

  /**
   * 複数のイベントを保存
   * @param events 保存するイベントの配列
   * @returns 保存されたイベントの配列
   */
  async saveEvents(events: ProgressEvent[]): Promise<ProgressEvent[]> {
    await this.initialize();

    // イベントをメモリに追加
    this.events.push(...events);

    // イベントをファイルに追加
    await this.appendEventsToFile(events);

    return events;
  }

  /**
   * すべてのイベントを取得
   * @returns すべてのイベントの配列
   */
  async getAllEvents(): Promise<ProgressEvent[]> {
    await this.initialize();
    return [...this.events];
  }

  /**
   * 特定のイベントIDのイベントを取得
   * @param eventId イベントID
   * @returns イベント（存在しない場合はnull）
   */
  async getEventById(eventId: string): Promise<ProgressEvent | null> {
    await this.initialize();
    const event = this.events.find((e) => e.id === eventId);
    return event || null;
  }

  /**
   * 特定のエンティティに関連するイベントを取得
   * @param entityId エンティティID（プロジェクト、マイルストーン、タスクのID）
   * @returns エンティティに関連するイベントの配列
   */
  async getEventsByEntityId(entityId: string): Promise<ProgressEvent[]> {
    await this.initialize();

    return this.events.filter((event) => {
      const payload = (event as any).payload;

      if (!payload) {
        return false;
      }

      // プロジェクト関連イベント
      if (payload.projectId === entityId) {
        return true;
      }

      // マイルストーン関連イベント
      if (payload.milestoneId === entityId) {
        return true;
      }

      // タスク関連イベント
      if (payload.taskId === entityId) {
        return true;
      }

      // プロジェクト作成イベント
      if (payload.project && payload.project.projectId === entityId) {
        return true;
      }

      // マイルストーン作成イベント
      if (payload.milestone && payload.milestone.milestoneId === entityId) {
        return true;
      }

      // タスク作成イベント
      if (payload.task && payload.task.taskId === entityId) {
        return true;
      }

      return false;
    });
  }

  /**
   * 特定の時間範囲内のイベントを取得
   * @param startTime 開始時間（ISO形式の日付文字列）
   * @param endTime 終了時間（ISO形式の日付文字列）
   * @returns 時間範囲内のイベントの配列
   */
  async getEventsByTimeRange(
    startTime: string,
    endTime: string,
  ): Promise<ProgressEvent[]> {
    await this.initialize();

    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    return this.events.filter((event) => {
      const eventTime = new Date(event.timestamp).getTime();
      return eventTime >= start && eventTime <= end;
    });
  }

  /**
   * 特定のイベント種別のイベントを取得
   * @param eventType イベント種別
   * @returns 特定のイベント種別のイベントの配列
   */
  async getEventsByType(eventType: string): Promise<ProgressEvent[]> {
    await this.initialize();
    return this.events.filter((event) => event.type === eventType);
  }

  /**
   * イベントストアをクリア（主にテスト用）
   */
  async clear(): Promise<void> {
    this.events = [];

    try {
      await Deno.writeTextFile(this.eventsFile, "");
    } catch (error) {
      console.error("イベントストアのクリアに失敗しました:", error);
      throw error;
    }
  }
}

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
  async saveEvent(event: ProgressEvent): Promise<ProgressEvent> {
    this.events.push(event);
    return event;
  }

  /**
   * 複数のイベントを保存
   * @param events 保存するイベントの配列
   * @returns 保存されたイベントの配列
   */
  async saveEvents(events: ProgressEvent[]): Promise<ProgressEvent[]> {
    this.events.push(...events);
    return events;
  }

  /**
   * すべてのイベントを取得
   * @returns すべてのイベントの配列
   */
  async getAllEvents(): Promise<ProgressEvent[]> {
    return [...this.events];
  }

  /**
   * 特定のイベントIDのイベントを取得
   * @param eventId イベントID
   * @returns イベント（存在しない場合はnull）
   */
  async getEventById(eventId: string): Promise<ProgressEvent | null> {
    const event = this.events.find((e) => e.id === eventId);
    return event || null;
  }

  /**
   * 特定のエンティティに関連するイベントを取得
   * @param entityId エンティティID（プロジェクト、マイルストーン、タスクのID）
   * @returns エンティティに関連するイベントの配列
   */
  async getEventsByEntityId(entityId: string): Promise<ProgressEvent[]> {
    return this.events.filter((event) => {
      const payload = (event as any).payload;

      if (!payload) {
        return false;
      }

      // プロジェクト関連イベント
      if (payload.projectId === entityId) {
        return true;
      }

      // マイルストーン関連イベント
      if (payload.milestoneId === entityId) {
        return true;
      }

      // タスク関連イベント
      if (payload.taskId === entityId) {
        return true;
      }

      // プロジェクト作成イベント
      if (payload.project && payload.project.projectId === entityId) {
        return true;
      }

      // マイルストーン作成イベント
      if (payload.milestone && payload.milestone.milestoneId === entityId) {
        return true;
      }

      // タスク作成イベント
      if (payload.task && payload.task.taskId === entityId) {
        return true;
      }

      return false;
    });
  }

  /**
   * 特定の時間範囲内のイベントを取得
   * @param startTime 開始時間（ISO形式の日付文字列）
   * @param endTime 終了時間（ISO形式の日付文字列）
   * @returns 時間範囲内のイベントの配列
   */
  async getEventsByTimeRange(
    startTime: string,
    endTime: string,
  ): Promise<ProgressEvent[]> {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    return this.events.filter((event) => {
      const eventTime = new Date(event.timestamp).getTime();
      return eventTime >= start && eventTime <= end;
    });
  }

  /**
   * 特定のイベント種別のイベントを取得
   * @param eventType イベント種別
   * @returns 特定のイベント種別のイベントの配列
   */
  async getEventsByType(eventType: string): Promise<ProgressEvent[]> {
    return this.events.filter((event) => event.type === eventType);
  }

  /**
   * イベントストアをクリア（主にテスト用）
   */
  async clear(): Promise<void> {
    this.events = [];
  }
}

/**
 * デフォルトのイベントストアを作成
 * @returns イベントストアのインスタンス
 */
export function createEventStore(): EventStore {
  return new FileEventStore();
}
