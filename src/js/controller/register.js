/* global angular */
/* global $ */

;(function () {
  /**
  * controller.register Module
  *
  * @author Chinnaporn Soonue
  */
  angular
    .module('controller.register', [])
    .controller('RegisterController', RegisterController)

  RegisterController.$inject = ['$scope', '$http', 'registerService', '$location', '$state', 'Notification']
  function RegisterController ($scope, $http, registerService, $location, $state, notification) {
    var self = this
    self.member = registerService.member
    self.valid = registerService.valid
    self.steps = registerService.steps

    self.moveElement = $('.timeline>dl')
    self.height = self.moveElement.height() + 40
    console.log($('.timeline>dl'))
    self.moveElement.resize(function () {
      self.height = self.moveElement.height() + 40
    })

    self.checkEmail = function validateEmail (email) {
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
      return re.test(email)
    }
    self.clear = function () {
      self.member.email = ''
      self.member.confirmpassword = ''
      self.member.password = ''
    }
    self.back = function () {
      registerService.valid.step1 = true
      registerService.valid.step2 = true
      if (self.steps.step2) {
        registerService.steps.step1 = true
        registerService.steps.step2 = false
        registerService.steps.step3 = false
        console.log('Step2 back')
        self.moveElement.css('margin-top', '0px')
      } else if (self.steps.step3) {
        registerService.steps.step1 = false
        registerService.steps.step2 = true
        registerService.steps.step3 = false
        console.log('Step3 back')
        self.moveElement.css('margin-top', '-' + self.height + 'px')
      }
      self.valid = registerService.valid
      self.steps = registerService.steps
    }
    self.next1 = function () {
      if ((self.member.confirmpassword === self.member.password) &&
        (self.member.password.length >= 8 && self.member.confirmpassword.length >= 8) &&
        (self.checkEmail(self.member.email))) {
        registerService.valid.step1 = true
        registerService.steps.step1 = false
        registerService.steps.step2 = true
        registerService.steps.step3 = false
        console.log('Step1 next')
        self.moveElement.css('margin-top', '-' + self.height + 'px')
      } else {
        console.log('form not valid')
        registerService.valid.step1 = false
      }
      self.valid = registerService.valid
      self.steps = registerService.steps
    // self.moveElement.css('margin-top', '-' + self.height + 'px')
    }
    self.next2 = function () {
      if ((self.member.firstname !== '') && (self.member.lastname !== '')) {
        registerService.valid.step2 = true
        registerService.steps.step1 = false
        registerService.steps.step2 = false
        registerService.steps.step3 = true
        console.log('Step2 next')
        self.moveElement.css('margin-top', '-' + (self.height * 2) + 'px')
      } else {
        console.log('form not valid')
        registerService.valid.step2 = false
      }
      self.valid = registerService.valid
      self.steps = registerService.steps
    // self.moveElement.css('margin-top', '-' + (self.height * 2) + 'px')
    }
    self.submit = function () {
      if ((self.member.confirmpassword === self.member.password) &&
        (self.member.password.length >= 8 && self.member.confirmpassword.length >= 8) &&
        (self.checkEmail(self.member.email)) &&
        (self.member.firstname !== '') && (self.member.lastname !== '')) {
        if (self.num1 && self.num2 && self.num3 && self.num4) {
          self.member.card_number = self.num1 + self.num2 + self.num3 + self.num4
        }
        registerService.regis(function (response) {
          console.log('Submit regis')
        // msg = '<span><b>Success!</b> Welcome ' + self.member.firstname + ' to FECS. <br/> Please Login to the system.</span>'
        // notification.success({
        //   message: msg
        // })
        // $state.transitionTo('login')
          self.moveElement.css('margin-top', '-' + (self.height * 3) + 'px')
        }, function (response) {
          var msg = '<span><b>Registration not possible </b> ' + response.description + '.</span>'
          notification.error({
            message: msg,
            replaceMessage: true
          })
          console.log(response)
        })
      } else {
        var msg = '<span><b>Form is invalid.</b><br/>Please back to the previous steps.</span>'
        notification.error({
          message: msg,
          replaceMessage: true
        })
      }
    // self.moveElement.css('margin-top', '-' + (self.height * 3) + 'px')
    }
  }
})()
