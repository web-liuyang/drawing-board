import type { CanvasEventStateMachine, Graph } from ".";
import {
  Toolbar,
  SelectionEventStateMachine,
  CircleEventStateMachine,
  RectangleEventStateMachine,
  AnyEventStateMachine,
  ToolButton,
  GraphController,
  HistoryController,
  InteractiveCanvas,
  Statusbar,
  PropertyPanel,
} from ".";

import "./style/global.css";

const ToolButtonToDrawState = {
  [ToolButton.Selection]: SelectionEventStateMachine,
  [ToolButton.Circle]: CircleEventStateMachine,
  [ToolButton.Rectangle]: RectangleEventStateMachine,
  [ToolButton.Any]: AnyEventStateMachine,
};

const DrawStateToToolButton = {
  [SelectionEventStateMachine.name]: ToolButton.Selection,
  [CircleEventStateMachine.name]: ToolButton.Circle,
  [RectangleEventStateMachine.name]: ToolButton.Rectangle,
  [AnyEventStateMachine.name]: ToolButton.Any,
};

class ApplicationState {
  graphs: Graph[] = [];
}

interface ApplicationOptions {
  container: HTMLElement;
  width: number;
  height: number;
}

export class Application {
  private readonly container: HTMLElement;

  private width: number;

  private height: number;

  public readonly toolbar: Toolbar;

  public readonly statusbar: Statusbar;

  public readonly propertyPanel: PropertyPanel;

  public readonly interactiveCanvas: InteractiveCanvas;

  public readonly graphController: GraphController = new GraphController();

  public readonly historyController: HistoryController<ApplicationState> = new HistoryController<ApplicationState>([
    { graphs: [] },
  ]);

  public drawState: CanvasEventStateMachine = new SelectionEventStateMachine(this);

  constructor(options: ApplicationOptions) {
    this.container = options.container;
    this.width = options.width;
    this.height = options.height;

    // Canvas
    this.interactiveCanvas = new InteractiveCanvas({
      width: this.width,
      height: this.height,
      event: {
        onMatrixChange: () => {
          this.drawGraphs();
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
          this.statusbar.update({ position: this.interactiveCanvas.toGlobal([e.clientX, e.clientY]) });
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
            this.toolbar.update(ToolButton.Selection);
            this.statusbar.update({ stateText: ToolButton.Selection });
            this.drawState = new SelectionEventStateMachine(this);
          }
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
        this.toolbar.update(button);

        const DrawState = ToolButtonToDrawState[button];
        if (DrawState) {
          this.drawState = new DrawState(this);
          this.statusbar.update({ stateText: button });
        }
      },
    });

    // Statusbar
    this.statusbar = new Statusbar();

    // propertyPanel
    this.propertyPanel = new PropertyPanel({
      onChangedGraph: graph => {
        this.graphController.updateGraph(graph.id, graph);
        this.propertyPanel.update(graph);
      },
    });

    // GraphController
    this.graphController.addListener(() => {
      const selectedGraph = this.graphController.selectedGraphs[0];
      if (this.propertyPanel.graph?.id !== selectedGraph?.id) {
        this.propertyPanel.update(selectedGraph);
      }

      this.drawGraphs();
    });

    this.container.append(this.interactiveCanvas.node, this.toolbar.node, this.statusbar.node, this.propertyPanel.node);
  }

  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.interactiveCanvas.resize(width, height);
    this.drawGraphs();
  }

  private drawGraphs(): void {
    this.interactiveCanvas.update();
    const ctx = this.interactiveCanvas.ctx;
    const graphs = this.graphController.graphs;

    for (const graph of graphs) {
      graph.paint(ctx);
      if (graph.selected) graph.towingPointPaint(ctx);
    }
  }

  public render(): void {
    this.drawGraphs();
    this.toolbar.render(ToolButton.Selection);
    this.statusbar.render([0, 0], ToolButton.Selection);
  }

  public saveState() {
    const graphs = this.graphController.graphs;
    this.historyController.push({ graphs });
  }
}
