import { recordifyComment, initialComment, Comment } from "../comment";
import { initialMember, recordifyMember } from "../member";

describe("Comment record model", () => {
  let mockComment: Comment;

  describe("CommentStateFactory", () => {
    describe("when there is no params", () => {
      it("should return recordified state", () => {
        expect(recordifyComment().toString()).toContain("Record");
      });

      it.skip("should return same value with initial state", () => {
        expect(recordifyComment().toJS()).toEqual(initialComment);
      });
    });

    describe("when there are params", () => {
      const mockId = 233232;
      const mockPaperId = 223;
      const mockCreatedAt = "201624324";
      const mockCreatedBy = initialMember;
      const mockCommentContent = "sfdfds";

      beforeEach(() => {
        mockComment = {
          id: mockId,
          paperId: mockPaperId,
          createdAt: mockCreatedAt,
          createdBy: mockCreatedBy,
          comment: mockCommentContent,
        };
      });

      it("should return recoridfied state", () => {
        expect(recordifyComment(mockComment).toString()).toContain("Record");
      });

      it("should return same value with params value", () => {
        expect(recordifyComment(mockComment).toJS()).toEqual(mockComment);
      });

      it("should return same id with params", () => {
        expect(recordifyComment(mockComment).id).toEqual(mockId);
      });

      it("should return same paperId value with params", () => {
        expect(recordifyComment(mockComment).paperId).toEqual(mockPaperId);
      });

      it("should return same createdAt value with params", () => {
        expect(recordifyComment(mockComment).createdAt).toEqual(mockCreatedAt);
      });

      it("should return recordified createdBy value with params", () => {
        expect(JSON.stringify(recordifyComment(mockComment).createdBy)).toEqual(
          JSON.stringify(recordifyMember(mockCreatedBy)),
        );
      });

      it("should return same comment content value with params", () => {
        expect(recordifyComment(mockComment).comment).toEqual(mockCommentContent);
      });
    });
  });
});
