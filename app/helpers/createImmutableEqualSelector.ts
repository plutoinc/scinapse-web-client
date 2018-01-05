import { is } from "immutable";
import { createSelectorCreator, defaultMemoize } from "reselect";

const createImmutableEqualSelector = createSelectorCreator(defaultMemoize, is);

export default createImmutableEqualSelector;
