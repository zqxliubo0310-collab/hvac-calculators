const integerFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const moneyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatInt(value: number): string {
  return integerFormat.format(Math.round(value));
}

export function formatFixed(value: number, digits: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatTons(value: number): string {
  return formatFixed(value, 2);
}

export function formatMoney(value: number): string {
  return moneyFormat.format(Math.round(value));
}

export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}
