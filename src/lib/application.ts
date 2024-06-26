import type { CanvasEventStateMachine, Graph } from ".";
import {
  SelectionEventStateMachine,
  CircleEventStateMachine,
  RectangleEventStateMachine,
  AnyEventStateMachine,
  ToolButton,
  GraphController,
  HistoryController,
  LayoutDesigner,
  Toolbar,
  GraphList,
  ResourcePanel,
  InteractiveCanvas,
  PropertyPanel,
  ControlPanel,
  Statusbar,
} from ".";
import { Log } from "@log";
import { getRootProperyValue } from "./utils/element-utils";

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
}

export class Application {
  private static _instance?: Application;

  public static get instance(): Application | undefined {
    return Application._instance;
  }

  public static create(container: HTMLElement): Application {
    if (!Application._instance) {
      Application._instance = new Application({ container });
    }

    return Application._instance;
  }

  private readonly container: HTMLElement;

  public readonly toolbar: Toolbar;

  public readonly graphList: GraphList;

  public readonly resourcePanel: ResourcePanel;

  public readonly interactiveCanvas: InteractiveCanvas;

  public readonly propertyPanel: PropertyPanel;

  public readonly controlPanel: ControlPanel;

  public readonly statusbar: Statusbar;

  private layoutDesigner: LayoutDesigner;

  public readonly graphController: GraphController = new GraphController();

  public readonly historyController: HistoryController<ApplicationState> = new HistoryController<ApplicationState>([
    { graphs: [] },
  ]);

  public drawState: CanvasEventStateMachine = new SelectionEventStateMachine(this);

  constructor(options: ApplicationOptions) {
    this.container = options.container;

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

    this.graphList = new GraphList({
      graphController: this.graphController,
    });

    this.resourcePanel = new ResourcePanel({
      graphList: this.graphList,
    });

    // Canvas
    const [canvasWidth, canvasHeight] = this.computeCanvasSize();
    this.interactiveCanvas = new InteractiveCanvas({
      width: canvasWidth,
      height: canvasHeight,
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
          const position = this.interactiveCanvas.toGlobal([e.offsetX, e.offsetY]);
          this.statusbar.update({ position });
        },
        onMouseup: (e: MouseEvent) => {
          this.drawState.onMouseup(e);
        },
        onClick: (e: MouseEvent) => {
          this.drawState.onClick(e);
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

    // PropertyPanel
    this.propertyPanel = new PropertyPanel({
      onChangedGraph: graph => {
        this.graphController.updateGraph(graph.id, graph);
        this.propertyPanel.update(graph);
      },
    });

    // ControlPanel
    this.controlPanel = new ControlPanel({
      consoleController: Log.controller,
      onResize: () => this.handleResize(),
    });

    // Statusbar
    this.statusbar = new Statusbar();

    // GraphController
    this.graphController.addListener(() => {
      const selectedGraph = this.graphController.selectedGraphs[0];
      if (this.propertyPanel.graph?.id !== selectedGraph?.id) {
        this.propertyPanel.update(selectedGraph);
      }

      this.drawGraphs();
    });

    this.layoutDesigner = new LayoutDesigner({
      resourcePanel: this.resourcePanel.node,
      toolbar: this.toolbar.node,
      interactiveCanvas: this.interactiveCanvas.node,
      propertyPanel: this.propertyPanel.node,
      controlPanel: this.controlPanel.node,
      statusbar: this.statusbar.node,
      onResize: () => {
        this.handleResize();
      },
    });

    this.container.append(this.layoutDesigner.node);

    window!.addEventListener("resize", () => this.handleResize(), false);
  }

  private handleResize() {
    const [canvasWidth, canvasHeight] = this.computeCanvasSize();
    this.interactiveCanvas.resize(canvasWidth, canvasHeight);
    this.drawGraphs();
  }

  private computeCanvasSize(): [number, number] {
    const { innerWidth, innerHeight } = window;

    const canvasWidth =
      innerWidth -
      parseFloat(getRootProperyValue("--main-left-width")) -
      parseFloat(getRootProperyValue("--main-right-width"));

    const canvasHeight =
      innerHeight -
      parseFloat(getRootProperyValue("--toolbar-height")) -
      parseFloat(getRootProperyValue("--control-panel-height")) -
      parseFloat(getRootProperyValue("--statusbar-height"));

    return [canvasWidth, canvasHeight];
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
    this.graphList.render();
    this.propertyPanel.render(this.graphController.selectedGraphs[0]);
    this.controlPanel.render();
    this.statusbar.render([0, 0], ToolButton.Selection);

    this.resourcePanel.render();
    this.layoutDesigner.render();
  }

  public saveState() {
    const graphs = this.graphController.graphs;
    this.historyController.push({ graphs });
  }
}
