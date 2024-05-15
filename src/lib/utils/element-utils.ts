export function removeElementChild(node: Node, deep: boolean = true) {
  while (node.firstChild) {
    if (deep && node.firstChild.hasChildNodes()) {
      removeElementChild(node.firstChild, deep);
    }

    node.removeChild(node.firstChild);
  }
}

const root = document.querySelector(":root")! as HTMLHtmlElement;
export function getRootProperyValue(name: string) {
  return getComputedStyle(root).getPropertyValue(name);
}

export function setRootProperyValue(name: string, value: string) {
  return root.style.setProperty(name, value);
}
