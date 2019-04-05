export interface EmailVerificationState
  extends Readonly<{
      isLoading: boolean;
      hasError: boolean;
    }> {}

export const EMAIL_VERIFICATION_INITIAL_STATE = {
  isLoading: false,
  hasError: false,
};
