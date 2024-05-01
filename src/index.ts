import type { CanvasEventStateMachine } from "./lib/canvas/canvas-event-state-machine";
import {
  DrawingBoard,
  Toolbar,
  SelectionEventStateMachine,
  CircleEventStateMachine,
  RectangleEventStateMachine,
  Circle,
  Rectangle,
  generateUUID,
  ToolState,
} from "./lib";

const ToolStateToDrawState = {
  [ToolState.Selection]: SelectionEventStateMachine,
  [ToolState.Circle]: CircleEventStateMachine,
  [ToolState.Rectangle]: RectangleEventStateMachine,
};

const DrawStateToToolState = {
  [SelectionEventStateMachine.name]: ToolState.Selection,
  [CircleEventStateMachine.name]: ToolState.Circle,
  [RectangleEventStateMachine.name]: ToolState.Rectangle,
};

(window => {
  const oApp = document.getElementById("app")!;
  const drawingBoard = new DrawingBoard({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  drawingBoard.ensureInitialized();
  drawingBoard.graphController.addGraph(
    new Circle({ id: generateUUID(), center: [0, 0], radius: 50, selected: false }),
  );
  drawingBoard.graphController.addGraph(
    new Circle({ id: generateUUID(), center: [100, 0], radius: 50, selected: false }),
  );
  drawingBoard.graphController.addGraph(
    Rectangle.fromCenter({ id: generateUUID(), width: 100, height: 100, x: 0, y: 0, selected: false }),
  );
  drawingBoard.graphController.addGraph(
    Rectangle.fromCenter({ id: generateUUID(), width: 100, height: 100, x: 100, y: 100, selected: false }),
  );
  drawingBoard.render();

  const toolbar = new Toolbar();
  toolbar.ensureInitialized();
  toolbar.render();

  toolbar.state.addListener((state: ToolState) => {
    const canvasState = ToolStateToDrawState[state];
    drawingBoard.setDrawState(canvasState);
  });

  drawingBoard.drawState.addListener((state: CanvasEventStateMachine) => {
    const toolbarState: ToolState | undefined = DrawStateToToolState[state.constructor.name];
    if (!toolbarState) return;
    toolbar.state.value = toolbarState;
  });

  oApp.appendChild(drawingBoard.node);
  oApp.appendChild(toolbar.node);
})(window)!;
