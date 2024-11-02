import { Text } from "patron-components";

const main = () => {
  console.log("main");
  const date = new Text(".page-date");
  date.give(new Date().toLocaleString());
};

export { main };
