import { chromium } from 'playwright';

async function saveAuth() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('Please log into LinkedIn in the newly opened browser window...');
    await page.goto('https://www.linkedin.com/login');

    // Waits until you are safely past the login wall and on the feed
    await page.waitForURL('**/feed/**', { timeout: 0 });

    await context.storageState({ path: 'auth.json' });
    console.log('✓ Successfully saved session to auth.json!');

    await browser.close();
}

saveAuth();