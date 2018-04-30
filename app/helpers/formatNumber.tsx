export default function formatNumber(rawNumber: number): string {
  if (rawNumber < 10000) {
    return rawNumber.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  } else if (rawNumber >= 10000 && rawNumber < 1000000) {
    return `${Math.floor(rawNumber / 1000)}k+`;
  } else if (rawNumber >= 1000000) {
    return `${Math.floor(rawNumber / 100000) / 10}m+`;
  }
}
