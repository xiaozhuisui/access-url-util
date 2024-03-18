import { REGEX, SEPARATOR, createExcel, getFileAbsolutePath } from "@/utils/index";
const fs = require("fs");

const inquirer = require("inquirer");
const { program } = require("commander");
const { exec } = require("child_process");
const packageJson = require("/package.json");

export interface IFilesExcelDataListItem {
  code: string;
  path: string; //url
  filePath: string; //文件位置
  hideInMenu?: boolean;
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
      const hideInMenu = item.match(REGEX.HIDEINMENU)?.[0];

      // 确定是不是组件 有些不是组件
      if (componentsName) {
        // 如果是组件 确定有没有code
        if (!codeName || annotationCodeName) {
          // 获取名称 通过名称判断
          codeName = nameString + "-" + "page";
          // todo
          item = item.replace(matchName?.[0] as string, (match) => {
            return `${match},\n code: '${codeName}'`;
          });
        }
        filesExcelDataList.push({
          code: codeName,
          path: ((process.argv[process.argv.length - 1] as string) +
            pathString) as string,
          // todo
          filePath: `/pages/${componentsName}`,
          hideInMenu: hideInMenu ? true : undefined,
        });
      }
      return item;
    })
    .join(SEPARATOR);
  console.log(modifyContentString);
  fs.writeFileSync(filePath, modifyContentString);
}

function handleFileCode(filePath: string) {
  let fileContentJSONString: string = fs.readFileSync(
    getFileAbsolutePath(filePath),
    "utf8"
  );
  debugger
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
    "./config/route/*.ts",
    "./config/Route/*.ts",
    "./config/Router/*.ts",
    "./config/Routes/*.ts",
    "./config/Routers/*.ts",
    "./config/routes.ts",
  ];
  const childProcess = exec(
    "npx prettier -w " +
      pretterFilePaths.map((path) => getFileAbsolutePath(path)).join(" ")
  );
  childProcess.stdout.on("data", (data: string) => {
    debugger
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
    // 再进行一遍格式化
    const secondProcess = exec(
      "npx prettier -w " +
        pretterFilePaths.map((path) => getFileAbsolutePath(path)).join(" ")
    );
    const headers = [
      { header: "统一资源标识符", key: "path", width: 80 },
      { header: "权限编码", key: "code", width: 80 },
      { header: "文件位置", key: "filePath", width: 80 },
      { header: "是否非菜单页面", key: "hideInMenu", width: 30 },
    ];
    createExcel(headers,filesExcelDataList)
    secondProcess.on("close", (code) => {
      console.log(`路由添加权限编码结束，退出码：${code}`);
      // 其实也没啥必要 就是想玩玩
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

