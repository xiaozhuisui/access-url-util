#!/usr/bin/env node
const { i18nUtil } = require("../lib/index");

const pathname = process.argv[2];
const srcIndex = pathname.indexOf("src");
if (!pathname) {
  console.log("请输入路径名参数");
  process.exit(1);
} else if (!pathname.includes("src")) {
  console.log("路径名不合法");
  process.exit(1);
}
i18nUtil(pathname.slice(srcIndex));
