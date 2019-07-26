import { Test } from './abTest';
import { SOURCE_DOMAIN_TEST, DUMMY_TEST, FIGURE_TEST, QUERY_LOVER_EXPERIMENT } from './abTestGlobalValue';

export const queryLover: Test = {
  name: QUERY_LOVER_EXPERIMENT,
  userGroup: [{ groupName: 'control', weight: 9 }, { groupName: 'queryLover', weight: 1 }],
};

export const dummy: Test = {
  name: DUMMY_TEST,
  userGroup: [{ groupName: 'a', weight: 1 }, { groupName: 'b', weight: 1 }],
};

export const sourceDomain: Test = {
  name: SOURCE_DOMAIN_TEST,
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'sourceDomain', weight: 1 }],
};

export const figure: Test = {
  name: FIGURE_TEST,
  userGroup: [
    { groupName: 'control', weight: 1 },
    { groupName: 'onlyPaperShow', weight: 2 },
    { groupName: 'both', weight: 2 },
  ],
};
