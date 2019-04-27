import * as Cookies from "js-cookie";
import { ABTestType } from "./abTest";

export const PAPER_FROM_SEARCH_TEST_NAME: ABTestType = "paperFromSearch";
export const QUERY_LOVER_TEST_NAME: ABTestType = "queryLover";
export const SIGN_UP_CONTEXT_TEST_NAME: ABTestType = "signUpContextText";
export const COMPLETE_BLOCK_SIGN_UP_TEST_NAME: ABTestType = "completeBlockSignUp";
export const COMPLETE_BLOCK_SIGN_UP_TEST_USER_GROUP = Cookies.get(COMPLETE_BLOCK_SIGN_UP_TEST_NAME);
