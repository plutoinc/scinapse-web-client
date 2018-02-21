interface RawAppState {
  routing?: any;
  signUp: ISignUpStateRecord;
  signIn: ISignInStateRecord;
  currentUser: ICurrentUserRecord;
  authChecker: IAuthCheckerStateRecord;
  dialog: IDialogStateRecord;
  layout: ILayoutStateRecord;
  articleSearch: IArticleSearchStateRecord;
  emailVerification: IEmailVerificationStateRecord;
}

export default function recordifyInitialState(rawAppState: RawAppState) {}
