
import { EventEmitter } from "./events.ts";
import { console } from "./logger.ts";

export class Core {
  private events: EventEmitter;

  constructor() {
    this.events = new EventEmitter();
  }

  initialize(): void {
    console.debug("コアシステムを初期化中...");

    // 各モジュールの初期化処理をここに追加
  }

  // asyncメソッドにはawaitが必要
  start(): Promise<void> {
    console.debug("パノプティコンを起動中...");

    // 各モジュールの起動処理をここに追加

    console.debug("パノプティコンが起動しました。");
    return Promise.resolve();
  }
}

export { EventEmitter } from "./events.ts";
