export function iconName(name: string) {
  return `codicon codicon-${name}`;
}

export function icon(name: string) {
  const oI = document.createElement("i");
  oI.className = iconName(name);
  return oI;
}
