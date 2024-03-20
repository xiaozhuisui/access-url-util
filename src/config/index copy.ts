
import { CONFIG_CONTENT_SEPARATOR, CONTENT_SEPARATOR, DOU_SEPARATOR, ENDSUFFIX, IURLITEM, PREFIX_SUFFIX, REGEX, SEPARATOR, getComponentPath, getFileAbsolutePath, getHideInMenu, getTargetCode, getTargetURIPath, getUrlString, readExcel, updateExcel } from "@/utils/index";

  const os = require('os');
import * as path from "path";
const fs = require("fs");

const { program } = require("commander");
const { exec } = require("child_process");
const packageJson = require("/package.json");

export interface IFilesExcelDataListItem {
  code: string;
  path: string; //url
  filePath: string; //文件位置
  hideInMenu?: boolean;
}


function handleFileContentJSONString(
  fileContent: string,
  dataSource: Record<string,IFilesExcelDataListItem[]>
) {
  let fileContentStringArray: any = fileContent.split(CONFIG_CONTENT_SEPARATOR);
  debugger
  fileContentStringArray.forEach((item, index) => {
    // 被注释的
    // todo
    if (!item||(item?.match(REGEX.ANNOTATION) as any[])?.length) {
      return item;
    }
    const pathString = item.match(REGEX.TH)?.[1];
    if (pathString) {
      const matchDataItem = dataSource[pathString];
      debugger
      if (matchDataItem) {
        debugger;
      }
    }
  });
}

function handleDataSource(
  dataSource: IFilesExcelDataListItem[]
): Record<string, IFilesExcelDataListItem[]> {
  const result: Record<string, IFilesExcelDataListItem[]> = {};
  dataSource.forEach((item) => {
    const { path } = item;
    const pathList = path.split(" & ");
    item.code = item.code.split(" | ")?.[1] || "";
    pathList.forEach((uri) => {
      if(result[uri]){
        result[uri].push(item)
      }else{
        result[uri] = [item]}
    })
  })
  return result;
}

function handleConfigJSONContent(dataSource:IFilesExcelDataListItem[],filePath: string) {
  let fileContentJSONString: string = fs.readFileSync(
    getFileAbsolutePath(filePath),
    "utf8"
  );
  if (!fileContentJSONString?.trim?.()) return;
  const resultDataSource: Record<string,IFilesExcelDataListItem[]>=handleDataSource(dataSource)
  handleFileContentJSONString(
    fileContentJSONString,
    resultDataSource
  );
}

async function processConfig() {
  const dataSource = await readExcel<IFilesExcelDataListItem>([
    "url",
    "method",
    "methodNameTodo",
    "code",
    "path",
    'filePath',
    "codeTodo",
    'parentPath',
    'isSub',
    'hideInMenu',
  ],2);
  const Map={"distribution":"drp"}
  const npxPrettier="npx prettier -w " +
      process.cwd() +"/src/pages/Test/RouteConfig/"+
      (Map[process.argv[process.argv.length - 1].slice(1)] ||
        process.argv[process.argv.length - 1].slice(1)) +
      ".ts"
  const absolutePath = path.join(
    process.cwd(),
  "./src/pages/Test/RouteConfig/" +
      (Map[process.argv[process.argv.length - 1].slice(1)] ||
        process.argv[process.argv.length - 1].slice(1)) +
      ".ts"
  );


// 获取当前用户的home目录（在Mac上通常是/Users/用户名）
const homeDir = os.homedir();

// 假设你的模块位于用户的Documents文件夹下
const modulePath = path.join(homeDir, '/Desktop/BITSUN/URGROUP/URFRONT/configure-platform-front/src/pages/Test/RouteConfig/', 'drp.js');
debugger
// 引入模块
const myModule = require(modulePath);
  debugger
  debugger
  const childProcess = exec(
    npxPrettier
  );
  childProcess.stdout.on("data", (data: string) => {
    console.log("解析的文件",data);
    data
      .split("ms\n")
      .filter((i) => i)
      .forEach((filePath) => {
        if (filePath) {
          console.log(
            `正在格式化文件并准备处理配置文件: ${filePath.split(" ")[0]}\n`
          );
          // console.log(`${filePath.split(" ")[0]}`);
          handleConfigJSONContent(dataSource, `./${filePath.split(" ")[0]}`);
        }
      });
  });
  childProcess.on("close", (code) => {
    // 再进行一遍格式化
    setTimeout(() => {
    exec(npxPrettier);
    console.log("程序运行结束");
    }, 5000);
  });
}

function config() {
  program
    .version(packageJson.version, "-v", "--version")
    .requiredOption("-p, --public <public>", "子应用公共路径 如 /retail")
    .description("路由配置code以及扫描对应路径工具 power by zhuisui")
    .action((params) => {
      processConfig();
    })
    .parse(process.argv);
}
export { config };
