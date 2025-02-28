import { EventEmitter } from "./events.ts";
import { Config } from "./config.ts";
import { console } from "./logger.ts";

export class Core {
  private events: EventEmitter;
  private config: Config;

  constructor() {
    this.events = new EventEmitter();
    this.config = new Config();
  }

  async initialize(): Promise<void> {
    console.debug("コアシステムを初期化中...");
    await this.config.load();

    // 各モジュールの初期化処理をここに追加
  }

  // TODO : asyncにlinterマークついてるけど、これは気にしない。あとでawait書くから。
  async start(): Promise<void> {
    console.debug("パノプティコンを起動中...");

    // 各モジュールの起動処理をここに追加

    console.debug("パノプティコンが起動しました。");
  }
}

export { EventEmitter } from "./events.ts";
export { Config } from "./config.ts";
