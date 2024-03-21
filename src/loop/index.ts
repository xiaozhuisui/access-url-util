
import { CONTENT_SEPARATOR, DOU_SEPARATOR, ENDSUFFIX, IURLITEM, PREFIX_SUFFIX, REGEX, SEPARATOR, URLItemHeaders, getComponentPath, getFileAbsolutePath, getHideInMenu, getTargetCode, getTargetURIPath, getUrlString, readExcel, updateExcel } from "@/utils/index";
import moment from "moment";
import * as path from "path";
const fs = require("fs");

const { program } = require("commander");
const { exec } = require("child_process");
const packageJson = require("/package.json");
let startTime=0
export interface IFilesExcelDataListItem {
  code: string;
  path: string; //url
  filePath: string; //文件位置
  hideInMenu?: boolean;
}

const urlExcelDataList: IURLITEM[] = [];
const filerGatherSubComponentsPathList:string[]=[]
let readExcelDataSource:IFilesExcelDataListItem[] = [];
const readExcelDataSourceMap: Record<string,IFilesExcelDataListItem> = {};

function handleFileContentJSONString(
  fileContent: string,
  filePath: string,
  isHideInMenu: boolean,
  code:string,
  uri:string,
  isSub?:boolean,
  parentPath?:string
) {
  let fileContentStringArray: any = fileContent.split(CONTENT_SEPARATOR);
  fileContentStringArray = fileContentStringArray.map((item, index) => {
    return item.split(DOU_SEPARATOR).map(mItem=>mItem.split("\n"));
  }).flat(Infinity)
  const gatherSubComponentsPath:string[]=[]
  fileContentStringArray.forEach((item, index) => {

    // debugger
    // 被注释的
    // todo
    if (
      !item ||
      (item?.match(REGEX.ANNOTATION) as any[])?.length
    ) {
      return item;
    }
    // const componentsStringObj = item.match(REGEX.IMPORT);
    // 子组件的路径
    // const componentsPath = componentsStringObj?.[1];
    const componentsPath = getComponentPath(item).replaceAll("'", "");
    // debugger
    if (componentsPath) {
      gatherSubComponentsPath.push(componentsPath);
    }
    // const URLStringObj = item.match(REGEX.URL);
    const URLString = getUrlString(item,isSub);
    // if (URLStringObj?.length) {
    //   debugger
    // }
    const codeNameList: string[] = [];
    if(code){
    codeNameList.push(code);
  }
    let methodName: string = "";
    if (URLString) {
      for (let idx = Math.max(0, index - 5); idx < index + 5; idx++) {
        const codeName = fileContentStringArray[idx]?.match(REGEX.CODE)?.[1];
        if (codeName?.trim?.() && !isHideInMenu) {
          codeNameList.push(codeName as string);
        }
        if (idx > index) {
          try {
            const str = fileContentStringArray[idx];
            const resultMethod = (
              str?.match(REGEX.METHOD)?.[1] as string
            )?.toLocaleLowerCase?.();
            if (resultMethod) {
              methodName = resultMethod;
            }
          } catch (error) {
            if (isSub) {
              debugger;
            }
          }
        }
      }
      urlExcelDataList.push({
        code: codeNameList.join(" | "),
        url: URLString.replace("'",""),
        method: methodName||"get",
        methodNameTodo:methodName?false:true,
        filePath:filePath.split("/src")[1],
        isSub,
        path:uri,
        hideInMenu:isHideInMenu,
        parentPath:parentPath?.split("/src")?.[1]
      });
    }
  });
  const filerGatherSubComponentsPath=gatherSubComponentsPath.filter(item=>!item.includes('.less')||!item.includes('.svg')).map(item=>item.replaceAll("'",''))
  if (filerGatherSubComponentsPath.length) {
    filerGatherSubComponentsPathList.push(JSON.stringify(gatherSubComponentsPath))
    const childProcess = exec(
      "npx prettier -w " +
        filerGatherSubComponentsPath
          .map((item) =>{
            const targetPathArray = (filePath as string).split("/");
            targetPathArray.pop();
            const targetPath = targetPathArray.join("/");
            return [".ts", ...ENDSUFFIX]
              .map((subffix) =>
                path
                  .join(targetPath, item, subffix)
                  .replace("/.tsx", ".tsx")
                  .replace("/.ts", ".ts")
                  .replace("/.js", ".js")
                  .replace(";", "")
              )
              .join(" ");
          }
          )
          .join(" ")
    );
    childProcess.stdout.on("data", (data: string) => {
      data.split("ms\n").forEach((cFilePath) => {
        if (cFilePath) {
          // debugger
          const targetFilePath = getFileAbsolutePath(cFilePath.split(" ")[0])
          let fileContentJSONString: string = fs.readFileSync(
            targetFilePath,
            "utf8"
          );
          if (!fileContentJSONString) return;
          handleFileContentJSONString(fileContentJSONString,targetFilePath,isHideInMenu,code,uri,true,filePath)
        }
      });
    });
    childProcess.on("close", () => {
      function checkMethod(url: string) {
        const checkList = ["list", "get", "detail", "List", "qp-"];
        return checkList.some((item) => url.includes(item));
      }
      const dataSource = urlExcelDataList.map((item) => ({
        ...item,
        methodNameTodo:
          item.method === "get" && checkMethod(item.url)
            ? false
            : item.methodNameTodo,
      }));

      setTimeout(() => {
        updateExcel(URLItemHeaders, [
          ...dataSource,
          // filerGatherSubComponentsPathList
        ],startTime);
      }, 5000);
    });
  }
}

function handleGatherUrlData(filePath: string,IFilesExcelDataListItem:IFilesExcelDataListItem) {
  let fileContentJSONString: string = "";
  try {
    fileContentJSONString = fs.readFileSync(
      filePath,
      "utf8"
    );
    readExcelDataSourceMap[filePath.replace("./src/pages", "")] = IFilesExcelDataListItem;
  } catch (error) {
    return
  }
  if (!fileContentJSONString?.trim?.()) return;
    const isHideInMenu = getHideInMenu(
      readExcelDataSourceMap,
      filePath.replace("./src/pages", "")
    );
    const code = getTargetCode(
      readExcelDataSourceMap,
      filePath.replace("./src/pages", "")
    );
    const uriPath = getTargetURIPath(
      readExcelDataSourceMap,
      filePath.replace("./src/pages", "")
    );
    handleFileContentJSONString(
      fileContentJSONString,
      filePath,
      isHideInMenu,
      code,
      uriPath
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

  readExcelDataSource = await readExcel<IFilesExcelDataListItem>([
    "path",
    "code",
    "filePath",
    "hideInMenu",
  ]);
  const childProcess = exec(
    "npx prettier -w "+getFileAbsolutePath("/src/pages/*")
  );
  childProcess.stdout.on("data", (data: string) => {
    console.log("解析的文件",data);
    // 格式化的文件
  });

  childProcess.on("close", (code) => {
    console.log('正则编写excel文件',code)
     readExcelDataSource.forEach((item) => {
      ENDSUFFIX.forEach((subffix) => {
        const filePath = getFileAbsolutePath(
          `./src/${item.filePath}${subffix}`
        );
        // debugger
        handleGatherUrlData(filePath,item)
      });
    });
  });
}

function loop() {
  program
    .version(packageJson.version, "-v", "--version")
    .requiredOption("-p, --public <public>", "子应用公共路径 如 /retail")
    .description("路由配置code以及扫描对应路径工具 power by zhuisui")
    .action((params) => {
       startTime= Date.now()
      processLoop();

    })
    .parse(process.argv);
}
export { loop };
