import { ClickOptions, Page } from 'puppeteer';
import { DEFAULT_SCREEN_SHOT_OUTPUT_DIRECTORY } from '../constants/setting';

/*****************************************************************************
 *****************************************************************************
 # Filename Convention
 ---
 [test_name]-[test_case_name]-[action_name]

 ex)
 [desktop_home_page]-[search_feature]-[click_search_icon]

 *****************************************************************************
*****************************************************************************/

interface ClickWithCaptureParams {
  page: Page;
  testName: string;
  caseName: string;
  actionName: string;
  selector: string;
  options?: ClickOptions;
}
export default async function clickWithCapture(params: ClickWithCaptureParams) {
  const { page, testName, caseName, actionName, selector, options } = params;

  const prefix = `${DEFAULT_SCREEN_SHOT_OUTPUT_DIRECTORY}/[${testName.replace(' ', '-')}]-[${caseName.replace(
    ' ',
    '-'
  )}]-[${actionName.replace(' ', '-')}]`;

  await page.screenshot({ path: `${prefix}-before.png` });
  await page.click(selector, options);
  await page.screenshot({ path: `${prefix}-after.png` });
}
