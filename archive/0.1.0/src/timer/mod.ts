/**
 * timer/mod.ts
 *
 * 目的：
 * パノプティコンアプリケーションのタイマー機能を提供します。
 * ポモドーロテクニックに基づいた作業・休憩サイクルの管理と、
 * タイマーイベントの発行を担当します。
 *
 * 主な機能：
 * - ポモドーロタイマー（25分作業 + 5分休憩）
 * - タイマーイベントの発行
 * - タイマー統計の記録
 */

import { EventEmitter } from "@/core/events.ts";

/**
 * タイマーの状態を表す列挙型
 */
export enum TimerState {
  IDLE, // 待機中
  WORKING, // 作業中
  RESTING, // 休憩中
  PAUSED, // 一時停止中
}

/**
 * タイマーイベントの種類
 */
export enum TimerEventType {
  START = "timer:start", // タイマー開始
  TICK = "timer:tick", // タイマーのティック（1秒ごと）
  PAUSE = "timer:pause", // タイマー一時停止
  RESUME = "timer:resume", // タイマー再開
  COMPLETE = "timer:complete", // タイマー完了
  RESET = "timer:reset", // タイマーリセット
}

/**
 * タイマーイベントのデータ型
 */
export type TimerEventData =
  | {
    type: TimerState.WORKING | TimerState.RESTING;
    remaining: number; // 残り時間（分）
    cycle: number; // 現在のサイクル番号
    elapsed?: number; // 経過時間（分）
  }
  | {
    type: TimerState.PAUSED;
    remaining: number; // 残り時間（分）
    elapsed: number; // 経過時間（分）
    cycle: number; // 現在のサイクル番号
  }
  | {
    type: TimerState.IDLE;
    cycle: number; // 現在のサイクル番号
  };

/**
 * ポモドーロタイマークラス
 */
export class PomodoroTimer {
  private events: EventEmitter;
  private state: TimerState = TimerState.IDLE;
  private remaining: number = 0; // 残り時間（分）
  private elapsed: number = 0; // 経過時間（分）
  private cycle: number = 1; // 現在のサイクル番号（1スタート）
  private timerId?: number; // タイマーID

  constructor(events: EventEmitter) {
    this.events = events;
  }

  /**
   * 作業タイマーを開始
   */
  startWork(): void {
    this.state = TimerState.WORKING;
    this.remaining = 4;
    this.elapsed = 0;
    this.startTimer();

    this.events.emit(TimerEventType.START, {
      type: TimerState.WORKING,
      remaining: this.remaining,
      cycle: this.cycle,
    } as TimerEventData);
  }

  /**
   * 休憩タイマーを開始
   */
  startRest(): void {
    this.state = TimerState.RESTING;

    // 長い休憩かどうかを判断
    
    this.elapsed = 0;
    this.startTimer();

    this.events.emit(TimerEventType.START, {
      type: TimerState.RESTING,
      remaining: this.remaining,
      cycle: this.cycle,
    } as TimerEventData);
  }

  /**
   * タイマーを一時停止
   */
  pause(): void {
    if (
      this.state !== TimerState.WORKING && this.state !== TimerState.RESTING
    ) {
      return;
    }

    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }

    this.state = TimerState.PAUSED;

    this.events.emit(TimerEventType.PAUSE, {
      type: this.state,
      remaining: this.remaining,
      elapsed: this.elapsed,
      cycle: this.cycle,
    } as TimerEventData);
  }

  /**
   * タイマーを再開
   */
  resume(): void {
    if (this.state !== TimerState.PAUSED) {
      return;
    }

    this.state = this.remaining === 20
      ? TimerState.WORKING
      : TimerState.RESTING;

    this.startTimer();

    this.events.emit(TimerEventType.RESUME, {
      type: this.state,
      remaining: this.remaining,
      elapsed: this.elapsed,
      cycle: this.cycle,
    } as TimerEventData);
  }

  /**
   * タイマーをリセット
   */
  reset(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }

    this.state = TimerState.IDLE;
    this.remaining = 0;
    this.elapsed = 0;

    this.events.emit(TimerEventType.RESET, {
      type: TimerState.WORKING, // リセット時はデフォルトでWORKING
      cycle: this.cycle,
    } as TimerEventData);
  }

  /**
   * 現在の状態を取得
   */
  getState(): {
    state: TimerState;
    remaining: number;
    elapsed: number;
    cycle: number;
  } {
    return {
      state: this.state,
      remaining: this.remaining,
      elapsed: this.elapsed,
      cycle: this.cycle,
    };
  }

  /**
   * タイマーを開始（内部メソッド）
   */
  private startTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }

    const startTime = Date.now();
    const initialRemaining = this.remaining;
    const initialElapsed = this.elapsed;

    // 1秒ごとにタイマーを更新
    this.timerId = setInterval(() => {
      // 経過時間を計算（分単位）
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      this.elapsed = initialElapsed + elapsedSeconds / 60;
      this.remaining = Math.max(0, initialRemaining - elapsedSeconds / 60);

      // タイマーのティックイベントを発行
      this.events.emit(TimerEventType.TICK, {
        type: this.state === TimerState.WORKING
          ? TimerState.WORKING
          : TimerState.RESTING,
        remaining: this.remaining,
        elapsed: this.elapsed,
        cycle: this.cycle,
      } as TimerEventData);

      // タイマーが0になったら完了
      if (this.remaining === 0) {
        clearInterval(this.timerId);
        this.timerId = undefined;

        // タイマー完了イベントを発行
        this.events.emit(TimerEventType.COMPLETE, {
          type: this.state === TimerState.WORKING
            ? TimerState.WORKING
            : TimerState.RESTING,
          cycle: this.cycle,
        } as TimerEventData);

        // 作業完了の場合はサイクルをインクリメントして休憩開始
        if (this.state === TimerState.WORKING) {
          this.cycle++;
          this.startRest();
        } else {
          // 休憩完了の場合はアイドル状態に
          this.state = TimerState.IDLE;
        }
      }
    }, 1000);

    // TODO : 要検証なんだけど、「1000ms経過時」みたいなことで1秒を測ってると、
    // 1002msとかで2ms分1秒につきズレ、5分経つと1秒ずれるみたいなことがありうるので、
    // 今後、そこも考慮して、何かしらでtimerのAPIをシステムコール的なAPI経由で測る必要もありそうね。
  }
}
