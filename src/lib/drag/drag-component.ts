import "./index.css";

export interface DragComponentOptions {
  direction: ["top", "left"] | ["top", "right"] | ["bottom", "left"] | ["bottom", "right"];
  getSize: () => [number, number];
  setSize: (size: [number, number]) => void;
}

export class DragComponent implements Component {
  private oDrag: HTMLElement;

  public get node(): HTMLElement {
    return this.oDrag;
  }

  constructor(options: DragComponentOptions) {
    this.oDrag = document.createElement("div");
    this.oDrag.className = "drag";

    this.oDrag.addEventListener("mousedown", e => {
      this.oDrag.classList.add("active");
      const [x, y] = [e.clientX, e.clientY];
      const size = options.getSize();

      const onMousemove = (e: MouseEvent) => {
        e.preventDefault();
        const [dx, dy] = [e.clientX - x, e.clientY - y];
        const w = options.direction[1] === "left" ? size[0] - dx : size[0] + dx;
        const h = options.direction[0] === "top" ? size[1] - dy : size[1] + dy;

        options.setSize([w, h]);
      };

      const onMouseup = () => {
        this.oDrag.classList.remove("active");
        window.removeEventListener("mousemove", onMousemove, false);
        window.removeEventListener("mouseup", onMouseup, false);
      };

      window.addEventListener("mousemove", onMousemove, false);
      window.addEventListener("mouseup", onMouseup, false);
    });
  }

  public clean(): void {}

  public update(): void {}

  public render(): void {}
}
