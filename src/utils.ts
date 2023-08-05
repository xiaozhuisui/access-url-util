const i18nNamepace: { [key: string]: Function } = {};
i18nNamepace.handI18n = function (
  fileName: string,
  localesGather: { [key: string]: "string" }
) {
  // 目前只处理ts 和 tsx
  if (/\.(ts|tsx)$/.test(fileName)) {
    debugger;
    return;
  }
};
module.exports = i18nNamepace;
