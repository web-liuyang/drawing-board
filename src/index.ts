import { DrawingBoard, Toolbar } from "./lib";
import { Circle } from "./lib/graph/circle";
import { Rectangle } from "./lib/graph/rectangle";

(window => {
  const oApp = document.getElementById("app")!;
  const drawingBoard = new DrawingBoard({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  drawingBoard.ensureInitialized();
  drawingBoard.controller.addGraph(new Circle({ id: 1, center: [0, 0], radius: 50 }));
  drawingBoard.controller.addGraph(new Rectangle({ id: 2, width: 100, height: 100, center: [100, 100] }));
  drawingBoard.render();

  const toolbar = new Toolbar();
  toolbar.ensureInitialized();
  toolbar.render();

  oApp.appendChild(drawingBoard.node);
  oApp.appendChild(toolbar.node);
})(window)!;
