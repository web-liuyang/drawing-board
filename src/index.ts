import { DrawingBoard, Toolbar } from "./lib";
import {
  SelectionEventStateMachine,
  CircleEventStateMachine,
  RectangleEventStateMachine,
} from "./lib/canvas/canvas-event-state-machine";

import { Circle, generateUUID } from "./lib/graph";
import { Rectangle } from "./lib/graph";
import { ToolState } from "./lib/toolbar/toolbar";

(window => {
  const oApp = document.getElementById("app")!;
  const drawingBoard = new DrawingBoard({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  drawingBoard.ensureInitialized();
  drawingBoard.graphController.addGraph(new Circle({ id: generateUUID(), center: [0, 0], radius: 50 }));
  drawingBoard.graphController.addGraph(
    new Rectangle({ id: generateUUID(), width: 100, height: 100, center: [100, 100] }),
  );
  drawingBoard.render();

  const toolbar = new Toolbar();
  toolbar.ensureInitialized();
  toolbar.render();

  toolbar.state.addListener((state: ToolState) => {
    const ToolStateToCanvasState = {
      [ToolState.Selection]: SelectionEventStateMachine,
      [ToolState.Circle]: CircleEventStateMachine,
      [ToolState.Rectangle]: RectangleEventStateMachine,
    };

    const canvasState = ToolStateToCanvasState[state];
    drawingBoard.setCanvasState(canvasState);
  });

  oApp.appendChild(drawingBoard.node);
  oApp.appendChild(toolbar.node);
})(window)!;
