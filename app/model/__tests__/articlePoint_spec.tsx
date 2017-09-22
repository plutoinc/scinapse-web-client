import { ArticlePointFactory, initialArticlePoint, IArticlePoint } from "../articlePoint";
import { RAW } from "../../__mocks__";

describe("ArticlePoint record model", () => {
  let mockArticlePoint: IArticlePoint;

  describe("ArticlePointStateFactory", () => {
    describe("when there is no params", () => {
      it("should return recordified state", () => {
        expect(
          ArticlePointFactory()
            .toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return same value with initial state", () => {
        expect(ArticlePointFactory().toJS()).toEqual(initialArticlePoint);
      });
    });

    describe("when there are params", () => {
      beforeEach(() => {
        mockArticlePoint = RAW.ARTICLE_POINT;
      });

      it("should return recoridfied state", () => {
        expect(
          ArticlePointFactory(mockArticlePoint)
            .toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return same value with params value", () => {
        expect(ArticlePointFactory(mockArticlePoint).toJS()).toEqual(mockArticlePoint);
      });
    });
  });
});
