import getHost from './helpers/getHost';
import clickWithCapture from './helpers/clickWithCapture';

const DESKTOP_TEST_NAME = 'desktop search result page test';
const MOBILE_TEST_NAME = 'mobile search result page test';

function searchResultE2E(TEST_NAME: string, width: number, height: number) {
  describe(TEST_NAME, () => {
    beforeAll(async () => {
      await page.setViewport({ width, height });
      await page.goto(`https://${getHost()}/search?query=machine%20learning`, { waitUntil: 'networkidle0' });
    });

    describe('when enter the page', () => {
      it('should render proper title', async () => {
        await expect(page.title()).resolves.toMatch('machine learning | Scinapse | Academic search engine for paper');
      });

      it('should render proper search result', async () => {
        await expect(page.$("[class^='searchList_searchItems']")).resolves.not.toBeNull();
      });

      it('should render proper header', async () => {
        await expect(page.$("[class^='improvedHeader_headerContainer']")).resolves.not.toBeNull();
      });
    });

    describe('when user use search feature', () => {
      beforeEach(async () => {
        await page.click("input[class^='improvedHeader_searchInput']", { clickCount: 3 });
        await page.type("input[class^='improvedHeader_searchInput']", 'cern');
      });

      afterEach(async () => {
        await page.goBack();
      });

      describe('when user click the search icon', () => {
        it('should show the search result page', async () => {
          await Promise.all([
            page.waitForSelector("[class^='searchList_searchItems']", { timeout: 30000 }),
            clickWithCapture({
              page,
              testName: TEST_NAME,
              caseName: 'user use search feature',
              actionName: 'click search icon',
              selector: "[class^='searchQueryInput_searchIconButton']",
            }),
          ]);

          page.title().then(res => {
            console.log(res);
          });

          await expect(page.$("[class^='searchList_searchItems']")).resolves.not.toBeNull();
        });
      });

      describe('when user press the enter key', () => {
        it('should show the search result page', async () => {
          await Promise.all([
            page.waitForSelector("[class^='searchList_searchItems']", { timeout: 30000 }),
            page.keyboard.press('Enter'),
          ]);

          await expect(page.$("[class^='searchList_searchItems']")).resolves.not.toBeNull();
        });
      });
    });
  });
}

searchResultE2E(DESKTOP_TEST_NAME, 1920, 1080);
searchResultE2E(MOBILE_TEST_NAME, 320, 568);
