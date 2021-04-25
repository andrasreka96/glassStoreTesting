import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from '../app.component';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { MainComponent } from '../main/main.component';

/* Outer imports */
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Angular Material imports */
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        AppComponent,
        MainComponent,
        PageHeaderComponent
      ],
      providers: [
        FormBuilder
      ],
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatToolbarModule,
        MatCardModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    TestBed.inject(FormBuilder);
    component.ngOnInit();
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

// Logic tests

  describe('logic testing of MainComponent', () => {
    it('with 0 glasses price should be 0', () => {
      expect(component.price).toEqual(0);
      component.age.setValue(40);
      expect(component.age.valid).toEqual(true);
    });
  
    it('with 0 glasses the glasses array\'s size should be 0', () => {
      expect(component.glassesArray.length).toEqual(0);
    });

    describe('logic testing of ApplyAgeDiscount && ApplyNumberDiscount', () => {
      it('should modify the price to 100 if prices of glasses = [ 100 ], age = 35 (no discount)', () => {
        component.price = 100;
        component.applyAgeDiscount(35);
        component.applyNumberDiscount([100]);
        expect(component.price).toEqual(100);
      })
    
      it('should modify the price to 145 if prices of glasses = [ 100, 100 ], age = 40', () => {
        component.price = 200;
        component.applyAgeDiscount(40);
        component.applyNumberDiscount([100,100]);
        expect(component.price).toEqual(145);
      })
    });

  });

// Function unit tests

  describe('addGlasses of MainComponent', () => {
    beforeEach(() => {
      component.resetGlassesForm();
    });

    it ('should push a new glasses form to the glassesArray', () => {
      expect(component.glassesArray.length).toEqual(0);
      component.addGlasses();
      expect(component.glassesArray.length).toEqual(1);
    });
  });

  describe('deleteGlasses of MainComponent', () => {
    beforeEach(() => {
      component.resetGlassesForm();
    });

    it('should remove one element of 1 element long glassesArray', () => {
      expect(component.glassesArray.length).toEqual(0);
      component.addGlasses();
      component.deleteGlasses(0);
      expect(component.glassesArray.length).toEqual(0);
    });

    it ('should remove two elements of 5 element long glassesArray', () => {
      expect(component.glassesArray.length).toEqual(0);
      for (let i = 0; i < 5; ++i) {
        component.addGlasses();
      }
      expect(component.glassesArray.length).toEqual(5);
      component.deleteGlasses(3);
      component.deleteGlasses(1);
      expect(component.glassesArray.length).toEqual(3);
    });

    it ('should remove the 1st and 3rd correctly element of 5 element long glassesArray', () => {
      expect(component.glassesArray.length).toEqual(0);
      for (let i = 0; i < 5; ++i) {
        component.addGlasses();
        component.glassesArray.controls[i].get('aGlasses').setValue(i);
      }
      expect(component.glassesArray.length).toEqual(5);

      // Delete the 1st and the 3rd element, check if these are the only ones deleted
      component.deleteGlasses(3);
      component.deleteGlasses(1);
      expect(component.glassesArray.length).toEqual(3);
      expect(Number.parseInt(component.glassesArray.controls[0].get('aGlasses').value)).toEqual(0);
      expect(Number.parseInt(component.glassesArray.controls[1].get('aGlasses').value)).toEqual(2);
      expect(Number.parseInt(component.glassesArray.controls[2].get('aGlasses').value)).toEqual(4);
    });
  });

  describe('getAgeError of MainComponent', () => {
    beforeEach(() => {
      component.resetGlassesForm();
    });

    it ('should return error msg if age is missing', () => {
      const ageControl = component.age;
      
      ageControl.setErrors({
        required: true
      });

      expect(ageControl.valid).toEqual(false);
      expect(ageControl.errors).toEqual({ required: true });

      expect(component.getAgeError()).toEqual('You must enter a value!');
    });

    it ('should return error msg if age is not a number', () => {
      const ageControl = component.age;
      
      ageControl.setErrors({
        pattern: true
      });

      expect(ageControl.valid).toEqual(false);
      expect(ageControl.errors).toEqual({ pattern: true });

      expect(component.getAgeError()).toEqual('Age should be a number!');
    });

    it ('should return error msg if age is a negative number', () => {
      const ageControl = component.age;
      
      ageControl.setErrors({
        min: true
      });

      expect(ageControl.valid).toEqual(false);
      expect(ageControl.errors).toEqual({ min: true });

      expect(component.getAgeError()).toEqual('Age should be a number and bigger than 0!');
    });

    it ('should return empty string if age is valid', () => {
      const ageControl = component.age;
      
      ageControl.setValue(52);

      expect(ageControl.valid).toEqual(true);

      expect(component.getAgeError()).toEqual('');
    });
  });

  describe('getGlassesError of MainComponent', () => {
    beforeEach(() => {
      component.resetGlassesForm();
    });

    it ('should return empty string if there is no error in glassesArray', () => {
      expect(component.glassesArray.length).toEqual(0);
      component.addGlasses();
      const glassesControl = component.glassesArray.controls[0].get('aGlasses');
      glassesControl.setValue("100");
      expect(glassesControl.valid).toEqual(true);
      expect(component.getGlassesError()).toEqual('');
    });

    it ('should return error msg if price is a negative number', () => {
      expect(component.glassesArray.length).toEqual(0);
      component.addGlasses();
      const glassesControl = component.glassesArray.controls[0].get('aGlasses');

      glassesControl.setValue(-1);
      expect(glassesControl.valid).toEqual(false);
      expect(component.getGlassesError()).toEqual('Price should be a number bigger than 0!');
    });

    it ('should return error msg if price is not a number', () => {
      expect(component.glassesArray.length).toEqual(0);
      component.addGlasses();
      const glassesControl = component.glassesArray.controls[0].get('aGlasses');

      glassesControl.setValue('NotANumber');
      expect(glassesControl.valid).toEqual(false);
      expect(component.getGlassesError()).toEqual('Price should be a valid number!');
    });
  });

  describe('resetGlassesForm of MainComponent', () => {
    it('with two glasses in the array it should reset the form and glasses array\'s size should be 0', () => {
      expect(component.glassesArray.length).toEqual(0);
      component.addGlasses();
      component.addGlasses();
      component.resetGlassesForm();
      expect(component.glassesArray.length).toEqual(0);
    });
    
    it ('should reset the form and the values related', () => {
      expect(component.glassesArray.length).toEqual(0);
      component.submitted = true;
      component.price = 1000;
      component.addGlasses();
      component.addGlasses();
      component.addGlasses();
      component.age.setValue(30);
      component.VIPcard.setValue(true);

      component.resetGlassesForm();

      expect(component.submitted).toEqual(false);
      expect(component.price).toEqual(0);
      expect(component.age.value).toEqual(null);
      expect(component.age.pristine).toEqual(true);
      expect(component.VIPcard.value).toEqual(null);
      expect(component.VIPcard.pristine).toEqual(true);
      expect(component.glassesArray.length).toEqual(0);
    });
  });

  describe('submitForm of MainComponent', () => {
    beforeEach(() => {
      component.resetGlassesForm();
    });

    it('should modify the price to 246 if prices of glasses = [ 80, 90, 100 ], and age = 20 and VIPcard = false', () => {
      // Setting up form:
      component.glassesForm.controls.age.setValue(20);
      component.glassesForm.controls.VIPcard.setValue(false);
      component.addGlasses();
      component.addGlasses();
      component.addGlasses();
      let values = [80,90,100];
      let i = 0;
      component.glassesArray.controls.forEach( formControl => {
        formControl.get('aGlasses').setValue(values[i]);
        i++;
      });
      // Check result:
      component.submitForm();
      expect(component.price).toEqual(246);
      expect(component.submitted).toEqual(true);
    });

    it('should modify the price to 165 if prices of glasses = [ 80, 90, 100 ], and age = 65 and VIPcard = true', () => {
      // Setting up form:
      component.glassesForm.controls.age.setValue(40);
      component.glassesForm.controls.VIPcard.setValue(true);
      component.addGlasses();
      component.addGlasses();
      component.addGlasses();
      let values = [80,90,100];
      let i = 0;
      component.glassesArray.controls.forEach( formControl => {
        formControl.get('aGlasses').setValue(values[i]);
        i++;
      });
      // Check result:
      component.submitForm();
      expect(component.price).toEqual(165);
      expect(component.submitted).toEqual(true);
    });

    it('should modify the price to 120 if prices of glasses = [ 80, 90, 100, 110 ], and age = 88 and VIPcard = false', () => {
      // Setting up form:
      component.glassesForm.controls.age.setValue(88);
      component.glassesForm.controls.VIPcard.setValue(false);
      component.addGlasses();
      component.addGlasses();
      component.addGlasses();
      component.addGlasses();
      let values = [80,90,100,110];
      let i = 0;
      component.glassesArray.controls.forEach( formControl => {
        formControl.get('aGlasses').setValue(values[i]);
        i++;
      });
      // Check result:
      component.submitForm();
      expect(component.price).toEqual(120);
      expect(component.submitted).toEqual(true);
    });

    it('should not count those glassesArray elements that are NaN', () => {
      // Setting up form:
      component.glassesForm.controls.age.setValue(18);
      component.glassesForm.controls.VIPcard.setValue(false);
      component.addGlasses();
      component.addGlasses();
      component.glassesArray.controls[0].get('aGlasses').setValue("100");
      component.glassesArray.controls[1].get('aGlasses').setValue("badvalue");
      // Check result:
      component.submitForm();
      expect(component.price).toEqual(100);
      expect(component.submitted).toEqual(true);
    });

    it('should not count those glassesArray elements that are undefined', () => {
      // Setting up form:
      component.glassesForm.controls.age.setValue(18);
      component.glassesForm.controls.VIPcard.setValue(false);
      component.addGlasses();
      component.addGlasses();
      component.glassesArray.controls[0].get('aGlasses').setValue("100");
      component.glassesArray.controls[1].get('aGlasses').setValue(undefined);
      // Check result:
      component.submitForm();
      expect(component.price).toEqual(100);
      expect(component.submitted).toEqual(true);
    });
  });

  describe('applyAgeDiscount of MainComponent', () => {
    /* Customers older than 40 years for each 20 years above 40 years get +20% discount:
    - 40-59 : 20%
    - 60-79 : 40%
    - 80-99 : 60%
    - 100-119 : 80% */
    
    beforeEach(() => {
      component.resetGlassesForm();
    });
    
    it('should modify the price to 100 if age = 35 and price = 100', () => {
      component.price = 100;
      component.applyAgeDiscount(35);
      expect(component.price).toEqual(100);
    });

    it('should modify the price to 80 if age = 40 and price = 100', () => {
      component.price = 100;
      component.applyAgeDiscount(40);
      expect(component.price).toEqual(80);
    });

    it('should modify the price to 80 if age = 59 and price = 100', () => {
      component.price = 100;
      component.applyAgeDiscount(59);
      expect(component.price).toEqual(80);
    });

    it('should modify the price to 60 if age = 60 and price = 100', () => {
      component.price = 100;
      component.applyAgeDiscount(60);
      expect(component.price).toEqual(60);
    });

    it('should modify the price to 40 if age = 80 and price = 100', () => {
      component.price = 100;
      component.applyAgeDiscount(80);
      expect(component.price).toEqual(40);
    });

    it('should modify the price to 20 if age = 100 and price = 100', () => {
      component.price = 100;
      component.applyAgeDiscount(100);
      expect(component.price).toEqual(20);
    });
  });
  
  describe('applyNumberDiscount of MainComponent', () => {
    beforeEach(() => {
      component.resetGlassesForm();
    });

    it('should modify the price to 100 if prices of glasses = [ 100 ] (no discount)', () => {
      component.price = 100;
      component.applyNumberDiscount([100]);
      expect(component.price).toEqual(100);
    });

    it('should modify the price to 185 if prices of glasses = [ 100, 100 ] (-15% from the cheapest glasses)', () => {
      component.price = 200;
      component.applyNumberDiscount([100,100]);
      expect(component.price).toEqual(185);
    });

    it('should modify the price to 168 if prices of glasses = [ 80, 100 ] (-15% from the cheapest glasses)', () => {
      component.price = 180;
      component.applyNumberDiscount([80,100]);
      expect(component.price).toEqual(168);
    });
    
    it('should modify the price to 270 if prices of glasses = 3 x 100eur (-30% from the cheapest glasses)', () => {
      component.price = 300;
      component.applyNumberDiscount([100,100,100]);
      expect(component.price).toEqual(270);
    });

    it('should modify the price to 450 if prices of glasses = 5 x 100eur (-50% from the cheapest glasses)', () => {
      component.price = 500;
      component.applyNumberDiscount([100,100,100,100,100]);
      expect(component.price).toEqual(450);
    });
  
    it('should modify the price to 900 if prices of glasses = 10 x 100eur (-100% from the cheapest glasses)', () => {
      component.price = 1000;
      component.applyNumberDiscount([100,100,100,100,100,100,100,100,100,100]);
      expect(component.price).toEqual(900);
    });
  
    it('should modify the price to 1080 if prices of glasses = 12 x 100eur (-110% from the cheapest glasses)', () => {
      component.price = 1200;
      component.applyNumberDiscount([100,100,100,100,100,100,100,100,100,100,100,100]);
      expect(component.price).toEqual(1080);
    });
  
    it('should modify the price to 1100 if prices of glasses = 11 x 100eur, 1 x 80eur (-120% from the cheapest glasses)', () => {
      component.price = 1180;
      component.applyNumberDiscount([100,100,100,100,100,100,100,100,100,100,100,80]);
      expect(component.price).toEqual(1084);
    });
  });
});

