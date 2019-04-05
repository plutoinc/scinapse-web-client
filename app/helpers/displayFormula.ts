declare var KaTeX: any;

export function formulaeToHTMLStr(rawString: string | null): string {
  if (!rawString) {
    return "";
  }

  const result = [];
  const latexRegex = RegExp(/\$((.|\n)+?)\$/, "g");

  let lastIdx = 0;
  let match;

  while (true) {
    match = latexRegex.exec(rawString);

    if (match === null) {
      break;
    }

    if (lastIdx < match.index) {
      result.push(rawString.substring(lastIdx, match.index));
    }

    try {
      result.push(KaTeX.renderToString(match[1]));
    } catch (_err) {
      result.push(match[1]);
    }

    lastIdx = latexRegex.lastIndex + 1;
  }

  if (lastIdx < rawString.length) {
    result.push(rawString.substring(lastIdx, rawString.length));
  }

  return result.join("");
}
