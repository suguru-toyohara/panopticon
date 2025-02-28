#!/usr/bin/env deno run

// 引数が渡されているかチェック
if (Deno.args.length === 0) {
  console.error("使い方: timer <秒数>");
  Deno.exit(1);
}

// 第一引数を秒数として取得
const seconds = parseInt(Deno.args[0]);
if (isNaN(seconds) || seconds <= 0) {
  console.error("正しい秒数を指定してください");
  Deno.exit(1);
}

console.log(`タイマー開始: ${seconds}秒`);

let remaining = seconds;
const timer = setInterval(() => {
  remaining--;
  if (remaining > 0) {
    // 残り時間を表示
    console.log(`${remaining}秒残り...`);
  } else {
    console.log("タイムアップ！");
    // アラート用にベル文字を出力（環境により音が鳴る場合も）
    console.log("\u0007");
    clearInterval(timer);
  }
}, 1000);
