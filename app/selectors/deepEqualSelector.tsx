import { createSelectorCreator, defaultMemoize } from 'reselect';
import * as equal from 'fast-deep-equal';

export const createDeepEqualSelector = createSelectorCreator(defaultMemoize, equal);
