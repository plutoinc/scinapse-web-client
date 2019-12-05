import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SignUpModalState {
  email: string;
}

export const SIGN_UP_MODAL_INITIAL_STATE = { email: '' };

const signUpModalSlice = createSlice({
  name: 'signUpModal',
  initialState: SIGN_UP_MODAL_INITIAL_STATE,
  reducers: {
    setSignUpModalEmail(state, action: PayloadAction<{ email: string }>) {
      state.email = action.payload.email;
    },
  },
});

export const { setSignUpModalEmail } = signUpModalSlice.actions;

export default signUpModalSlice.reducer;
