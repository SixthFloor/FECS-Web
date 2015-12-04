/* Test case: Register As Member */
/* Created by Kittinan */

describe('Register as member', function () {

    var email = element(by.model('registerCtrl.member.email'))
    var password = element(by.model('registerCtrl.member.password'))
    var confirmpassword = element(by.model('registerCtrl.member.confirmpassword'))
    var firstname = element(by.model('registerCtrl.member.firstname'))
    var lastname = element(by.model('registerCtrl.member.lastname'))
    var address1 = element(by.model('registerCtrl.member.adr1'))
    var address2 = element(by.model('registerCtrl.member.adr2'))
    var province = element(by.model('registerCtrl.member.province'))
    var zip = element(by.model('registerCtrl.member.zip'))
    var phonenumber = element(by.model('registerCtrl.member.phonenumber'))
    var cardHolder = element(by.id('card-holder-name'))
    var registerButton = element(by.buttonText('Register'))
    var homeButton = element(by.css('[ui-sref="home"]'))
    var nextButton1 = element(by.css('[ng-click="registerCtrl.next1()"]'))
    var nextButton2 = element(by.css('[ng-click="registerCtrl.next2()"]'))
    var clearButton = element(by.buttonText('Clear'))
    var step1 = element(by.id('registerCtrl.steps.step1'))
    var step2 = element(by.id('registerCtrl.steps.step2'))
    var step3 = element(by.id('registerCtrl.steps.step3'))

    function enterResgiterPage(){
        browser.get('http://localhost:3030/#/register')
    }

    it('Start: Test click to register page', function () {
        enterResgiterPage()
        expect(browser.getCurrentUrl()).toBe('http://localhost:3030/#/register')
        browser.sleep(1000)
    })

    it('Case 1: If click nextButton without any information,register should not be successed', function () {
        nextButton1.click()
        expect(step1.isDisplayed).toBeTruthy
        browser.sleep(1000)
    })

    it('Case 2: If e-mail,password are corrected and click next button,it should go next step', function () {
        email.sendKeys("pedtesting@gmail.com")
        password.sendKeys("12345678")
        confirmpassword.sendKeys("12345678")
        nextButton1.click()
        expect(step2.isDisplayed).toBeTruthy
        browser.sleep(1000)
    })

    it('Case 3: If name and lastname are corrected and click next button,it should go next step', function () {
        firstname.sendKeys("ped")
        lastname.sendKeys("noi")
        nextButton2.click()
        expect(step3.isDisplayed).toBeTruthy
        browser.sleep(1000)
    })

    it('Case 4: If click register button,register should be successed', function () {
        registerButton.click()
        browser.sleep(10000)
        browser.waitForAngular()
        expect(browser.getCurrentUrl()).toBe('http://localhost:3030/#/login')
        homeButton.click()
        element(by.css('[ui-sref="register"]')).click()
        browser.get('http://localhost:3030/#/register')
    })

    it('Case 5: If register with same e-mail, notification should appear register unsuccessful', function () {
        email.sendKeys("pedtesting@gmail.com")
        password.sendKeys("12345678")
        confirmpassword.sendKeys("12345678")
        nextButton1.click()
        firstname.sendKeys("ped")
        lastname.sendKeys("noi")
        address1.sendKeys("Bangken")
        address2.sendKeys("Sarmsen")
        province.sendKeys("BKK")
        zip.sendKeys("10900")
        phonenumber.sendKeys("0812345678")
        nextButton2.click()
        cardHolder.sendKeys("DADY")
        registerButton.click()
        browser.sleep(10000)
        browser.waitForAngular()
        expect(browser.getCurrentUrl()).toBe('http://localhost:3030/#/register')
        browser.get('http://localhost:3030/#/register')
        browser.sleep(2000)
    })

    it('Case 6: If register with password shorter than 8 letters and click next button, it should stay the same step', function () {
        email.sendKeys("pedtester2@gmail.com")
        password.sendKeys("12345")
        confirmpassword.sendKeys("12345")
        nextButton1.click()
        expect(step1.isDisplayed).toBeTruthy
        clearButton.click()
    })

    it('Case 7: If register email with incorrect form and click next button, it should stay the same step', function () {
        email.sendKeys("pedtester2-gmail.com")
        password.sendKeys("1235678")
        confirmpassword.sendKeys("1235678")
        nextButton1.click()
        expect(step1.isDisplayed).toBeTruthy
        clearButton.click()
    })

    it('Case 8: If register password that does not match and click next button, it should stay the same step', function () {
        email.sendKeys("pedtester2@gmail.com")
        password.sendKeys("12345678")
        confirmpassword.sendKeys("87654321")
        nextButton1.click()
        expect(step1.isDisplayed).toBeTruthy
        clearButton.click()
    })

    it('Case 9: If register password with special charactor and click next button, it should stay the same step', function () {
        email.sendKeys("pedtester2@gmail.com")
        password.sendKeys("!@#$%^&*")
        confirmpassword.sendKeys("!@#$%^&*")
        nextButton1.click()
        browser.sleep(3000)
        expect(step2.isDisplayed).toBe(false)
        browser.get('http://localhost:3030/#/register')
    })

    it('Case 10: If register without lastname and click next button, it should stay the same step', function () {
        email.sendKeys("pedtester2@gmail.com")
        password.sendKeys("12345678")
        confirmpassword.sendKeys("12345678")
        nextButton1.click()
        firstname.sendKeys("ped")
        nextButton2.click()
        expect(step2.isDisplayed).toBeTruthy
    })
})