jest.unmock("../records");

import {
  initialOauthInfo,
  SignUpStateFactory,
  SignUpStateRecord,
  SIGN_UP_INITIAL_STATE,
  SignUpErrorCheck,
  FormError,
  FormErrorFactory,
  SignUpErrorCheckFactory,
  SignUpErrorCheckRecord,
  SignUpOauthInfoRecord,
  initialFormError,
  initialErrorCheck,
  SignUpOauthInfoFactory,
  signUpInitialState,
} from "../records";

describe("signUp records", () => {
  describe("FormError factory", () => {
    it("should return FormErrorRecord type record", () => {
      const mockFormError: FormError = initialFormError;
      expect(FormErrorFactory(mockFormError).toString()).toContain("Record");
    });
  });

  describe("SignUpErrorCheckFactory factory", () => {
    let result: SignUpErrorCheckRecord;

    beforeEach(() => {
      const mockSignUpErrorCheck: SignUpErrorCheck = initialErrorCheck;

      result = SignUpErrorCheckFactory(mockSignUpErrorCheck);
    });

    it("should return SignUpErrorRecord type record", () => {
      expect(result.toString()).toContain("Record");
    });

    it("should return recoridfied email field", () => {
      expect(result.email.toString()).toContain("Record");
    });

    it("should return recoridfied password field", () => {
      expect(result.password.toString()).toContain("Record");
    });

    it("should return recoridfied name field", () => {
      expect(result.name.toString()).toContain("Record");
    });

    it("should return recoridfied affiliation field", () => {
      expect(result.affiliation.toString()).toContain("Record");
    });
  });

  describe("SignUpOauthInfoFactory factory", () => {
    let result: SignUpOauthInfoRecord;

    beforeEach(() => {
      const mockSignUpOauthInfo = initialOauthInfo;

      result = SignUpOauthInfoFactory(mockSignUpOauthInfo);
    });

    it("should return SignUpOauthInfoRecord type record", () => {
      expect(result.toString()).toContain("Record");
    });
  });

  describe("SignUpStateFactory function", () => {
    let state: SignUpStateRecord;

    describe("when there is no params", () => {
      beforeEach(() => {
        state = SignUpStateFactory();
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should return initial state", () => {
        expect(state.toJS()).toEqual(SIGN_UP_INITIAL_STATE.toJS());
      });
    });

    describe("when there is normal js params", () => {
      beforeEach(() => {
        state = SignUpStateFactory(signUpInitialState);
      });

      it("should return recordified state", () => {
        expect(state.toString()).toContain("Record");
      });

      it("should have param's isLoading value", () => {
        expect(state.isLoading).toBeFalsy();
      });

      it("should have param's hasError value", () => {
        expect(state.hasError).toBeFalsy();
      });

      it("should have param's email value", () => {
        expect(state.email).toEqual("");
      });

      it("should have param's password value", () => {
        expect(state.password).toEqual("");
      });

      it("should have param's name value", () => {
        expect(state.name).toEqual("");
      });

      it("should have param's affiliation value", () => {
        expect(state.affiliation).toEqual("");
      });

      it("should have param's onFocus value", () => {
        expect(state.onFocus).toEqual(null);
      });

      it("should have recordified hasErrorCheck state", () => {
        expect(state.hasErrorCheck.toString()).toContain("Record");
      });

      it("should have param's hasErrorCheck value", () => {
        expect(state.hasErrorCheck.toJS()).toEqual(SignUpErrorCheckFactory().toJS());
      });

      it("should have param's step value", () => {
        expect(state.step).toEqual(0);
      });

      it("should have param's oauth value", () => {
        expect(state.oauth).toEqual(SignUpOauthInfoFactory());
      });
    });
  });
});
