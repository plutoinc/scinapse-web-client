import { camelCaseKeys } from "..";

describe("camelCaseKeys function", () => {
  let mockObject: Object;

  beforeEach(() => {
    mockObject = {
      paper_show: 1,
      _abc: 1,
      author_show_: 1,
      _collection_show_: 1,
      abcdef: 1,
      collection__list: 1,
      "  efef  ": 1,
      bc_d: {
        bcd_efg: 1,
        abccc_cccc: {
          dfefef_sdfsx: 1,
        },
      },
      cd_ef: [
        { de_fgh: 1 },
        { aadvvs_sdfsdf: 1 },
        [{ abc_def: 1 }, { dsfsd_sdf: 1 }, [{ dsd_cxvxc: 1 }, { vcbv_cv: 1 }]],
      ],
    };
  });

  describe("when key is paper_show", () => {
    it("should return 'paperShow' as the key", () => {
      expect(camelCaseKeys(mockObject).hasOwnProperty("paperShow")).toBeTruthy();
    });
  });

  describe("when key is _abc", () => {
    it("should return 'abc' as the key", () => {
      expect(camelCaseKeys(mockObject).hasOwnProperty("abc")).toBeTruthy();
    });
  });

  describe("when key is author_show_", () => {
    it("should return 'authorShow' as the key", () => {
      expect(camelCaseKeys(mockObject).hasOwnProperty("authorShow")).toBeTruthy();
    });
  });

  describe("when key is _collection_show_", () => {
    it("should return 'collectionShow' as the key", () => {
      expect(camelCaseKeys(mockObject).hasOwnProperty("collectionShow")).toBeTruthy();
    });
  });

  describe("when key is abcdef", () => {
    it("should return 'abcdef' as the key", () => {
      expect(camelCaseKeys(mockObject).hasOwnProperty("abcdef")).toBeTruthy();
    });
  });

  describe("when key is collection__list", () => {
    it("should return 'collectionList' as the key", () => {
      expect(camelCaseKeys(mockObject).hasOwnProperty("collectionList")).toBeTruthy();
    });
  });

  describe("when key is   efef  ", () => {
    it("should return 'efef' as the key", () => {
      expect(camelCaseKeys(mockObject).hasOwnProperty("efef")).toBeTruthy();
    });
  });

  describe("when key is bc_d and type of value is 'object'", () => {
    it("should return 'bcD' as the key", () => {
      expect(camelCaseKeys(mockObject).hasOwnProperty("bcD")).toBeTruthy();
    });

    it("should return camelCased value object", () => {
      expect(camelCaseKeys(mockObject)["bcD"]).toEqual({ bcdEfg: 1, abcccCccc: { dfefefSdfsx: 1 } });
    });
  });

  describe("when key is cd_ef and type of value is 'array'", () => {
    it("should return 'cdEf' as the key", () => {
      expect(camelCaseKeys(mockObject).hasOwnProperty("cdEf")).toBeTruthy();
    });

    it("should return camelCased value object", () => {
      expect(camelCaseKeys(mockObject)["cdEf"]).toEqual([
        { deFgh: 1 },
        { aadvvsSdfsdf: 1 },
        [{ abcDef: 1 }, { dsfsdSdf: 1 }, [{ dsdCxvxc: 1 }, { vcbvCv: 1 }]],
      ]);
    });
  });
});
