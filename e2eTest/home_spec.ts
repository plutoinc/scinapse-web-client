import getHost from './helpers/getHost';
import clickWithCapture from './helpers/clickWithCapture';

const TEST_NAME = 'desktop Home page test';

describe(TEST_NAME, () => {
  beforeAll(async () => {
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(`https://${getHost()}`, { waitUntil: 'networkidle0' });
  });

  afterAll(async () => {
    // TODO: Change below 'as any' after type definition package being updated
    // follow https://github.com/DefinitelyTyped/DefinitelyTyped/pull/37390
    await (jestPuppeteer as any).resetBrowser();
  });

  describe('when enter the page', () => {
    it('should render proper title', async () => {
      await expect(page.title()).resolves.toMatch('Scinapse | Academic search engine for paper');
    });

    it('should render the search input element', async () => {
      await expect(page.$("input[class^='improvedHome_searchInput']")).resolves.not.toBeNull();
    });
  });

  describe('when user use search feature', () => {
    beforeEach(async () => {
      await page.type("input[class^='improvedHome_searchInput']", 'machine learning');
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
            selector: "[class^='searchQueryInput_searchButton']",
          }),
        ]);

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
