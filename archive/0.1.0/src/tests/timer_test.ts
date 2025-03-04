/**
 * timer_test.ts
 *
 * 目的：
 * タイマーモジュールの機能をテストします。
 *
 * テスト内容：
 * - タイマーの基本機能（開始、一時停止、再開、リセット）
 * - タイマーイベントの発行
 * - タイマーの状態管理
 */

import { assertEquals } from "jsr:@std/assert";
import { assertSpyCall, spy } from "jsr:@std/testing/mock";
import { PomodoroTimer, TimerEventType, TimerState } from "@/timer/mod.ts";
import { EventEmitter } from "@/core/events.ts";
import { Config } from "@/core/config.ts";

// モックの設定
class MockConfig extends Config {
  constructor() {
    // 環境変数にアクセスしないよう、明示的にconfigPathを渡す
    super("./test-config.json");
  }

  override get<K extends keyof import("../core/config.ts").ConfigData>(
    key: K,
  ): import("../core/config.ts").ConfigData[K] {
    if (key === "timer") {
      return {
        workDuration: 25,
        restDuration: 5,
        longRestDuration: 15,
        longRestInterval: 4,
      } as unknown as import("../core/config.ts").ConfigData[K];
    }
    return super.get(key);
  }
}

// タイマーの基本機能テスト
Deno.test("PomodoroTimer - 基本機能", () => {
  const events = new EventEmitter();
  const config = new MockConfig();
  const timer = new PomodoroTimer(events, config);
  // 初期状態の確認
  const initialState = timer.getState();
  console.log(JSON.stringify(initialState));
  assertEquals(initialState.state, TimerState.IDLE);
  assertEquals(initialState.remaining, 0);
  assertEquals(initialState.elapsed, 0);
  assertEquals(initialState.cycle, 1);

  // 作業タイマー開始
  timer.startWork();
  const workingState = timer.getState();
  assertEquals(workingState.state, TimerState.WORKING);
  assertEquals(workingState.remaining, 25);
  assertEquals(workingState.elapsed, 0);

  // タイマー一時停止
  timer.pause();
  const pausedState = timer.getState();
  assertEquals(pausedState.state, TimerState.PAUSED);

  // タイマー再開
  timer.resume();
  const resumedState = timer.getState();
  assertEquals(resumedState.state, TimerState.WORKING);

  // タイマーリセット
  timer.reset();
  const resetState = timer.getState();
  assertEquals(resetState.state, TimerState.IDLE);
  assertEquals(resetState.remaining, 0);
  assertEquals(resetState.elapsed, 0);
});

// タイマーイベント発行テスト
Deno.test("PomodoroTimer - イベント発行", () => {
  const events = new EventEmitter();
  const config = new MockConfig();

  // イベントハンドラのスパイを設定
  const startSpy = spy();
  const pauseSpy = spy();
  const resumeSpy = spy();
  const resetSpy = spy();

  events.on(TimerEventType.START, startSpy);
  events.on(TimerEventType.PAUSE, pauseSpy);
  events.on(TimerEventType.RESUME, resumeSpy);
  events.on(TimerEventType.RESET, resetSpy);

  const timer = new PomodoroTimer(events, config);

  // 作業タイマー開始
  timer.startWork();
  assertSpyCall(startSpy, 0);
  assertEquals(startSpy.calls[0].args[0].type, TimerState.WORKING);

  // タイマー一時停止
  timer.pause();
  assertSpyCall(pauseSpy, 0);

  // タイマー再開
  timer.resume();
  assertSpyCall(resumeSpy, 0);

  // タイマーリセット
  timer.reset();
  assertSpyCall(resetSpy, 0);
});

// 休憩タイマーテスト
Deno.test("PomodoroTimer - 休憩タイマー", () => {
  const events = new EventEmitter();
  const config = new MockConfig();
  const timer = new PomodoroTimer(events, config);

  // 休憩タイマー開始
  timer.startRest();
  const restingState = timer.getState();
  assertEquals(restingState.state, TimerState.RESTING);
  assertEquals(restingState.remaining, 5); // 通常の休憩時間

  // タイマーをリセットしてリークを防止
  timer.reset();
});

// TODO: タイマーの時間経過をシミュレートするテスト
// 注：実際の時間経過をテストするには、時間を操作するモックが必要
