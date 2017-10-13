export default function formatNumber(number: number, fractionDigits: number) {
  const uselessNumberArray = [];
  for (let i = 0; i < fractionDigits; i++) {
    uselessNumberArray.push(0);
  }

  const uselessNumber = uselessNumberArray.join("");
  const targetRegex = new RegExp(`[.,]${uselessNumber}$`);

  return number.toFixed(fractionDigits).replace(targetRegex, "");
}
