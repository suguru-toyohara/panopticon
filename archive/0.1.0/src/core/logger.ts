/**
 * logger.ts
 *
 * 目的：
 * パノプティコンアプリケーション全体で一貫したロギング機能を提供します。
 * コンソール出力の代わりに使用し、将来的にはTUIへの表示やファイルへの保存など
 * 様々な出力先に対応できるようにします。
 *
 * 主な機能：
 * - 異なるログレベル（info, warn, error, debug）のサポート
 * - 構造化されたログメッセージ
 * - 将来的なTUI統合の準備
 * - console互換のインターフェース
 */

/**
 * ログレベルの定義
 */
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * ロガークラス - console互換のインターフェースを提供
 * もしかしたらこれ失敗するかも。
 */
class Console {
  private currentLogLevel: LogLevel = LogLevel.INFO;

  // TextEncoderを使わずに文字列をUint8Arrayに変換する
  private encodeString(str: string): Uint8Array {
    return new Uint8Array(Array.from(str).map((char) => char.charCodeAt(0)));
  }

  /**
   * ログレベルを設定する
   */
  setLogLevel(level: LogLevel): void {
    this.currentLogLevel = level;
  }

  /**
   * ログメッセージを出力する内部関数
   */
  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (level < this.currentLogLevel) return;

    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];

    // 現在は標準出力/標準エラー出力に出力
    // 将来的にはTUIコンポーネントに出力するように変更予定
    const output = level >= LogLevel.ERROR ? Deno.stderr : Deno.stdout;

    let logMessage = `[${timestamp}] ${levelName}: ${message}`;

    if (args.length > 0) {
      for (const arg of args) {
        if (arg instanceof Error) {
          logMessage += `\n${arg.stack || arg.message}`;
        } else {
          try {
            logMessage += `\n${JSON.stringify(arg, null, 2)}`;
          } catch {
            logMessage += `\n${String(arg)}`;
          }
        }
      }
    }

    output.write(this.encodeString(logMessage + "\n"));
  }

  /**
   * デバッグレベルのログを出力
   */
  debug(message: string, ...args: unknown[]): void {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  /**
   * 情報レベルのログを出力
   */
  info(message: string, ...args: unknown[]): void {
    this.log(LogLevel.INFO, message, ...args);
  }

  /**
   * 警告レベルのログを出力
   */
  warn(message: string, ...args: unknown[]): void {
    this.log(LogLevel.WARN, message, ...args);
  }

  /**
   * エラーレベルのログを出力
   */
  error(message: string, ...args: unknown[]): void {
    this.log(LogLevel.ERROR, message, ...args);
  }
}

// グローバルなロガーインスタンスをエクスポート
export const console = new Console();
