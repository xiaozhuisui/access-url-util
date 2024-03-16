import { REGEX, SEPARATOR, getFileAbsolutePath } from "@/utils/index";
const fs = require("fs");

const inquirer = require("inquirer");
const { program } = require("commander");
const { exec } = require("child_process");
const packageJson = require("/package.json");

interface IFilesExcelDataListItem {
  code: string;
  path: string; //url
  filePath: string; //文件位置
}

const filesExcelDataList: IFilesExcelDataListItem[] = [];

function handleFileCodeJSONString(fileContent: string, filePath: string) {
  const fileContentArray = fileContent.split(SEPARATOR);
  const modifyContentString = fileContentArray
    .map((item) => {
      // 表面是被注释的
      if ((item.match(REGEX.ANNOTATION) as any[])?.length >= 2) {
        return item;
      }
      const componentsName = item.match(REGEX.COMPONENT)?.[1];
      const matchName = item.match(REGEX.NAME)
      const nameString = matchName?.[1];
      if (nameString === "login") return item;
      const pathString = item.match(REGEX.PATH)?.[1];
      let codeName = item.match(REGEX.CODE)?.[1];
      const annotationCodeName = item.match(REGEX.ANNOTATION_CODE)?.[0];
      // 确定是不是组件 有些不是组件
      if (componentsName) {
        // 如果是组件 确定有没有code
        if (!codeName || annotationCodeName) {
          // 获取名称 通过名称判断
          codeName = nameString + "-" + "page";
          // todo
          item = item.replace(matchName?.[0] as string, (match) => {
            console.log(matchName);
            if (
              nameString === "viewSplitRules"
            ) {
              debugger;
            }
            return `${match},\n code: '${codeName}'`;
          });
        }
        filesExcelDataList.push({
          code: codeName,
          path: ((process.argv[process.argv.length - 1] as string) +
            pathString) as string,
          filePath: `.src/pages/${componentsName}`,
        });
      }
      return item;
    })
    .join(SEPARATOR);
  console.log(filesExcelDataList);
  console.log(modifyContentString);
  fs.writeFileSync(filePath, modifyContentString);
}

function handleFileCode(filePath: string) {
  let fileContentJSONString: string = fs.readFileSync(
    getFileAbsolutePath(filePath),
    "utf8"
  );
  handleFileCodeJSONString(
    fileContentJSONString,
    getFileAbsolutePath(filePath)
  );
}

async function processRoute() {
  // const { confirm } = await inquirer.prompt([
  //   {
  //     type: "confirm",
  //     name: "confirm",
  //     message: "将进行代码格式化以及权限处理 请进行代码备份！",
  //     default: false,
  //   },
  // ]);
  // if (!confirm) {
  //   // 终止线程
  //   process.exit(1);
  // }
  const pretterFilePaths = [
    "./config/route/*",
    "./config/Route/*",
    "./config/Routes/*",
    "./config/Routers/*",
    "./config/routes.ts",
  ];
  const childProcess = exec(
    "npx prettier -w " +
      pretterFilePaths.map((path) => getFileAbsolutePath(path)).join(" ")
  );
  childProcess.stdout.on("data", (data: string) => {
    data.split("ms\n").forEach((filePath) => {
      if (filePath) {
        console.log(
          `正在格式化文件并准备处理文件权限编码: ${filePath.split(" ")[0]}`
        );
        console.log(`${filePath.split(" ")[0]}`);
        handleFileCode(`./${filePath.split(" ")[0]}`);
      }
    });
  });

  childProcess.on("close", (code) => {
    const secondProcess = exec(
      "npx prettier -w " +
        pretterFilePaths.map((path) => getFileAbsolutePath(path)).join(" ")
    );
    secondProcess.on("close", (code) => {
      console.log(`格式化结束，退出码：${code}`);
    });
  });
}

function main() {
  program
    .version(packageJson.version, "-v", "--version")
    .requiredOption("-p, --public <public>", "子应用公共路径 如 /retail")
    .description("路由配置code以及扫描对应路径工具 power by zhuisui")
    .action((params) => {
      processRoute();
    })
    .parse(process.argv);
}
export { main };
