export function removeElementChild(node: Node, deep: boolean = true) {
  while (node.firstChild) {
    if (deep && node.firstChild.hasChildNodes()) {
      removeElementChild(node.firstChild, deep);
    }

    node.removeChild(node.firstChild);
  }
}
