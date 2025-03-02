/**
 * config/utils.ts
 *
 * 目的：
 * 設定関連のユーティリティ関数を提供します。
 */

/**
 * オブジェクトをマージする
 * シンプルなマージを行い、トップレベルのプロパティのみマージします
 * 
 * @param target マージ先のオブジェクト
 * @param source マージ元のオブジェクト
 * @returns マージされたオブジェクト
 */
export function mergeConfig<T>(
  target: T,
  source: Partial<T>,
): T {
  // スプレッド演算子を使用してシンプルにマージ
  return { ...target, ...source };
}
