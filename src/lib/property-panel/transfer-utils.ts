import type { FormGroup, Option } from "../dynamic-form";
import type { FormValues } from "../dynamic-form/dynamic-form-component";
import { Any, Fill, Graph, Rectangle, Stroke, Style } from "../graph";
import { Circle, StrokeCap, StrokeJoin } from "../graph";
import { isNumberCorrect } from "../constant/regexp";

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
        label: "X",
        name: "x",
        value: circle.center[0].toString(),
        onValid(value) {
          if (value === "") return "X cannot be empty";
          if (!isNumberCorrect(value)) return "X must be a number";
        },
      },
      {
        componentType: "input",
        label: "Y",
        name: "y",
        value: circle.center[1].toString(),
        onValid(value) {
          if (value === "") return "Y cannot be empty";
          if (!isNumberCorrect(value)) return "Y must be a number";
        },
      },
      {
        componentType: "input",
        label: "Radius",
        name: "radius",
        value: circle.radius.toString(),
        onValid(value) {
          if (value === "") return "Radius cannot be empty";
          if (!isNumberCorrect(value)) return "Radius must be a number";
          if (Number(value) < 1) return "Radius cannot be less than 1";
        },
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
        onValid(value) {
          if (value === "") return "X cannot be empty";
          if (!isNumberCorrect(value)) return "X must be a number";
        },
      },
      {
        componentType: "input",
        label: "Y",
        name: "y",
        value: rectangle.y1.toString(),
        onValid(value) {
          if (value === "") return "Y cannot be empty";
          if (!isNumberCorrect(value)) return "Y must be a number";
        },
      },
      {
        componentType: "input",
        label: "Width",
        name: "width",
        value: rectangle.width.toString(),
        onValid(value) {
          if (value === "") return "Width cannot be empty";
          if (!isNumberCorrect(value)) return "Width must be a number";
          if (Number(value) < 1) return "Width cannot be less than 1";
        },
      },
      {
        componentType: "input",
        label: "Height",
        name: "height",
        value: rectangle.height.toString(),
        onValid(value) {
          if (value === "") return "Height cannot be empty";
          if (!isNumberCorrect(value)) return "Height must be a number";
          if (Number(value) < 1) return "Height cannot be less than 1";
        },
      },
    ],
  };
}

function anyGeneralFormGroup(any: Any): FormGroup {
  return {
    name: "Point",
    formItems: [
      {
        componentType: "point",
        label: "Point",
        name: "point",
        value: any.points,
        onValid(value) {
          for (let index = 0, length = value.length; index < length; index++) {
            const [x, y] = value[index];
            if (!isNumberCorrect(x)) {
              return `Index: ${index}, Point x must be a number`;
            }

            if (!isNumberCorrect(y)) {
              return `Index: ${index}, Point y must be a number`;
            }
          }
        },
      },
    ],
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
        onValid(value) {
          if (value === "") return "Stroke color cannot be empty";
        },
      },
      {
        componentType: "input",
        label: "Stroke Width",
        name: "strokeWidth",
        value: style.stroke.width.toString(),
        onValid(value) {
          if (value === "") return "Stroke width cannot be empty";
          if (!isNumberCorrect(value)) return "Stroke width must be a number";
          if (Number(value) < 1) return "Stroke width cannot be less than 1";
          if (Number(value) > 10) return "Stroke width cannot be greater than 10";
        },
      },
      {
        componentType: "select",
        label: "Stroke Cap",
        name: "strokeCap",
        value: style.stroke.cap,
        options: strokeCapOptions,
        onValid(value) {
          if (value === "") return "Stroke cap cannot be empty";
          if (!strokeCapOptions.some(option => option.value === value)) return "Stroke cap is invalid";
        },
      },
      {
        componentType: "select",
        label: "Stroke Join",
        name: "strokeJoin",
        value: style.stroke.join,
        options: strokeJoinOptions,
        onValid(value) {
          if (value === "") return "Stroke join cannot be empty";
          if (!strokeJoinOptions.some(option => option.value === value)) return "Stroke join is invalid";
        },
      },
      {
        componentType: "input",
        label: "Fill Color",
        name: "fillColor",
        value: style.fill.color,
        onValid(value) {
          if (value === "") return "Fill color cannot be empty";
        },
      },
    ],
  };
}

export function formValuesToGraph(formValues: FormValues, graph: Graph): Graph {
  if (graph instanceof Circle) {
    return graph.copyWith({
      center: [Number(formValues.x), Number(formValues.y)],
      radius: Number(formValues.radius),
      style: createStyleByFormValues(formValues),
    });
  }

  if (graph instanceof Rectangle) {
    return graph.copyWith({
      x1: Number(formValues.x),
      y1: Number(formValues.y),
      x2: Number(formValues.x) + Number(formValues.width),
      y2: Number(formValues.y) + Number(formValues.height),
      style: createStyleByFormValues(formValues),
    });
  }

  if (graph instanceof Any) {
    return graph.copyWith({
      points: formValues.point as Point[],
      style: createStyleByFormValues(formValues),
    });
  }

  throw new Error("not support graph type: " + graph.constructor.name);
}

export function createStyleByFormValues(formValues: FormValues): Style {
  return new Style({
    stroke: new Stroke({
      color: formValues.strokeColor as string,
      width: Number(formValues.strokeWidth),
      cap: formValues.strokeCap as StrokeCap,
      join: formValues.strokeJoin as StrokeJoin,
    }),
    fill: new Fill({
      color: formValues.fillColor as string,
    }),
  });
}
