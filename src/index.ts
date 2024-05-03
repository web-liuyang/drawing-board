import { Application } from "./lib";

(window => {
  const oApp = document.getElementById("app")!;
  const application = new Application(oApp);
  application.render();
})(window)!;
