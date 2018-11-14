jest.mock("../icons/index.tsx");
jest.mock("../helpers/htmlWrapper.tsx");

import { getPathWithQueryParams } from "../server";
import getQueryParamsObject from "../helpers/getQueryParamsObject";

describe("server side rendering test", () => {
  describe("getPathWithQueryParams function", () => {
    describe("when the function get null queryParams as argument", () => {
      it("should return pathname only", () => {
        expect(getPathWithQueryParams("/fakePath", null)).toEqual("/fakePath");
      });
    });

    describe("when the function get object as argument", () => {
      it("should return pathname with stringified queryParams", () => {
        expect(
          getPathWithQueryParams("/fakePath", {
            filter: "year=:,if=:",
            page: "1",
            query: "paper",
          })
        ).toEqual("/fakePath?filter=year%3D%3A%2Cif%3D%3A&page=1&query=paper");
      });
    });
  });

  describe("getQueryParamsObject function", () => {
    describe("when the function get string type argument", () => {
      it("should parse and return parsed params object", () => {
        expect(getQueryParamsObject("?query=paper&filter=year%3D%3A%2Cif%3D%3A&page=1")).toEqual({
          filter: "year=:,if=:",
          page: "1",
          query: "paper",
        });
      });

      describe("when the function get object type argument", () => {
        it("should parse and return given object", () => {
          expect(
            getQueryParamsObject({
              filter: "year=:,if=:",
              page: "1",
              query: "paper",
            })
          ).toEqual({
            filter: "year=:,if=:",
            page: "1",
            query: "paper",
          });
        });
      });

      describe("when the function get undefined", () => {
        it("should return undefined", () => {
          expect(getQueryParamsObject(undefined)).toEqual(undefined);
        });
      });
    });
  });
});
