var HtmlReporter = require('protractor-html-screenshot-reporter')

exports.config = {

  specs: ['protractor_test/in-progress/test_ViewFurnitureCategory.js'],

  capabilities: { 
    browserName: 'chrome'
  },

  // multiCapabilities: [{
  //     browserName: 'firefox'
  //   }, {
  //     browserName: 'chrome'
  // }],

  // baseUrl: 'http://localhost:8080/app/',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 180000
  },

  onPrepare: function () {
    jasmine.getEnv().addReporter(new HtmlReporter({
         baseDirectory: 'reports/',
         takeScreenShotsOnlyForFailedSpecs: true,
         docTitle: 'Test Report',
         preserveDirectory: true,
         docName: 'report.html'
      }))
  }
}