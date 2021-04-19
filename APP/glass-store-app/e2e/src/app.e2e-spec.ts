import { AppPage } from './app.po';
import { browser, logging, element, by } from 'protractor';
import { O_TRUNC } from 'node:constants';

let pageElements;

function getPageElements() {
  return {
    submitButton: element(by.id('submitButton')),
    resetButton: element(by.id('resetButton')),
    ageForm: element(by.id('ageFormField')),
    addButton: element(by.id('addButton')),
    loyaltyCard: element(by.id('loyaltyCard')),
    priceError: element(by.id('priceError')),
    priceLabel: element(by.id('priceLabel')),
  };
}

describe('Testing GlassStore WebApp', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    browser.waitForAngularEnabled(false);
  });

  beforeAll(() => browser.get(''));

  
});


describe('Age input', () => {
  

  //beforeAll(() => browser.get(''));

  beforeEach(() => {
    browser.get('');
    pageElements = getPageElements();
  });

  it('age form input is empty', () => {
    
    pageElements.ageForm.click();
    pageElements.addButton.click();
    browser.sleep(1000);
    let ageError = element(by.id('ageError'));
    expect(ageError.getAttribute('textContent')).toEqual('You must enter a value!');
  });

  it('age form input get string', () => {
    pageElements.ageForm.click();
    pageElements.ageForm.sendKeys('a');
    pageElements.addButton.click();
    browser.sleep(1000);
    let ageError = element(by.id('ageError'));
    expect(ageError.getAttribute('textContent')).toEqual('Age should be a number!');
  });

  it('age form input get lower value than 1', () => {
    pageElements.ageForm.click();
    pageElements.ageForm.sendKeys('0');
    pageElements.addButton.click();
    browser.sleep(1000);
    let ageError = element(by.id('ageError'));
    expect(ageError.getAttribute('textContent')).toEqual('Age should be a number and bigger than 0!');
  })

});

describe('Submit button', () => {

  beforeEach(() => {
    browser.get('')
    pageElements = getPageElements();
  });

  it('Initialize webapp -> submit button should be disabled', () => {
    expect(pageElements.submitButton.isEnabled()).toBe(false);
  });

  it('Given age and glass\'s price correctly -> submit button is enabled', () => {
    //Giving age
    pageElements.ageForm.click();
    pageElements.ageForm.sendKeys('20');
    //Giving price
    pageElements.addButton.click();
    let glassPrices = element.all(by.className('glassPrices'));
    glassPrices.get(0).sendKeys('100');
    expect(pageElements.submitButton.isEnabled()).toBe(true);
  });

  it('Given age and price, after click on submit -> submit button change to disabled',() => {
    //Giving age
    pageElements.ageForm.click();
    pageElements.ageForm.sendKeys('20');
    //Giving price
    pageElements.addButton.click();
    let glassPrices = element.all(by.className('glassPrices'));
    glassPrices.get(0).sendKeys('100');
    pageElements.submitButton.click();
    expect(pageElements.submitButton.isEnabled()).toBe(false);
  });

});

describe('Add glasses', () => {
  beforeEach(() => {
    browser.get('')
    pageElements = getPageElements();
  });

  it('add one glasses -> glassesArray size: 1', () => {
    pageElements.addButton.click();
    
    let glassPrices = element.all(by.className('glassPrices'));
    expect(glassPrices.count()).toEqual(1);
  });

  it('add one glasses and remove it -> glasssArray size: 0', () => {
    pageElements.addButton.click();
    let removeButtons = element.all(by.className('removeButtons'));
    let glassPrices = element.all(by.className('glassPrices'));
    removeButtons.get(0).click();
    expect(glassPrices.count()).toEqual(0);
  });

  it('add one glasses with input: asd -> expected error message: Price should be a valid number!', () => {
    pageElements.addButton.click();
    let glassPrices = element.all(by.className('glassPrices'));
    glassPrices.get(0).sendKeys('asd');
    let priceError = element(by.id('priceError'));
    expect(priceError.getAttribute('textContent')).toEqual('Price should be a valid number!');
  });

  
  it('add one glasses with input: 0 -> expected error message: Price should be a number bigger than 0!', () => {
    pageElements.addButton.click();
    let glassPrices = element.all(by.className('glassPrices'));
    glassPrices.get(0).sendKeys('0');
    let priceError = element(by.id('priceError'));
    expect(priceError.getAttribute('textContent')).toEqual('Price should be a number bigger than 0!');
  });

});

describe('Buying glasses', () => {
  beforeEach(() => {
    browser.get('')
    pageElements = getPageElements();
  });
  
  it('Given age and glass price when clicking on submit -> then get the total price of glasses', () => {
    //Giving age
    pageElements.ageForm.click();
    pageElements.ageForm.sendKeys('20');
    //Giving price
    pageElements.addButton.click();
    let glassPrices = element.all(by.className('glassPrices'));
    glassPrices.get(0).sendKeys('100');
    pageElements.submitButton.click();
    expect(pageElements.priceLabel.getAttribute('textContent')).toEqual('100 EUR');
  });

  it('Given age and glass price, loyalty card checked when clicking on submit -> then get the total price of glasses with 10% discount', () => {
    //Giving age
    pageElements.ageForm.click();
    pageElements.ageForm.sendKeys('20');
    //Giving price
    pageElements.addButton.click();
    let glassPrices = element.all(by.className('glassPrices'));
    glassPrices.get(0).sendKeys('100');
    pageElements.loyaltyCard.click();
    pageElements.submitButton.click();
    expect(pageElements.priceLabel.getAttribute('textContent')).toEqual('90 EUR');
  });

  it('Given age, add one glass without price when click on submit -> then total price is Nan', () => {
    //Giving age
    pageElements.ageForm.click();
    pageElements.ageForm.sendKeys('20');
    //Giving price
    pageElements.addButton.click();
    pageElements.submitButton.click();
    expect(pageElements.priceLabel.getAttribute('textContent')).toEqual('NaN EUR');
  });
});

describe('Reset button', () => {
  beforeEach(() => {
    browser.get('')
    pageElements = getPageElements();
  });

  it('Given nothing after initialization -> then reset button is enabled', () => {
    expect(pageElements.resetButton.isEnabled()).toBe(true);
  });

  it('Given age when click on reset -> then age is empty', () => {
    //Giving age
    pageElements.ageForm.click();
    pageElements.ageForm.sendKeys('20');
    pageElements.resetButton.click();
    expect(pageElements.ageForm.getAttribute('value')).toEqual('');
  });

  it('Given one glass with price when click on reset -> then number of glasses is 0', () => {
    pageElements.addButton.click();
    let glassPrices = element.all(by.className('glassPrices'));
    glassPrices.get(0).sendKeys('100');
    expect(glassPrices.count()).toEqual(1);
    pageElements.resetButton.click();
    expect(glassPrices.count()).toEqual(0);
  });
});