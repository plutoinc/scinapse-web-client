import { Test } from './abTest';
import { DUMMY_TEST } from './abTestGlobalValue';

export const dummy: Test = {
  name: DUMMY_TEST,
  userGroup: [{ groupName: 'a', weight: 1 }, { groupName: 'b', weight: 1 }],
};
