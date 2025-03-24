export function splitStringByCommas(
  input: string | undefined
): string[] | void {
  if (input) return input.split(",").map((item) => item.trim());
}
