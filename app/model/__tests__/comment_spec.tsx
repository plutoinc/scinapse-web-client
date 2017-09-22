import { initialComment, IComment, recordifyComment } from "../comment";
import { RAW } from "../../__mocks__";

describe("Comment record model", () => {
  let mockComment: IComment;

  describe("recordifyComment", () => {
    describe("when there is no params", () => {
      it("should return recordified state", () => {
        expect(
          recordifyComment()
            .toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return same value with initial state", () => {
        expect(recordifyComment().toJS()).toEqual(initialComment);
      });
    });

    describe("when there are params", () => {
      beforeEach(() => {
        mockComment = RAW.COMMENT;
      });

      it("should return recordified state", () => {
        expect(
          recordifyComment(mockComment)
            .toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return recordifed createdBy", () => {
        expect(
          recordifyComment(mockComment)
            .createdBy.toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return same email with recordifed createdBy", () => {
        expect(recordifyComment(mockComment).createdBy.email).toEqual(RAW.COMMENT.createdBy.email);
      });
    });
  });
});
