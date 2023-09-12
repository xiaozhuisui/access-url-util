const inquirer = require("inquirer");
const { program } = require("commander");
const { i18nUtil } = require("./index");
const { exec } = require("child_process");
const packageJson = require("../package.json");

async function processMain(
  pathname: string = process.argv[2],
  files?: string[]
) {
  const srcIndex = pathname.indexOf("src");
  let pathStr = pathname.slice(srcIndex);
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
  let targetPath = "";
  if (files) {
    targetPath = files
      .map((fileName: string) => {
        return (pathStr + fileName);
      })
      .join(" ");
  }
  const childProcess = exec(
    "npx prettier -w " + (targetPath || pathStr),
    (error, stdout, stderr) => {
      if (error) {
        console.error(`执行出错：${error}`);
        return;
      }
      setTimeout(() => {
        i18nUtil(
          pathStr,
          files?.map((fileName: string) => ({
            fileName,
          }))
        );
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

function main() {
  program
    .version(packageJson.version, "-v", "--version")
    .option(
      "-f, --files <files...>",
      "同一文件目录下 单独格式化的文件名 开头需包含路径符号"
    )
    .requiredOption("-p, --path <path>", "批量格式化的文件目录路径")
    .description("i18n提效工具 power by zhuisui")
    .action((args: { files: string[]; path: string }) => {
      const { path, files } = args;
      if (path) {
        processMain(path, files);
      }
    })
    .parse(process.argv);
}
module.exports = main;
