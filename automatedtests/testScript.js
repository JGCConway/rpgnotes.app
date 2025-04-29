const {By, Builder, WebElementCondition, until, Browser} = require('selenium-webdriver');
const assert = require("assert");



(async function homeTest() {
    let driver;

    try{

        driver = await new Builder().forBrowser(Browser.CHROME).build();
        await driver.get('https://rpgnotes.app');
        await driver.manage().window().maximize();

        /***************
         Site Title Test
        ***************/
        const siteTitle = await driver.getTitle();
        if (assert.equal ("My Notes", siteTitle)){}
        await driver.manage().setTimeouts({ implicit: 10000 });
        console.log ('Title:'+ siteTitle)
        await driver.manage().setTimeouts({ implicit: 10000 });
        
        /***************
         Download Button Test
        ***************/
        const testDownloadButton = await driver.findElement(By.id('download-notes-btn'))
        const testDownloadButtonText = (await testDownloadButton.getText()).trim();
        assert.equal ("Download Notes", testDownloadButtonText);
        console.log("Download Button Text:"+ testDownloadButtonText)

        /***************
         Upload Button Test
        ***************/
        const testUploadButton = await driver.findElement(By.id('upload-notes-btn'))
        const testUploadButtonText = (await testUploadButton.getText()).trim();
        assert.equal ("Upload Notes", testUploadButtonText);
        console.log("Upload Button Text:"+ testUploadButtonText)

        /***************
         Add Note Button Test
        ***************/
        const testAddButton = await driver.findElement(By.id('add-note-btn'));
        await testAddButton.click();
        console.log('New Note: Button clicked!');

        /***************
         Enter Text into Text Area
        ***************/
        const testNewNoteTextArea = await driver.findElement(By.id('note-text'));
        const testSubmitButton = await driver.findElement(By.id('save-note-btn'));
        let textAreaTextEntered = await testNewNoteTextArea.sendKeys('This is a random note');
        console.log(textAreaTextEntered);
        await testSubmitButton.click();

        console.log('Waiting for 30 seconds...');
        await driver.sleep(30000);  //Delay 30 Seconds

        /***************
         Edit text currently in text area
        ***************/
        await driver.findElement(By.css('.btn.edit-btn')).click();
        await driver.wait(until.elementIsVisible(textarea), 2000);

        const editTextArea = await driver.findElement(By.id('existingtextarea')).clear();
        let edittedNote = await editTextArea.sendKeys('This is a random note that has been editted');
        console.log(edittedNote);
        
        await driver.findElement(By.css('.btn.save-btn')).click();
        
    } catch (e) {
        console.log (e)
    }finally {
        await driver.quit();
    }
}())

