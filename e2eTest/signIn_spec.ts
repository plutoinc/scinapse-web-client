import getHost from './helpers/getHost';
import clickWithCapture from './helpers/clickWithCapture';

const DESKTOP_TEST_NAME = 'Desktop Sign In test';

describe(DESKTOP_TEST_NAME, () => {
  beforeAll(async () => {
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(`https://${getHost()}`, { waitUntil: 'networkidle0' });
  });

  afterAll(async () => {
    await (jestPuppeteer as any).resetBrowser();
  });

  describe('when enter the page', () => {
    it('should render proper header', async () => {
      await expect(page.$("[class^='improvedHeader_headerContainer']")).resolves.not.toBeNull();
    });

    it('should render proper sign in button', async () => {
      await expect(page.$("[class^='improvedHeader_signInButton']")).resolves.not.toBeNull();
    });
  });

  describe('when user click the sign in button', () => {
    it('should show the sign in modal page', async () => {
      await Promise.all([
        page.waitForSelector("[class^='signIn_formWrapper']", { timeout: 30000 }),
        clickWithCapture({
          page,
          testName: DESKTOP_TEST_NAME,
          caseName: 'user use sign in feature',
          actionName: 'click sign in button',
          selector: "[class^='improvedHeader_signInButton']",
        }),
      ]);

      await expect(page.$("[class^='signIn_formWrapper']")).resolves.not.toBeNull();
    });
  });
});
