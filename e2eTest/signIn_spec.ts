import getHost from './helpers/getHost';
import clickWithCapture from './helpers/clickWithCapture';

const DESKTOP_TEST_NAME = 'desktop sign in test';
const MOBILE_TEST_NAME = 'mobile sign in test';

describe.skip(MOBILE_TEST_NAME, () => {
  beforeAll(async () => {
    await page.setViewport({ width: 320, height: 568 });
    await page.goto(`https://${getHost()}`, { waitUntil: 'networkidle0' });
  });

  afterAll(async () => {
    await (jestPuppeteer as any).resetBrowser();
  });

  describe('when enter the page', () => {
    it('should render proper header', async () => {
      await expect(page.$("[class^='improvedHeader_headerContainer']")).resolves.not.toBeNull();
    });

    it('should render sign up button', async () => {
      await expect(page.$("[class^='improvedHeader_signUpButton']")).resolves.not.toBeNull();
    });
  });

  describe('when user click the sign up button', () => {
    it('should show the sign up modal page', async () => {
      await Promise.all([
        page.waitForSelector("[class^='firstForm_formWrapper']", { timeout: 30000 }),
        clickWithCapture({
          page,
          testName: MOBILE_TEST_NAME,
          caseName: 'user use sign in feature',
          actionName: 'click sign in button',
          selector: "[class^='improvedHeader_signUpButton']",
        }),
      ]);

      await expect(page.$("[class^='firstForm_formWrapper']")).resolves.not.toBeNull();
    });
  });

  describe('when user try to sign in', () => {
    it('should sign in', async () => {
      await Promise.all([
        page.waitForSelector("[class^='signIn_formWrapper']", { timeout: 30000 }),
        clickWithCapture({
          page,
          testName: MOBILE_TEST_NAME,
          caseName: 'user use sign in feature',
          actionName: 'click sign in button',
          selector: "[class^='authTabs_authTabItem']:first-of-type",
        }),
      ]);

      await page.type("input[name^='email']", 'test@test.com');
      await page.type("input[name^='password']", 'testtest');
      await Promise.all([
        page.waitForSelector("[class^='improvedHeader_userDropdownChar']", { timeout: 30000 }),
        clickWithCapture({
          page,
          testName: MOBILE_TEST_NAME,
          caseName: 'user use sign in feature',
          actionName: 'submit sign in form',
          selector: 'button[class^="authButton_authBtn"]:first-of-type',
        }),
      ]);
      await expect(page.$("[class^='improvedHeader_userDropdownChar']")).resolves.not.toBeNull();
    });
  });
});

describe.skip(DESKTOP_TEST_NAME, () => {
  beforeAll(async () => {
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(`https://${getHost()}`, { waitUntil: 'networkidle0' });
    await page.reload();
    await page.screenshot({ path: './output/screenshots/testtesttest.png' });
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

  describe('when user try to sign in', () => {
    it('should sign in', async () => {
      await page.type("input[name^='email']", 'test@test.com');
      await page.type("input[name^='password']", 'testtest');
      await Promise.all([
        clickWithCapture({
          page,
          testName: DESKTOP_TEST_NAME,
          caseName: 'user use search feature',
          actionName: 'submit search form',
          selector: 'button[class^="authButton_authBtn"]',
        }),
        page.waitForSelector("[class^='improvedHeader_userDropdownChar']", { timeout: 30000 }),
      ]);
      await expect(page.$("[class^='improvedHeader_userDropdownChar']")).resolves.not.toBeNull();
    });
  });
});
