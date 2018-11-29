import * as KaTeX from "katex";

export function formulaeToHTMLStr(s: string): string {
  const result = [];
  const latexRegex = RegExp(/\$((.|\n)+?)\$/, "g");

  let lastIdx = 0;
  let match;
  while (true) {
    match = latexRegex.exec(s);
    if (match === null) {
      break;
    }

    if (lastIdx < match.index) {
      result.push(s.substring(lastIdx, match.index));
    }

    result.push(KaTeX.renderToString(match[1]));
    lastIdx = latexRegex.lastIndex + 1;
  }
  if (lastIdx < s.length) {
    result.push(s.substring(lastIdx, s.length - 1));
  }
  return result.join(" ");
}
