export function keepTitleWordsTogether(value: string) {
  return value.replace(/-/g, "\u2011");
}
