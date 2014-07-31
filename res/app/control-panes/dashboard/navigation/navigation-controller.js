var _ = require('lodash')

module.exports = function NavigationCtrl($scope, $rootScope) {

  var faviconIsSet = false

  function setUrlFavicon(url) {
    var FAVICON_BASE_URL = '//www.google.com/s2/favicons?domain_url='
    $scope.urlFavicon = FAVICON_BASE_URL + url
    faviconIsSet = true
  }

  function resetFavicon() {
    $scope.urlFavicon = require('./default-favicon.png')
    faviconIsSet = false
  }
  resetFavicon()

  $scope.textUrlChanged = function () {
    if (faviconIsSet) {
      resetFavicon()
    }
  }

  function addHttp(textUrl) {
    if (textUrl.indexOf(':') === -1 && textUrl.indexOf('.') !== -1) {
      return 'http://' + textUrl
    }
    return textUrl
  }

  $scope.blurUrl = false

  $scope.openURL = function ($event) {
    $scope.blurUrl = true
    $rootScope.screenFocus = true

    var url = addHttp($scope.textURL)
    setUrlFavicon(url)
    return $scope.control.openBrowser(url, $scope.browser)
  }

  function setCurrentBrowser(browser) {
    if (browser && browser.apps) {
      var currentBrowser = {}
      if (browser.selected) {
        var selectedBrowser = _.first(browser.apps, 'selected')
        if (!_.isEmpty(selectedBrowser)) {
          currentBrowser = selectedBrowser[0]
        }
      } else {
        var defaultBrowser = _.find(browser.apps, {name: 'Browser'})
        if (defaultBrowser) {
          currentBrowser = defaultBrowser
        } else {
          currentBrowser = _.first(browser.apps)
        }
      }
      $rootScope.browser = currentBrowser
    }
  }

  setCurrentBrowser($scope.device ? $scope.device.browser : null)

  $scope.$watch('device.browser', function (newValue, oldValue) {
    if (newValue !== oldValue) {
      setCurrentBrowser(newValue)
    }
  }, true)

  $scope.clearSettings = function () {
    var browser = $scope.browser
    $scope.control.clearBrowser(browser)
  }
}
