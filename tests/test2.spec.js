// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('Test2', function() {
  this.timeout(30000)
  let driver
  let vars
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build()
    vars = {}
  })
  afterEach(async function() {
    await driver.quit();
  })
  it('Test2', async function() {
    await driver.get("http://localhost:8100/landing")
    await driver.manage().window().setRect(1536, 824)
    await driver.findElement(By.name("ion-input-0")).sendKeys("claymallory34@gmaill.com")
    await driver.findElement(By.name("ion-input-1")).sendKeys("Clay")
    await driver.findElement(By.name("ion-input-1")).sendKeys("Clay")
    await driver.findElement(By.name("ion-input-1")).click()
    {
      const element = await driver.findElement(By.name("ion-input-0"))
      await driver.actions({ bridge: true }).moveToElement(element).clickAndHold().perform()
    }
    {
      const element = await driver.findElement(By.name("ion-input-0"))
      await driver.actions({ bridge: true }).moveToElement(element).perform()
    }
    {
      const element = await driver.findElement(By.name("ion-input-0"))
      await driver.actions({ bridge: true }).moveToElement(element).release().perform()
    }
    await driver.findElement(By.name("ion-input-0")).click()
    await driver.findElement(By.name("ion-input-0")).sendKeys("clay@test.com")
    await driver.findElement(By.name("ion-input-1")).sendKeys("123456")
    await driver.findElement(By.css(".loginButton")).click()
    await driver.findElement(By.css("#tab-button-settings > .md:nth-child(1)")).click()
    {
      const element = await driver.findElement(By.css("#tab-button-settings > .md:nth-child(1)"))
      await driver.actions({ bridge: true }).moveToElement(element).perform()
    }
    {
      const element = await driver.findElement(By.CSS_SELECTOR, "body")
      await driver.actions({ bridge: true }).moveToElement(element, 0, 0).perform()
    }
    await driver.findElement(By.css(".ion-activated")).click()
    await driver.findElement(By.name("ion-input-2")).click()
    await driver.findElement(By.name("ion-input-2")).sendKeys("cnn.com")
    await driver.findElement(By.css(".ion-activated")).click()
    await driver.findElement(By.name("ion-input-3")).click()
    await driver.findElement(By.name("ion-input-3")).sendKeys("cnn.com")
    await driver.findElement(By.css(".ion-activated")).click()
    await driver.findElement(By.id("toBlock")).click()
  })
})
