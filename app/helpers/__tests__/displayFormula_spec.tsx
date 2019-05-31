import { formulaeToHTMLStr } from '../displayFormula';

describe('formulaeToHTMLStr helper', () => {
  let sentence: string;

  describe('when there is LaTex in the given string', () => {
    beforeEach(() => {
      sentence = 'Let $A:Y\to X$ be a linear map and $Ksubseteq X$ be a regular closed convex cone.';
    });

    // TODO: Revive below
    it.skip('should return proper HTML string', () => {
      expect(formulaeToHTMLStr(sentence)).toContain(
        // prettier-ignore
        "Let <span class=\"katex\"><span class=\"katex-mathml\"><math><semantics><mrow><mi>A</mi><mo>:</mo><mi>Y</mi><mi>o</mi><mi>X</mi></mrow><annotation encoding=\"application/x-tex\">A:Y  o X</annotation></semantics></math></span><span class=\"katex-html\" aria-hidden=\"true\"><span class=\"base\"><span class=\"strut\" style=\"height:0.68333em;vertical-align:0em;\"></span><span class=\"mord mathdefault\">A</span><span class=\"mspace\" style=\"margin-right:0.2777777777777778em;\"></span><span class=\"mrel\">:</span><span class=\"mspace\" style=\"margin-right:0.2777777777777778em;\"></span></span><span class=\"base\"><span class=\"strut\" style=\"height:0.68333em;vertical-align:0em;\"></span><span class=\"mord mathdefault\" style=\"margin-right:0.22222em;\">Y</span><span class=\"mord mathdefault\">o</span><span class=\"mord mathdefault\" style=\"margin-right:0.07847em;\">X</span></span></span></span>be a linear map and <span class=\"katex\"><span class=\"katex-mathml\"><math><semantics><mrow><mi>K</mi><mi>s</mi><mi>u</mi><mi>b</mi><mi>s</mi><mi>e</mi><mi>t</mi><mi>e</mi><mi>q</mi><mi>X</mi></mrow><annotation encoding=\"application/x-tex\">Ksubseteq X</annotation></semantics></math></span><span class=\"katex-html\" aria-hidden=\"true\"><span class=\"base\"><span class=\"strut\" style=\"height:0.8888799999999999em;vertical-align:-0.19444em;\"></span><span class=\"mord mathdefault\" style=\"margin-right:0.07153em;\">K</span><span class=\"mord mathdefault\">s</span><span class=\"mord mathdefault\">u</span><span class=\"mord mathdefault\">b</span><span class=\"mord mathdefault\">s</span><span class=\"mord mathdefault\">e</span><span class=\"mord mathdefault\">t</span><span class=\"mord mathdefault\">e</span><span class=\"mord mathdefault\" style=\"margin-right:0.03588em;\">q</span><span class=\"mord mathdefault\" style=\"margin-right:0.07847em;\">X</span></span></span></span>be a regular closed convex cone."
      );
    });
  });

  describe("when there isn't LaTex in the given string", () => {
    beforeEach(() => {
      sentence = 'Hello World!';
    });

    it('should return proper HTML string', () => {
      expect(formulaeToHTMLStr(sentence)).toEqual('Hello World!');
    });
  });
});
