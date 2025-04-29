const {By, Builder, WebElementCondition, until} = require('selenium-webdriver');
const assert = require("assert");

(async function homeTest() {
    let driver;

    try{


    } catch (e) {
        console.log (e)
    }finally {
        await driver.quit();
    }
}())


driver = await new Builder().forBrowser(Browser.CHROME).build();

await driver.get('https://rpgnotes.app');
let title = await driver.getTitle();