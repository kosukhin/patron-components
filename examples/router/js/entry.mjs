import { Text } from "patron-components";

const main = () => {
  const date = new Text(".page-date");
  date.give(new Date().toLocaleString());
};

export { main };
