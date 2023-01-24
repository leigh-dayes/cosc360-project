module.exports = {
  "default e2e tests": browser => {
    browser
      .url(browser.launchUrl)
      .waitForElementVisible("#app")
      .assert.elementPresent(".hello")
      .assert.containsText("h1", "Welcome to Your Vue.js App")
      .end();
  }
};
