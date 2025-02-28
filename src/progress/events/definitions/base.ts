/**
 * progress/events/definitions/base.ts
 *
 * 目的：
 * 基本的なイベント作成関数を提供します。
 * すべてのイベント作成関数の基盤となる共通関数を定義します。
 */

import { EventType, ProgressEvent } from "../../types/events.ts";
import { getCurrentISOString } from "../../types/models.ts";

/**
 * 基本イベント作成関数
 * @param type イベント種別
 * @param payload イベントペイロード
 * @returns イベントオブジェクト
 */
export function createEvent<T extends ProgressEvent>(
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
