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
    .filter('cardFormat', cardNoFormat)

  function cardNoFormat () {
    return function (input) {
      if (input) {
        return input.substring(0, 4) + '-' + input.substring(4, 8) + '-' +
          input.substring(8, 12) + '-' + input.substring(12, 16)
      }
      return 'XXXX-XXXX-XXXX-XXXX'
    }
  }
  PaymentController.$inject = ['$scope', '$http', '$state', '$stateParams', 'moment']
  function PaymentController ($scope, $http, $state, $stateParams, moment) {
    var self = this
    self.num1 = ''
    self.num2 = ''
    self.num3 = ''
    self.num4 = ''
    self.cvv = ''
    self.steps = {
      step1: true,
      step2: false,
      step3: false
    }
    self.is404 = false
    self.cardFormat = ''

    self.shippingList = []
    self.order = null
    $http.get($scope.environment.getBaseAPI() + 'order/' + $stateParams.orderNumber).success(function (response) {
      self.order = response
      if (self.order.status !== 0) { // status !== 'Not Pay'
        $state.transitionTo('home')
      }
      // Calculate total price of products in cart
      console.log(self.order)
    }).error(function (response) {
      console.log(response)
      self.is404 = true
    })

    $http.get($scope.environment.getBaseAPI() + 'shipping/all').success(function (response) {
      self.shippingList = response
    }).error(function (response) {
      self.is404 = true
    })

    self.back = function () {
      var top = parseInt($scope.paymentCtrl.moveElement.css('margin-top').match(/\-+\d+/))
      self.moveElement.removeAttr('style')
      var new_top = top + self.height
      self.moveElement.css('margin-top', new_top + 'px')
    }
    self.next1 = function () {
      if ($scope.$$childHead.payment1.$invalid) {
        $scope.$$childHead.payment1.$setDirty(true)
        $scope.$$childHead.payment1.address1.$setDirty(true)
        $scope.$$childHead.payment1.province.$setDirty(true)
        $scope.$$childHead.payment1.zipcode.$setDirty(true)
        $scope.$$childHead.payment1.phonenumber.$setDirty(true)
        $scope.$$childHead.payment1.shippingdate.$setDirty(true)
      } else {
        self.moveElement.css('margin-top', '-' + self.height + 'px')
      }
    }
    self.next2 = function () {
      var exp_date = moment.utc([
        $scope.User.expirationDate.year,
        parseInt($scope.User.expirationDate.month, 10) - 1,
        1,
        0
      ])
      self.cardfail = {
        status: 0,
        message: ''
      }
      self.payment = {
        card: {
          no: self.num1 + self.num2 + self.num3 + self.num4,
          holder_name: $scope.User.card_name,
          exp_date: exp_date.valueOf().toString()
        },
        cvv: self.cvv,
        price: 0,
        shipping: {
          id: self.order.shipping.id,
          address: {
            address1: $scope.User.address1,
            address2: $scope.User.address2,
            province: $scope.User.province,
            zipcode: $scope.User.zipcode,
            phoneNumber: $scope.User.telephone_number
          }
        }
      }
      for ( var i = 0; i < self.order.cart.length;i++) {
        self.payment.price += self.order.cart[i].product.price * self.order.cart[i].quantity
      }
      if (!$scope.$$childHead.payment2.$invalid) {
        $http.post($scope.environment.getBaseAPI() + 'payment/validate?orderNumber=' + self.order.orderNumber, self.payment).success(function (response) {
          self.moveElement.css('margin-top', '-' + (self.height * 2) + 'px')
          self.getCardNoFormat()
          self.cardfail.status = 3
        }).error(function (response) {
          self.cardfail.message = response.description
          if (response.description === 'Out of amount') {
            self.cardfail.status = 1
          } else {
            self.cardfail.status = 2
          }
        })
      } else {
        $scope.$$childHead.payment2.$setDirty(true)
        $scope.$$childHead.payment2.cardholdername.$setDirty(true)
        $scope.$$childHead.payment2.cardnumber1.$setDirty(true)
        $scope.$$childHead.payment2.cardnumber2.$setDirty(true)
        $scope.$$childHead.payment2.cardnumber3.$setDirty(true)
        $scope.$$childHead.payment2.cardnumber4.$setDirty(true)
        $scope.$$childHead.payment2.cvv.$setDirty(true)
      }
    }
    self.submit = function () {
      $http.post($scope.environment.getBaseAPI() + 'payment/pay?orderNumber=' + self.order.orderNumber, self.payment).success(function (response) {
        if (response.status !== 'error') {
          console.log('Paid')
          console.log(response)
          self.order.date = response.date
          self.moveElement.css('margin-top', '-' + (self.height * 3) + 'px')
        } else {
          console.log(response)
        }
      }).error(function (response) {
        console.log(self.payment)
        console.log(response)
      })
    }
    self.init = function () {
      self.moveElement = angular.element('.timeline dl')
      self.height = self.moveElement.height() + 40
      self.moveElement.resize(function () {
        self.height = self.moveElement.height() + 40
      })
    }
  }
})()
