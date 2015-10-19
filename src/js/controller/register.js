/* global angular */

;(function () {
  /**
  * controller.register Module
  *
  * @author Chinnaporn Soonue
  */
  angular
    .module('controller.register', [])
    .controller('RegisterController', RegisterController)

  RegisterController.$inject = ['$scope', '$http', 'registerService', '$location', '$state', 'Notification', 'FECSAuth']
  function RegisterController ($scope, $http, registerService, $location, $state, notification, FECSAuth) {
    $scope.accessToken = FECSAuth.getToken()
    var self = this
    self.member = registerService.member
    self.valid = registerService.valid

    self.submit = function () {
      if ((self.member.confirmpassword === self.member.password) &&
        (self.member.password.length >= 8 && self.member.confirmpassword.length >= 8) &&
        (self.member.email !== '') && (self.member.firstname !== '') &&
        (self.member.lastname !== '')) {
        registerService.valid = true
        registerService.regis(function (response) {
          if (response.status === 'error') {
            var msg = '<span><b>Oh snap!</b> ' + response.message + '.</span>'
            notification.error({
              message: msg,
              replaceMessage: true
            })
          } else {
            msg = '<span><b>Success!</b> Welcome ' + self.member.firstname + ' to FECS. <br/> Please Login to the system.</span>'
            notification.success({
              message: msg
            })
            $state.transitionTo('login')
          }
        }, function (response) {
          console.log(response)
        })
      } else {
        console.log('should be false')
        registerService.valid = false
      }
      self.valid = registerService.valid
      console.log(self.valid)
    }
  }
})()