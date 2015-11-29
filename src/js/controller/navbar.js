/* global angular */

;(function () {
  /**
  * controller.home Module
  *
  * @author Jiratchaya Intaragumhaneg
  * @description Homepage Controller module to add create all controller of this project.
  */
  angular
    .module('controller.navbar', [])
    .controller('NavbarController', NavbarController)

  NavbarController.$inject = ['$scope', '$http', 'User']
  function NavbarController ($scope, $http, User) {
    var self = this

    self.isAuthed = User.isAuthed()
    self.User = User.getUser()

    if (User.isAuthed()) {
      $http.defaults.headers.common['Authorization'] = User.getToken()
    } else {
      delete $http.defaults.headers.common['Authorization']
    }
  }
})()
