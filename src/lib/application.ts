import type { CanvasEventStateMachine, Graph } from ".";
import {
  Toolbar,
  SelectionEventStateMachine,
  CircleEventStateMachine,
  RectangleEventStateMachine,
  ToolButton,
  GraphController,
  HistoryController,
  InteractiveCanvas,
  Matrix,
  Statusbar,
} from ".";

const ToolButtonToDrawState = {
  [ToolButton.Selection]: SelectionEventStateMachine,
  [ToolButton.Circle]: CircleEventStateMachine,
  [ToolButton.Rectangle]: RectangleEventStateMachine,
};

const DrawStateToToolButton = {
  [SelectionEventStateMachine.name]: ToolButton.Selection,
  [CircleEventStateMachine.name]: ToolButton.Circle,
  [RectangleEventStateMachine.name]: ToolButton.Rectangle,
};

class ApplicationState {
  graphs: Graph[] = [];
}

export class Application {
  public readonly toolbar: Toolbar;

  public readonly statusbar: Statusbar;

  private readonly container: HTMLElement;

  public readonly interactiveCanvas: InteractiveCanvas;

  public readonly graphController: GraphController = new GraphController();

  public readonly historyController: HistoryController<ApplicationState> = new HistoryController<ApplicationState>([
    { graphs: [] },
  ]);

  public drawState: CanvasEventStateMachine = new SelectionEventStateMachine(this);

  constructor(container: HTMLElement) {
    this.container = container;

    // Canvas
    this.interactiveCanvas = new InteractiveCanvas({
      width: window.innerWidth,
      height: window.innerHeight,
      event: {
        onMatrixChange: (matrix: Matrix) => {
          this.render();
        },
        onKeydown: (e: KeyboardEvent) => {
          this.drawState.onKeydown(e);
        },
        onMousedown: (e: MouseEvent) => {
          this.drawState.onMousedown(e);
        },
        onWheel: (e: WheelEvent) => {
          this.drawState.onWheel(e);
        },
        onMousemove: (e: MouseEvent) => {
          this.drawState.onMousemove(e);
          this.statusbar.mousePosition = this.interactiveCanvas.toGlobal([e.clientX, e.clientY]);
          this.render();
        },
        onMouseup: (e: MouseEvent) => {
          this.drawState.onMouseup(e);
        },
        onEscape: () => {
          const name = this.drawState.constructor.name;
          const toolButton: ToolButton | undefined = DrawStateToToolButton[name];
          if (!toolButton) {
            this.drawState.onEscape();
          } else {
            this.toolbar.seletedToolButton = ToolButton.Selection;
            this.statusbar.stateText = ToolButton.Selection;
          }
          this.render();
        },
      },
    });

    // Toolbar
    this.toolbar = new Toolbar({
      onClick: (button: ToolButton) => {
        if (button === ToolButton.Backward) {
          this.historyController.backward();
          const { graphs } = this.historyController.state;
          this.graphController.setGraphs(graphs);
          return;
        }

        if (button === ToolButton.Forward) {
          this.historyController.forward();
          const { graphs } = this.historyController.state;
          this.graphController.setGraphs(graphs);
          return;
        }

        if (this.toolbar.seletedToolButton === button) return;
        this.toolbar.seletedToolButton = button;
        const DrawState = ToolButtonToDrawState[button];
        if (DrawState) {
          this.drawState = new DrawState(this);
          this.statusbar.stateText = button;
        }
        this.render();
      },
    });

    this.statusbar = new Statusbar();
    this.statusbar.stateText = ToolButton.Selection;

    this.graphController.addListener(() => {
      this.render();
    });

    this.container.append(this.interactiveCanvas.node, this.toolbar.node, this.statusbar.node);
  }

  private drawGraphs(ctx: CanvasRenderingContext2D, graphs: Graph[]): void {
    for (const graph of graphs) {
      graph.paint(ctx);
      if (graph.selected) graph.towingPointPaint(ctx);
    }
  }

  public render(): void {
    this.interactiveCanvas.render();
    this.drawGraphs(this.interactiveCanvas.ctx, this.graphController.graphs);
    this.toolbar.render();
    this.statusbar.render();
  }

  public saveState() {
    const graphs = this.graphController.graphs;
    this.historyController.push({ graphs });
  }
}
