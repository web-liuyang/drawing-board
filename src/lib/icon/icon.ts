export function iconName(name: string): `codicon codicon-${string}` {
  return `codicon codicon-${name}`;
}

export function icon(name: string): HTMLElement {
  const oI = document.createElement("i");
  oI.className = iconName(name);
  return oI;
}
