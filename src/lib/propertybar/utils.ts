import type { FormGroup, Option } from "../dynamic-form";
import { Any, Fill, Graph, Rectangle, Stroke, Style } from "../graph";
import { Circle, StrokeCap, StrokeJoin } from "../graph";

export const strokeCapOptions: Option[] = Object.keys(StrokeCap).map(key => ({
  value: key,
  label: key,
}));

export const strokeJoinOptions: Option[] = Object.keys(StrokeJoin).map(key => ({
  value: key,
  label: key,
}));

export function graphToFormGroups(graph: Graph): FormGroup[] {
  if (graph instanceof Circle) {
    return circleFormGroups(graph);
  }

  if (graph instanceof Rectangle) {
    return rectangleFormGroups(graph);
  }

  if (graph instanceof Any) {
    return anyFormGroups(graph);
  }

  throw new Error("not support graph type: " + graph.constructor.name);
}

function circleFormGroups(circle: Circle): FormGroup[] {
  return [infoFormGroup(circle), circleGeneralFormGroup(circle), styleFormGroup(circle.style)];
}

function rectangleFormGroups(rectangle: Rectangle): FormGroup[] {
  return [infoFormGroup(rectangle), rectangleGeneralFormGroup(rectangle), styleFormGroup(rectangle.style)];
}

function anyFormGroups(any: Any): FormGroup[] {
  return [infoFormGroup(any), anyGeneralFormGroup(any), styleFormGroup(any.style)];
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

function rectangleGeneralFormGroup(rectangle: Rectangle): FormGroup {
  return {
    name: "General",
    formItems: [
      {
        componentType: "input",
        label: "X",
        name: "x",
        value: rectangle.x1.toString(),
      },
      {
        componentType: "input",
        label: "Y",
        name: "y",
        value: rectangle.y1.toString(),
      },
      {
        componentType: "input",
        label: "Width",
        name: "width",
        value: rectangle.width.toString(),
      },
      {
        componentType: "input",
        label: "Height",
        name: "height",
        value: rectangle.height.toString(),
      },
    ],
  };
}

function anyGeneralFormGroup(any: Any): FormGroup {
  // TODO Point
  return {
    name: "Point",
    formItems: [],
  };
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
    return graph.copyWith({
      center: [Number(formValues.x), Number(formValues.y)],
      radius: Number(formValues.radius),
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

  if (graph instanceof Rectangle) {
    return graph.copyWith({
      x1: Number(formValues.x),
      y1: Number(formValues.y),
      x2: Number(formValues.x) + Number(formValues.width),
      y2: Number(formValues.y) + Number(formValues.height),
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

  if (graph instanceof Any) {
    return graph.copyWith({
      // points: formValues.vertices.split(",").map(v => [Number(v), Number(v)]),
      points: graph.points,
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
