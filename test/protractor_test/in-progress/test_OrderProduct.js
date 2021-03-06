/* Test case: Order product */
/* Created by Kittinan */

describe('Add product to cart', function () {

	var linkDropdown =   element.all(by.css('.dropdown-toggle'))
 	var linkSignin = element(by.css('[ui-sref="login"]'))
  	var linkSignout = element(by.css('[ui-sref="logout"]'))
  	var email = element(by.model('loginCtrl.data.email'))
  	var password = element(by.model('loginCtrl.data.pwd'))
  	var loginButton = element(by.buttonText('Log in'))
  	var notifications = element.all(by.css('.ui-notification'))
  	var cartButton = element(by.css('[ui-sref="cart"]'))
  	var allProduct = element(by.css('[href="#/category/all"]'))
  	var product = element.all(by.id('view-button'))
  	var CheckOutOfStock = element(by.id('outofstock'))
  	var addToCartButton = element(by.css('.add-btn'))
  	var productInCart = element.all(by.repeater('item in cartCtrl.itemList track by $index'))
  	var removeButton = element.all(by.css('.btn.btn-danger'))
  	var quantity = element.all(by.model('quantity'))
  	var amountProductInCart
  	var amountProduct
  	var amountquant
  	var quant = []
  
  	// function randomProduct(amountProduct){
  	// 	randomfromAll = (Math.floor(Math.random() * (amountProduct+1))) -1
  	// }

	it('Case 1: If email and password correct,then it should access complete and cart button appear', function(){
		browser.get('http://localhost:3030/#')
		linkDropdown.get(1).click()
   		linkSignin.click()
    	expect(browser.getCurrentUrl()).toBe('http://localhost:3030/#/login')
    	email.sendKeys("testcart@gmail.com")
    	password.sendKeys("123456789")
    	loginButton.click()
    	expect(notifications.getText()).toEqual([ 'Well done! Login successfully.' ])
    	cartButton.click()
    	expect(browser.getCurrentUrl()).toBe('http://localhost:3030/#/cart')
	})

	it('Case 2: If click to all product,it should go to all product page', function(){
		linkDropdown.get(0).click()
		allProduct.click()
		expect(browser.getCurrentUrl()).toBe('http://localhost:3030/#/category/all')
		browser.sleep(1000)
		product.count().then(function(count) {
        	amountProduct = count
      	})
	})

	it('Case 3.1: Adding product to cart', function(){
		linkDropdown.get(0).click()
		allProduct.click()
		product.get(1).click()
		addToCartButton.click()

		linkDropdown.get(0).click()
		allProduct.click()
		product.get(2).click()
		expect(CheckOutOfStock.isDisplayed)

		linkDropdown.get(0).click()
		allProduct.click()
		product.get(3).click()
		addToCartButton.click()
		
		linkDropdown.get(0).click()
		allProduct.click()
		product.get(7).click()
		addToCartButton.click()
	})

	it('Case 3.2: (Going to Cart page)', function(){
		cartButton.click()
		browser.sleep(2000)
		productInCart.count().then(function(count) {
        	amountProductInCart = count
      	})
	})

	it('Case 3.3: Adding product to cart,it should show those in cart page ', function(){
		expect(productInCart.count()).toEqual(amountProductInCart)
	})

})