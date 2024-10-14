const { execSync } = require("child_process");

function getGitBranch() {
  const res = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" });
  return res.trim();
}

module.exports = {
  types: [
    {
      value: "feat",
      name: "feat: Добавление нового функционала",
    },
    {
      value: "refactor",
      name: "refactor: Правки кода без исправления ошибок или добавления новых функций",
    },
    {
      value: "fix",
      name: "fix: Исправление ошибок",
    },
    {
      value: "build",
      name: "build: Сборка проекта или изменения внешних зависимостей",
    },
    {
      value: "docs",
      name: "docs: Обновление документации",
    },
    {
      value: "docs",
      name: "docs: Правки по документации проекта или отдельных частей проекта",
    },
    {
      value: "test",
      name: "test: Добавление тестов",
    },
  ],
  scopes: [
    {
      name: getGitBranch(),
    },
  ],

  allowCustomScopes: true,

  allowBreakingChanges: false,

  subjectLimit: 72,
};
