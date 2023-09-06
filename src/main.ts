const inquirer = require("inquirer");
const { i18nUtil } = require("./index");
const { exec } = require("child_process");

async function main() {
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
  childProcess.on("close", (code) => {
    console.log(`格式化结束，退出码：${code}`);
  });
}
module.exports = main;
