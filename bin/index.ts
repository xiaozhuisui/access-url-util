#!/usr/bin/env node
const inquirer = require("inquirer");
const { i18nUtil } = require("../lib/index");
const { exec } = require("child_process");

async function index() {
  const pathname = process.argv[2];
  const srcIndex = pathname.indexOf("src");
  const pathStr = pathname.slice(srcIndex);
  if (!pathname) {
    console.log("请输入路径名参数");
    process.exit(1);
  } else if (!pathname.includes("src")) {
    console.log("路径名不合法");
    process.exit(1);
  }

  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "将进行代码格式化以及多语言处理 未提交代码出问题风险自负！",
      default: false,
    },
  ]);
  if (!confirm) {
    // 终止线程
    process.exit(1);
  }
  console.log("预计需要1~2分钟，请耐心等待...");
  const childProcess = exec(
    "npx prettier -w " + pathStr,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`执行出错：${error}`);
        return;
      }
      setTimeout(() => {
      i18nUtil(pathStr);
      }, 100);
    }
  );
  childProcess.stdout.on("data", (data) => {
    console.log(`正在格式化文件: ${data}`);
  });
  childProcess.on('close', (code) => {
  console.log(`格式化结束，退出码：${code}`);
});
}
index();
