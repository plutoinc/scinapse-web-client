import { Page } from 'puppeteer';
import getHost from './helpers/getHost';

declare var page: Page;

function homeE2E(width: number, height: number) {
  beforeAll(async () => {
    await page.setViewport({ width, height });
    await page.goto(`https://${getHost()}`, { waitUntil: 'networkidle0' });
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
      await page.click("input[class^='improvedHome_searchInput']");
      await page.type("input[class^='improvedHome_searchInput']", 'machine learning');
    });

    afterEach(async () => {
      await page.goBack();
    });

    describe('when user click the search icon', () => {
      it('should show the search result page', async () => {
        await Promise.all([
          page.waitForSelector("[class^='searchList_searchItems']", { timeout: 30000 }),
          page.click("[class^='searchQueryInput_searchButton']"),
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
}

describe('Desktop Home page test', () => homeE2E(1920, 1080));

describe('Mobile Home page test', () => homeE2E(320, 568));
