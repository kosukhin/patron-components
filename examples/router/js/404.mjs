import { Link } from "patron-components";

const main = () => {
  const link = new Link(window.currentPage, window.basePathSource);
  link.watchClick(".navigation");
};

export { main };
