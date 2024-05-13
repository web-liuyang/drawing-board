import { Application } from "./lib";

(window => {
  const oApp = document.getElementById("app")!;
  const application = new Application({
    container: oApp,
    width: window.innerWidth,
    height: window.innerHeight,
  });
  application.render();

  window.addEventListener("resize", () => {
    application.resize(window.innerWidth, window.innerHeight);
  });
})(window)!;
