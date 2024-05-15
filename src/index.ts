import { Application } from "./lib";

(window => {
  const oApp = document.getElementById("app")!;
  const application = new Application({
    container: oApp,
  });
  application.render();
})(window)!;
