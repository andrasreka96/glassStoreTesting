import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  // Form
  glassesForm: FormGroup;

  // Is the form submitted?
  submitted = false;

  //The total price to be paid
  price: number = 0;

  ngOnInit(): void {
    // Init the form
    this.glassesForm = this.fb.group({
      age: ['', [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)
      ]],
      VIPcard: [false],
      glassesArray: this.fb.array([])
    });
  }

  // Adds a glasses form element (textbox) to the formarray
  addGlasses() {
    const glasses = this.fb.group({
      aGlasses: ['',[
        Validators.min(1),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)
      ]]
    });
    this.glassesArray.push(glasses);
  }

  // Deletes glasses form element from the formarray
  deleteGlasses(i) {
    this.glassesArray.removeAt(i);
  }

  // Returns the error message for the age field
  getAgeError(): string {
    if (this.age.hasError('required')) {
      return 'You must enter a value!';
    }
    
    if (this.age.hasError('pattern')) {
      return 'Age should be a number!'
    }

    return this.age.hasError('min') ? 'Age should be a number and bigger than 0!' : '';
  }

  // Returns the error message for the glasses formarray
  getGlassesError() {
    var message = '';
    if (this.glassesArray.invalid) {
      this.glassesArray.controls.forEach( formControl => {
        console.log(formControl.get('aGlasses'));
        console.log(this.glassesForm.get('age'))
        if (formControl.get('aGlasses').hasError('min')) {
          message = 'Price should be a number bigger than 0!';
        } 
        if (formControl.get('aGlasses').hasError('pattern')) {
          message = 'Price should be a valid number!';
        }
      });
    }
    return message;
  }

  // Resets the form, sets price to 0
  resetGlassesForm() {
    this.submitted = false;
    this.price = 0;
    this.glassesArray.clear();
    this.glassesForm.reset();
  }

  // Submits the form, calculates the discounts
  submitForm() {
    let glassesPrices = [];

    this.glassesArray.controls.forEach( formControl => {
      let value = Number.parseInt(formControl.get('aGlasses').value);
      // bug#1: next line should be inside of if{...}
      this.price += value;
      if (value !== undefined) {
        glassesPrices.push(value);
      }
    });
    this.submitted = true;

    var VIPcardDiscount = 0;
    if (this.VIPcard.value) {
      VIPcardDiscount = (this.price * 10) / 100;
    }

    this.applyAgeDiscount(Number.parseInt(this.age.value));

    if (this.VIPcard.value) {
      this.price -=  VIPcardDiscount;
      console.log('Applied VIP card discount.');
    }

    this.applyNumberDiscount(glassesPrices);
  }

  // Applies discount for the final price based on age 
  applyAgeDiscount(age : number) {
    if (age >= 40 && age < 60) {
      this.price = this.price - (this.price * 20) / 100;
      console.log('Applied Age 40-59 +20% discount.');

    } else if (age >= 60 && age < 80) {
      this.price = this.price - (this.price * 40) / 100;
      console.log('Applied Age 60-79 +40% discount.');

    } else if (age <= 80 && age < 100) { //bug #2: it should be: age >= 80
      this.price = this.price - (this.price * 60) / 100;
      console.log('Applied Age 80-99 +60% discount.');

    } else if (age >= 100) {
      this.price = this.price - (this.price * 80) / 100;
      console.log('Applied Age 100-119 +80% discount.');
    }
  }

  // Applies discount based on the number of glasses bought
  applyNumberDiscount(prices : number[]) {
    if (prices.length == 2) {
      if (prices[0] < prices[1]) {
        this.price = this.price - (prices[0] * 15) / 100;
        console.log('Applied discount after 2 glasses, for the 1. glasses.');
      } else {
        this.price = this.price - (prices[1] * 15) / 100;
        console.log('Applied discount after 2 glasses, for the 2. glasses.');
      }
    } 
    if (prices.length > 2) {
      let minPrice = prices[0];
      prices.forEach( p => {
        if (p < minPrice) {
          minPrice = p;
        }
      });
      let discount = (minPrice * 10 * prices.length) / 100; 
      this.price = this.price - discount;
      console.log('Applied discount after more than 3 glasses, for ' + minPrice + ' priced glasses.');
    }
  }

  // Getters for form elements
  get glassesArray() {
    return this.glassesForm.get('glassesArray') as FormArray;
  }

  get age() {
    return this.glassesForm.get('age');
  }

  get VIPcard() {
    return this.glassesForm.get('VIPcard');
  }
}
