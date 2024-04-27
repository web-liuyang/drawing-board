import { DrawingBoard } from "./lib";

(window => {
  const oApp = document.getElementById("app")!;
  const drawingBoard = new DrawingBoard({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  drawingBoard.ensureInitialized();

  oApp.appendChild(drawingBoard.node);
})(window)!;
