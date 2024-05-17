import { Application } from "./lib";

(window => {
  const oApp = document.getElementById("app")!;
  const application = Application.create(oApp);
  application.render();
})(window)!;
