/* global angular */
/* global $ */

;(function () {
  /**
  * controller.payment Module
  *
  * @author Natchanon Charoensuk
  */
  angular
    .module('controller.payment', [])
    .controller('PaymentController', PaymentController)

  PaymentController.$inject = ['$scope', '$http', '$state', '$stateParams', 'environment', 'User']
  function PaymentController ($scope, $http, $state, $stateParams, environment, User) {
    var self = this
    var url = environment.getBaseAPI() + 'payment/' + $stateParams.orderNumber
    self.email = ''
    self.User = User
    self.valid = {
      step1: true,
      step2: true
    }
    self.steps = {
      step1: true,
      step2: false,
      step3: false
    }
    self.is404 = false

    self.shippingList = []
    self.order = null
    self.payment = {
      card: {
        no: '',
        holder_name: self.User.card_name,
        exp_date: self.User.expirationDate
      },
      cvv: '',
      price: 0,
      shipping: null
    }
    $http.get(environment.getBaseAPI() + 'order/' + $stateParams.orderNumber).success(function (response) {
      self.order = response
      if(self.order.status !== 0) { // status !== 'Not Pay'
        $state.transitionTo('home')
      }
      // Calculate total price of products in cart
      for( var i=0; i<self.order.cart.length;i++ ) {
        self.payment.price += self.order.cart[i].product.price*self.order.cart[i].quantity
      }
      console.log(self.order)
    }).error(function (response) {
      console.log('Error')
      self.is404 = true
    })

    $http.get(environment.getBaseAPI() + 'shipping/all').success(function (response) {
      self.shippingList = response
    }).error(function (response) {
      self.is404 = true
    })

    self.back = function () {
      self.valid.step1 = true
      self.valid.step2 = true
      if (self.steps.step2) {
        self.steps.step1 = true
        self.steps.step2 = false
        self.steps.step3 = false
        console.log('Step2 back')
        self.moveElement.css('margin-top', '0px')
      } else if (self.steps.step3) {
        self.steps.step1 = false
        self.steps.step2 = true
        self.steps.step3 = false
        console.log('Step3 back')
        self.moveElement.css('margin-top', '-' + self.height + 'px')
      }
    }
    self.next1 = function () {
      // if (self.email === self.User.email && self.order.shipping !== null) {
      if (!(self.User.zipcode.length !== 5 || self.User.province === null || (self.User.address1 === null && self.User.address2 === null)) && self.order.shipping !== null) {
        self.valid.step1 = true
        self.steps.step1 = false
        self.steps.step2 = true
        self.steps.step3 = false
        console.log('Step1 next Payment')
        self.moveElement.css('margin-top', '-' + self.height + 'px')
      } else {
        console.log('form not valid')
        self.valid.step1 = false
      }
    }
    self.next2 = function () {
      $http.post(environment.getBaseAPI() + 'payment/validate', self.payment).success(function (response) {
        if (response) {
          self.valid.step2 = true
          self.steps.step1 = false
          self.steps.step2 = false
          self.steps.step3 = true
          console.log('Step2 next')
          self.moveElement.css('margin-top', '-' + (self.height * 2) + 'px')
        } else {
          console.log('credit card is not valid')
          self.valid.step2 = false
        }
      }).error(function (response) {
        self.valid.step2 = false
        console.log(response)
      })
    }
    self.submit = function () {
      $http.post(environment.getBaseAPI() + 'payment/pay?orderNumber=' + self.order.orderNumber, self.payment).success(function (response) {
        if (response.status !== 'error') {
          console.log('Paid')
          self.order.date = response.date
          self.moveElement.css('margin-top', '-' + (self.height * 3) + 'px')
        } else {
          console.log(response)
        }
      })
    }
    self.init = function () {
      self.moveElement = angular.element('.timeline dl')
      console.log(self.moveElement)
      self.height = self.moveElement.height() + 40
      self.moveElement.resize(function () {
        self.height = self.moveElement.height() + 40
      })
    }
  }
})()
