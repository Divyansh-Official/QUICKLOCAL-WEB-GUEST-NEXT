/** Formatting that client components need without importing the data layer. */
export const rupees = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export function fillLive(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** Rupees to the paisa when there are paise — a platform fee of ₹6.40 is not ₹6. */
export const rupeesExact = (n: number) =>
  `₹${n.toLocaleString('en-IN', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;
