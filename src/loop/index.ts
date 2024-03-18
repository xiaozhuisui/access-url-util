
import { CONTENT_SEPARATOR, ENDSUFFIX, IURLITEM, PREFIX_SUFFIX, REGEX, SEPARATOR, createExcel, getComponentPath, getFileAbsolutePath, getHideInMenu, getTargetCode, getUrlString, readExcel } from "@/utils/index";

import * as path from "path";
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

const urlExcelDataList: IURLITEM[] = [];

function handleFileContentJSONString(
  fileContent: string,
  filePath: string,
  isHideInMenu: boolean,
  code:string
) {
  const fileContentStringArray = fileContent.split(CONTENT_SEPARATOR);
  const gatherSubComponentsPath:string[]=[]
  fileContentStringArray.forEach((item, index) => {
    // 被注释的
    if ((item.match(REGEX.ANNOTATION) as any[])?.length) {
      return item;
    }
    // const componentsStringObj = item.match(REGEX.IMPORT);
    // 子组件的路径
    // const componentsPath = componentsStringObj?.[1];
    const componentsPath = getComponentPath(item);
    // debugger
    if (componentsPath) {
      gatherSubComponentsPath.push(componentsPath);
    }
    // const URLStringObj = item.match(REGEX.URL);
    const URLString = getUrlString(item);
    // if (URLStringObj?.length) {
    //   debugger
    // }
    const codeNameList: string[] = [code];
    let methodName: string = "";
    if (URLString) {
      for (let idx = Math.min(0, index - 5); idx < index + 5; idx++) {
        const codeName = fileContentStringArray[idx]?.match(REGEX.CODE)?.[1];
        if (codeName || !isHideInMenu) {
          codeNameList.push(codeName as string);
        }
        if (idx > index) {
          methodName =
            (
              fileContentStringArray[idx].match(REGEX.METHOD)?.[1] as string
            )?.toLocaleLowerCase?.();
        }
      }
      if(methodName){
      // debugger
      }
      urlExcelDataList.push({
        code: codeNameList.join(" | "),
        url: URLString.replace("'",""),
        method: methodName||"get",
        todo: codeNameList.length > 2,
        methodNameTodo:methodName?false:true
      });
    }
  });
  if (gatherSubComponentsPath.length) {
    debugger;
    const childProcess = exec(
      "npx prettier -w " +
        gatherSubComponentsPath
          .map((item) =>
            [".ts", ...ENDSUFFIX]
              .map((subffix) => path.join(filePath, item, subffix))
              .join(" ")
          )
          .join(" ")
    );
    childProcess.stdout.on("data", (data: string) => {
      data.split("ms\n").forEach((filePath) => {
        if (filePath) {
          console.log(`正在处理引用文件: ${filePath.split(" ")[0]}`);
          debugger;
          // handleGatherUrlData(dataSource, `./${filePath.split(" ")[0]}`);
        }
      });
    });
  }
}

function handleGatherUrlData(dataSource:IFilesExcelDataListItem[],filePath: string) {
  let fileContentJSONString: string = fs.readFileSync(
    getFileAbsolutePath(filePath),
    "utf8"
  );
  const isHideInMenu = getHideInMenu(dataSource, filePath.replace("./src", ""));
  const code = getTargetCode(dataSource, filePath.replace("./src", ""));
  handleFileContentJSONString(
    fileContentJSONString,
    getFileAbsolutePath(filePath),
    isHideInMenu,
    code
  );
}

async function processLoop() {
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

  const dataSource = await readExcel<IFilesExcelDataListItem>([
    "path",
    "code",
    "filePath",
    "hideInMenu",
  ]);

  const childProcess = exec(
    "npx prettier -w " +
      dataSource
        .map((item) =>
          ENDSUFFIX
            .map((subffix) =>
              getFileAbsolutePath(`./src/${item.filePath}${subffix}`)
            )
            .join(" ")
        )
        .join(" ")
  );
  childProcess.stdout.on("data", (data: string) => {
    data.split("ms\n").forEach((filePath) => {
      if (filePath) {
        console.log(
          `正在格式化文件并准备处理文件权限编码: ${filePath.split(" ")[0]}`
        );
        console.log(`${filePath.split(" ")[0]}`);
        handleGatherUrlData(dataSource,`./${filePath.split(" ")[0]}`);
      }
    });
  });
}

function loop() {
  program
    .version(packageJson.version, "-v", "--version")
    .requiredOption("-p, --public <public>", "子应用公共路径 如 /retail")
    .description("路由配置code以及扫描对应路径工具 power by zhuisui")
    .action((params) => {
      processLoop();
    })
    .parse(process.argv);
}
export { loop };
