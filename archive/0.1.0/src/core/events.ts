/**
 * events.ts
 *
 * 目的：
 * パノプティコンアプリケーション内でのイベント駆動型通信を実現するためのイベントエミッターシステムを提供します。
 * このモジュールにより、アプリケーションの異なるコンポーネント間で疎結合な通信が可能になります。
 *
 * 主な機能：
 * - イベントの登録、削除、発火の基本機能
 * - 型安全なイベントハンドリング
 * - コンポーネント間の通信の簡素化
 */

/**
 * イベントハンドラの型定義
 */
export type EventHandler<T = unknown> = (data: T) => void;

/**
 * イベントエミッタークラス
 * アプリケーション内のイベント管理を担当
 */
export class EventEmitter {
  private handlers: Map<string, EventHandler[]> = new Map();

  /**
   * イベントリスナーを登録
   * @param event イベント名
   * @param handler イベントハンドラ
   */
  on<T>(event: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler as EventHandler);
  }

  /**
   * イベントリスナーを削除
   * @param event イベント名
   * @param handler イベントハンドラ
   */
  off(event: string, handler: EventHandler): void {
    if (!this.handlers.has(event)) return;

    const handlers = this.handlers.get(event)!;
    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
    }
  }

  /**
   * イベントを発火
   * @param event イベント名
   * @param data イベントデータ
   */
  emit<T>(event: string, data: T): void {
    if (!this.handlers.has(event)) return;

    for (const handler of this.handlers.get(event)!) {
      handler(data);
    }
  }
}
