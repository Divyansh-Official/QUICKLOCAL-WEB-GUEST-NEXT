/** Formatting that client components need without importing the data layer. */
export const rupees = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export function fillLive(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
