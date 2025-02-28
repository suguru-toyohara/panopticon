/**
 * progress/events/index.ts
 *
 * 目的：
 * イベントモジュールのエントリーポイントを提供します。
 * イベントストアの実装とイベント定義関数をエクスポートします。
 */

import { EventStore } from "./interface.ts";
import { FileEventStore } from "./file_store.ts";
import { InMemoryEventStore } from "./memory_store.ts";

// インターフェースをエクスポート
export type { EventStore } from "./interface.ts";

// 実装クラスをエクスポート
export { FileEventStore } from "./file_store.ts";
export { InMemoryEventStore } from "./memory_store.ts";

// イベント定義関数をエクスポート
export * from "./definitions/index.ts";

/**
 * イベントストアの種類
 */
export enum EventStoreType {
  FILE = "file",
  MEMORY = "memory",
}

/**
 * イベントストアを作成するファクトリ関数
 * @param type イベントストアの種類
 * @param options オプション
 * @returns イベントストアのインスタンス
 */
export function createEventStore(
  type: EventStoreType = EventStoreType.FILE,
  options?: {
    storageDir?: string;
  },
): EventStore {
  switch (type) {
    case EventStoreType.FILE:
      return new FileEventStore(options?.storageDir);
    case EventStoreType.MEMORY:
      return new InMemoryEventStore();
    default:
      throw new Error(`未サポートのイベントストア種類: ${type}`);
  }
}

/**
 * デフォルトのイベントストアを作成
 *
 * 環境変数 PANOPTICON_EVENT_STORE_TYPE で指定されたタイプのイベントストアを作成します。
 * 環境変数が設定されていない場合は FILE タイプを使用します。
 *
 * @returns 環境設定に基づいたイベントストアインスタンス
 */
export function createDefaultEventStore(): EventStore {
  // 環境変数からイベントストアタイプを取得
  const storeTypeStr = Deno.env.get("PANOPTICON_EVENT_STORE_TYPE") || "file";
  let storeType: EventStoreType;

  // 文字列をEventStoreTypeに変換
  switch (storeTypeStr.toLowerCase()) {
    case "memory":
      storeType = EventStoreType.MEMORY;
      break;
    case "file":
    default:
      storeType = EventStoreType.FILE;
      break;
  }

  // 環境変数からストレージディレクトリを取得
  const storageDir = Deno.env.get("PANOPTICON_EVENT_STORE_DIR");

  return createEventStore(storeType, { storageDir });
}
