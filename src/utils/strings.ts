export function isString(s: unknown) {
  return typeof (s) === 'string' || s instanceof String;
}

export function isDigit(s: string) {
  return /^\d+$/.test(s)
}
