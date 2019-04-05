import { debounce } from "lodash";
import { checkDuplicatedEmail } from "../actions";

export const debouncedCheckDuplicate = debounce(checkDuplicatedEmail, 200);
