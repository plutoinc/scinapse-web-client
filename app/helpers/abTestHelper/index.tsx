import * as Cookies from 'js-cookie';
import { ABTest } from '../../constants/abTest';

export function getUserGroupName(testName: ABTest) {
  return Cookies.get(testName);
}
