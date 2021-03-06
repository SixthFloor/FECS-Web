/* global angular */

;(function () {
  /**
  * controller.product Module
  *
  * @author Warunyu Rerkdee
  * @description Product Controller module to add create all controller about product of this project.
  */
  angular
    .module('controller.productpage', [])
    .controller('ProductPageController', ProductPageController)
    .controller('AddProductController', AddProductController)
    .controller('EditProductController', EditProductController)
    .controller('ManageProductController', ManageProductController)

  ProductPageController.$inject = ['$scope', '$http', '$stateParams', 'Cart']
  function ProductPageController ($scope, $http, $stateParams, Cart) {
    var self = this
    // API path
    var url = $scope.environment.getBaseAPI() + 'product/' + $stateParams.product_id

    $http.get(url).success(function (response) {
      console.log(response)
      self.product = response
    }).error(function (response) {
      console.log('Error')
      self.is404 = true
    })

    self.addToCart = function (quantity) {
      Cart.add({product: self.product, quantity: quantity})
    }
  }

  AddProductController.$inject = ['$scope', '$http', 'productService', 'Notification', '$state']
  function AddProductController ($scope, $http, productService, notification, $state) {
    var self = this
    self.product = productService.product
    self.valid = productService.valid
    self.categoryList = {}
    self.subcategoryList = {}
    // Get all categories
    $http.get($scope.environment.getBaseAPI() + 'category/all').success(function (response) {
      if (response.status !== 'error') {
        self.categoryList = response
      } else {
        console.log(response.message)
        self.is404 = true
        self.errorMessage = 'Error: Cannot get categories.'
      }
    })
    self.direct = function (categoryName) {
      $state.transitionTo('admin/product/add')
      productService.clearProduct()
      if (categoryName !== 'all') {
        for (var i = 0; i < self.categoryList.length;i++) {
          var cat = self.categoryList[i]
          if (cat.name === categoryName) {
            self.product.category = cat
          }
        }
      }
    }
    // Get subcategories from category
    self.getSubcat = function () {
      $http.get($scope.environment.getBaseAPI() + 'category/' + self.product.category.name).success(function (response) {
        if (response.status !== 'error') {
          self.subcategoryList = response
        } else {
          console.log(response.message)
          self.is404 = true
          self.errorMessage = 'Error: Cannot get categories.'
        }
      })
    }
    self.submit = function () {
      if ((self.product.productName !== '') && (self.product.price !== '') &&
        (self.product.category !== null) && (self.product.subcategory !== null)) {
        productService.valid = true
        if (self.product.description === '') {
          self.product.description = '-'
        }
        if (self.product.dimensionDescription === '') {
          self.product.dimensionDescription = '-'
        }
        productService.addproduct(function (response) {
          if (response.status === 'error') {
            var msg = '<span><b>Add failed!</b> ' + response.message + '.</span>'
            notification.error({
              message: msg,
              replaceMessage: true
            })
          } else {
            msg = '<span><b>Success!</b> Added new furniture.<br/>' + self.product.productName + ' is now available in FECS store.</span>'
            self.product.id = response.id
            productService.addproduct2(function (response2) {
              console.log(response2)
              productService.clearProduct()
            }, function (response2) {
              console.log(response2)
            })
            notification.success({
              message: msg
            })
          }
        }, function (response) {
          console.log(response)
        })
      } else {
        console.log('should be false')
        console.log(self.image)
        productService.valid = false
      }
      self.valid = productService.valid
      console.log(self.valid)
    }
  }

  EditProductController.$inject = ['$scope', '$http', '$stateParams', 'Notification', 'productService', '$state']
  function EditProductController ($scope, $http, $stateParams, notification, productService, $state) {
    console.log($stateParams.product_id)
    var self = this
    self.product = productService.product
    self.valid = productService.valid
    self.categoryList = {}
    self.subcategoryList = {}
    self.catalogID = 0
    self.oldSubcat = null

    // Get all categories
    $http.get($scope.environment.getBaseAPI() + 'category/all').success(function (response) {
      if (response.status !== 'error') {
        self.categoryList = response
      } else {
        console.log(response.message)
        self.is404 = true
        self.errorMessage = 'Error: Cannot get categories.'
      }
    })
    // Get subcategories from category
    self.getSubcat = function () {
      $http.get($scope.environment.getBaseAPI() + 'category/' + self.product.category.name).success(function (response) {
        if (response.status !== 'error') {
          self.subcategoryList = response
          if (self.oldSubcat !== null) {
            for (var i = 0; i < self.subcategoryList.length;i++) {
              var subcat = self.subcategoryList[i]
              if (subcat.name === self.oldSubcat.name) {
                self.product.subcategory = subcat
              }
            }
          }
        } else {
          console.log(response.message)
          self.is404 = true
          self.errorMessage = 'Error: Cannot get categories.'
        }
      })
    }
    self.changeSubcat = function () {
      if (self.product.subcategory !== null) {
        self.oldSubcat = self.product.subcategory
      }
    }

    // path of real API
    var url = $scope.environment.getBaseAPI() + 'product/' + $stateParams.product_id
    if ($stateParams.product_id !== '') {
      $http.get(url).success(function (response) {
        if (response.status !== 'error') {
          console.log(response)
          self.product.id = response.id
          self.product.serialNumber = response.serialNumber
          self.product.productName = response.name
          self.product.price = response.price
          self.product.description = response.description
          self.product.dimensionDescription = response.dimensionDescription
        } else {
          console.log(response.message)
          self.is404 = true
          self.errorMessage = 'Error: Furniture not found'
        }
      })
      url = $scope.environment.getBaseAPI() + 'catalog/' + $stateParams.product_id
      $http.get(url).success(function (response) {
        if (response.status !== 'error') {
          self.catalogID = response[0].id
          for (var i = 0; i < self.categoryList.length;i++) {
            var cat = self.categoryList[i]
            if (cat.name === response[0].type.category.name) {
              self.product.category = cat
            }
          }
          self.oldSubcat = response[0].type.subCategory
          self.getSubcat()
        } else {
          console.log(response.message)
          self.is404 = true
          self.errorMessage = 'Error: Furniture not found'
        }
      })
    } else {
      self.is404 = true
      self.errorMessage = 'Error: Furniture not found'
    }

    self.submit = function () {
      if ((self.product.productName !== '') && (self.product.price !== '') &&
        (self.product.category !== null) && (self.product.subcategory !== null)) {
        productService.valid = true
        if (self.product.description === '') {
          self.product.description = '-'
        }
        if (self.product.dimensionDescription === '') {
          self.product.dimensionDescription = '-'
        }
        productService.editproduct(function (response) {
          console.log(response)
          var msg = '<span><b>Success!</b> Edited Furniture ID: ' + self.product.serialNumber + '<br/>' + self.product.productName + "'s datas saved.</span>"
          notification.success({
            message: msg
          })
        }, function (response) {
            var msg = response.description
            notification.error({
              message: msg,
              replaceMessage: true
            })
          console.log(response)
        }, self.catalogID)
      } else {
        console.log('should be false')
        productService.valid = false
      }
      self.valid = productService.valid
    }

    self.delete = function () {
      productService.deleteproduct(function (response) {
        if (response.status === 'error') {
          var msg = '<span><b>Delete Failed!</b> ' + response.message + '.</span>'
          notification.error({
            message: msg,
            replaceMessage: true
          })
        } else {
          msg = '<span><b>Success!</b> Deleted Furniture ID: ' + self.product.serialNumber + '<br/>' + self.product.productName + ' is not in FECS.</span>'
          notification.success({
            message: msg
          })

          var url = $scope.environment.getBaseAPI() + 'product/delete'
          $http.delete(url, {
            serialNumber: self.product.serialNumber
          })
          var category_bak = self.product.category
          productService.clearProduct()
          if (category_bak !== null) {
            $state.transitionTo('category', {category_name: category_bak.name})
          } else {
            $state.transitionTo('category', {category_name: 'all'})
          }
        }
      }, function (response) {
        console.log(response)
      })
    }

    self.addToStock = function (quantity) {
      var list = []
      var url = $scope.environment.getBaseAPI() + 'real-product/new'
      list.push({
        product: {
          id: self.product.id
        },
        quantity: quantity
      })
      console.log(list)
      $http.post(url, list).success(function (response) {
        msg = '<span><b>Success!</b> Restocked productID: ' + self.product.id + ' for ' + quantity +' ea.'
          notification.success({
            message: msg
        })
        console.log('Real product added')
      }).error(function (response) {
        console.log(response)
      })
    }
  }

  ManageProductController.$inject = ['$scope', '$http', '$state', '$stateParams', 'Notification', 'Manage', 'NgTableParams']
  function ManageProductController ($scope, $http, $state, $stateParams, notification, Manage, NgTableParams) {
    var self = this

    self.tableParams = new NgTableParams({
      count: 10
    },
      {
        counts: ['10', '50', '100'],
        filterDelay: 300,
        paginationMaxBlocks: 13,
        paginationMinBlocks: 2,
        getData: function (params) {
          return Manage.getProduct(params).then(function (res) {
            return res
          }, function (res) {
            return res
          })
        }
      })
    function resetRow (row, rowForm) {
      row.isEditing = false
      rowForm.$setPristine()
      // self.tableTracker.untrack(row)
      // console.log(_)
      // return _.findWhere(originalData, function (r) {
      //   return r.id === row.id
      // })
      return row
    }
    self.addToStock = function (quantity, Id) {
      var list = []
      var url = $scope.environment.getBaseAPI() + 'real-product/new'
      list.push({
        product: {
          id: Id
        },
        quantity: quantity
      })
      console.log(list)
      $http.post(url, list).success(function (response) {
        msg = '<span><b>Success!</b> Restocked productID: ' + Id + ' for ' + quantity +' ea.'
          notification.success({
            message: msg
        })
        console.log('Real product added')
      }).error(function (response) {
        console.log(response)
      })
    }
  }
})()
