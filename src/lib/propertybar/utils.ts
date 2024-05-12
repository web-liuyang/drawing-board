import type { FormGroup, Option } from "../dynamic-form";
import { Fill, Graph, Stroke, Style } from "../graph";
import { Circle, StrokeCap, StrokeJoin } from "../graph";

export const strokeCapOptions: Option[] = Object.keys(StrokeCap).map(key => ({
  value: key,
  label: key,
}));

export const strokeJoinOptions: Option[] = Object.keys(StrokeJoin).map(key => ({
  value: key,
  label: key,
}));

function circleFormGroups(circle: Circle): FormGroup[] {
  return [infoFormGroup(circle), circleGeneralFormGroup(circle), styleFormGroup(circle.style)];
}

export function graphToFormGroups(graph: Graph): FormGroup[] {
  if (graph instanceof Circle) {
    return circleFormGroups(graph);
  }

  throw new Error("not support graph type: " + graph.constructor.name);
}

export function infoFormGroup(graph: Graph): FormGroup {
  return {
    name: "Info",
    formItems: [
      {
        componentType: "info",
        label: "shape",
        name: "shape",
        value: graph.type,
      },
      {
        componentType: "info",
        label: "id",
        name: "id",
        value: graph.id.toString(),
      },
    ],
  };
}

function circleGeneralFormGroup(circle: Circle): FormGroup {
  return {
    name: "General",
    formItems: [
      {
        componentType: "input",
        label: "Radius",
        name: "radius",
        value: circle.radius.toString(),
      },
      {
        componentType: "input",
        label: "X",
        name: "x",
        value: circle.center[0].toString(),
      },
      {
        componentType: "input",
        label: "Y",
        name: "y",
        value: circle.center[1].toString(),
      },
    ],
  };
}

function styleFormGroup(style: Style): FormGroup {
  return {
    name: "Style",
    formItems: [
      {
        componentType: "input",
        label: "Stroke Color",
        name: "strokeColor",
        value: style.stroke.color,
      },
      {
        componentType: "input",
        label: "Stroke Width",
        name: "strokeWidth",
        value: style.stroke.width.toString(),
      },
      {
        componentType: "select",
        label: "Stroke Cap",
        name: "strokeCap",
        value: style.stroke.cap,
        options: strokeCapOptions,
      },
      {
        componentType: "select",
        label: "Stroke Join",
        name: "strokeJoin",
        value: style.stroke.join,
        options: strokeJoinOptions,
      },
      {
        componentType: "input",
        label: "Fill Color",
        name: "fillColor",
        value: style.fill.color,
      },
    ],
  };
}

export function formValuesToGraph(formValues: Record<string, string>, graph: Graph): Graph {
  if (graph instanceof Circle) {
    return new Circle({
      id: graph.id,
      center: [Number(formValues.x), Number(formValues.y)],
      radius: Number(formValues.radius),
      selected: graph.selected,
      editing: graph.editing,
      style: new Style({
        stroke: new Stroke({
          color: formValues.strokeColor,
          width: Number(formValues.strokeWidth),
          cap: formValues.strokeCap as StrokeCap,
          join: formValues.strokeJoin as StrokeJoin,
        }),
        fill: new Fill({
          color: formValues.fillColor,
        }),
      }),
    });
  }

  throw new Error("not support graph type: " + graph.constructor.name);
}
