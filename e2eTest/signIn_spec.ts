import getHost from './helpers/getHost';
import clickWithCapture from './helpers/clickWithCapture';

const DESKTOP_TEST_NAME = 'desktop sign in test';
const MOBILE_TEST_NAME = 'mobile sign in test';

describe(MOBILE_TEST_NAME, () => {
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

    it('should render proper sign up button', async () => {
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

  describe('when user sign in', () => {
    beforeEach(async () => {
      await page.click("[class^='improvedHeader_signUpButton']");

      await Promise.all([
        page.waitForSelector("[class^='firstForm_formWrapper']", { timeout: 30000 }),
        clickWithCapture({
          page,
          testName: MOBILE_TEST_NAME,
          caseName: 'user use sign in feature',
          actionName: 'click sign in button',
          selector: "[class^='improvedHeader_signInButton']",
        }),
      ]);

      await expect(page.$("[class^='firstForm_formWrapper']")).resolves.not.toBeNull();
      await page.click("[class^='authTabs_authTabItem']:first-of-type");
      await page.click("input[name^='email']", { clickCount: 3 });
      await page.type("input[name^='email']", '');
      await page.click("input[name^='password']", { clickCount: 3 });
      await page.type("input[name^='password']", '');
    });

    afterEach(async () => {
      await page.goBack();
    });

    describe('when user click sign in button', () => {
      it('should sign in', async () => {
        await Promise.all([
          clickWithCapture({
            page,
            testName: MOBILE_TEST_NAME,
            caseName: 'user use sign in feature',
            actionName: 'click sign in button',
            selector: 'button[class^="authButton_authBtn"]:first-of-type',
          }),
          page.waitForNavigation(),
        ]);
      });
    });
  });
});

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

  describe('when user sign in', () => {
    beforeEach(async () => {
      await page.click("[class^='improvedHeader_signInButton']");

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

      await page.click("input[name^='email']", { clickCount: 3 });
      await page.type("input[name^='email']", '');
      await page.click("input[name^='password']", { clickCount: 3 });
      await page.type("input[name^='password']", '');
    });

    afterEach(async () => {
      await page.goBack();
    });

    describe('when user click sign in button', () => {
      it('should sign in', async () => {
        await Promise.all([
          clickWithCapture({
            page,
            testName: DESKTOP_TEST_NAME,
            caseName: 'user use search feature',
            actionName: 'click search icon',
            selector: 'button[class^="authButton_authBtn"]:first-of-type',
          }),
          page.waitForNavigation(),
        ]);
      });
    });
  });
});
