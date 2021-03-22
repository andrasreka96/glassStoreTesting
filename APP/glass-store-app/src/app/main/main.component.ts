import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  // Form
  glassesForm: FormGroup;
  submitted = false;
  price: number = 0;

  ngOnInit(): void {
    this.glassesForm = this.fb.group({
      age: ['', [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)
      ]],
      VIPcard: [''],
      glassesArray: this.fb.array([])
    });
  }

  addGlasses() {
    const glasses = this.fb.group({
      aGlasses: ['',[
        Validators.min(0),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)
      ]]
    });
    this.glassesArray.push(glasses);
  }

  deleteGlasses(i) {
    this.glassesArray.removeAt(i);
  }

  getAgeError(): string {
    if (this.age.hasError('required')) {
      return 'You must enter a value!';
    }
    
    if (this.age.hasError('pattern')) {
      return 'Age should be a number!'
    }

    return this.age.hasError('min') ? 'Age should be a number and bigger than 0!' : '';
  }

  getGlassesError() {
    console.log(this.glassesArray);
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

  resetGlassesForm() {
    this.submitted = false;
    this.price = 0;
    this.glassesForm.reset();
  }

  submitForm() {
    this.glassesArray.controls.forEach( formControl => {
      this.price += Number.parseInt(formControl.get('aGlasses').value);
    });
    this.submitted = true;
  }

  get glassesArray() {
    return this.glassesForm.get('glassesArray') as FormArray;
  }

  get age() {
    return this.glassesForm.get('age');
  }
}
