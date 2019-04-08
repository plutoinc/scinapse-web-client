export default function formatNumber(rawNumber: number | undefined | null): string {
  if (!rawNumber) {
    return "0";
  }

  if (rawNumber < 10000) {
    return rawNumber.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  } else if (rawNumber >= 10000 && rawNumber < 100000) {
    return `${Math.round(rawNumber / 100) / 10}k`;
  } else if (rawNumber >= 100000 && rawNumber < 1000000) {
    return `${Math.round(rawNumber / 1000)}k`;
  } else if (rawNumber >= 1000000) {
    return `${Math.round(rawNumber / 100000) / 10}m`;
  } else {
    return rawNumber.toString();
  }
}
