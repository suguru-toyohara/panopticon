#!/usr/bin/env deno run --allow-read --allow-write --allow-env --allow-net

import { Core } from "@/core/mod.ts";
import { console } from "./core/logger.ts";

async function main() {
  console.info("パノプティコン - 起動中...");

  try {
    const core = new Core();
    await core.initialize();
    await core.start();
  } catch (error) {
    console.error("エラーが発生しました:", error);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
