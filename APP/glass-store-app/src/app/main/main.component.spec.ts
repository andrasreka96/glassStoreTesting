import { FormBuilder } from '@angular/forms';
import { async, ComponentFixture, TestBed , inject} from '@angular/core/testing';

import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainComponent ],
      providers: [FormBuilder]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();

  });

  it('0 glasses -> price should be 0', () => {
    expect(component.price).toEqual(0);
    component.age.setValue(40);
    expect(component.age.valid).toEqual(true);
  });

  it('0 glasses -> glasses array\'s size should be 0', () => {
    expect(component.glassesArray.length).toEqual(0);
  });

  it('Add one glasses -> glasses array\'s size should be 1', () => {
    component.addGlasses();
    expect(component.glassesArray.length).toEqual(1);
  });

  it('Add one glasses and remove it -> glasses array\'s size should be 0', () => {
    component.addGlasses();
    component.deleteGlasses(0);
    expect(component.glassesArray.length).toEqual(0);
  });
  
  it('Add two glasses and reset form -> glasses array\'s size should be 0', () => {
    component.addGlasses();
    component.addGlasses();
    component.resetGlassesForm();
    expect(component.glassesArray.length).toEqual(0);
  });

  it('ApplyAgeDiscount: age:35 price:100 -> expected price: 100', () => {
    component.price = 100;
    component.applyAgeDiscount(35);
    expect(component.price).toEqual(100);
  });

  it('ApplyAgeDiscount: age:40 price:100 -> expected price: 80', () => {
    component.price = 100;
    component.applyAgeDiscount(40);
    expect(component.price).toEqual(80);
  });

  it('ApplyAgeDiscount: age:59 price:100 -> expected price: 80', () => {
    component.price = 100;
    component.applyAgeDiscount(59);
    expect(component.price).toEqual(80);
  });

  it('ApplyAgeDiscount: age:60 price:100 -> expected price: 60', () => {
    component.price = 100;
    component.applyAgeDiscount(60);
    expect(component.price).toEqual(60);
  });

  it('ApplyAgeDiscount: age:80 price:100 -> expected price: 40', () => {
    component.price = 100;
    component.applyAgeDiscount(80);
    expect(component.price).toEqual(40);
  });

  it('ApplyAgeDiscount: age:100 price:100 -> expected price: 20', () => {
    component.price = 100;
    component.applyAgeDiscount(100);
    expect(component.price).toEqual(20);
  });

  it('ApplyNumberDiscount: number of glasses:1, price: 100 -> expected price: 100', () => {
    component.price = 100;
    component.applyNumberDiscount([100]);
    expect(component.price).toEqual(100);
  });

  it('ApplyNumberDiscount: number of glasses:2, price: 200 -> expected price: 185', () => {
    component.price = 200;
    component.applyNumberDiscount([100,100]);
    expect(component.price).toEqual(185);
  });

  it('ApplyNumberDiscount: number of glasses:3, price: 300 -> expected price: 270 (-30% from the cheapest glasses)', () => {
    component.price = 300;
    component.applyNumberDiscount([100,100,100]);
    expect(component.price).toEqual(270);
  });

  it('ApplyNumberDiscount: number of glasses:5, price: 500 -> expected price: 450 (-50% from the cheapest glasses)', () => {
    component.price = 500;
    component.applyNumberDiscount([100,100,100,100,100]);
    expect(component.price).toEqual(450);
  });

  it('ApplyNumberDiscount: number of glasses:10, price: 1000 -> expected price: 900 (-100% from the cheapest glasses)', () => {
    component.price = 1000;
    component.applyNumberDiscount([100,100,100,100,100,100,100,100,100,100]);
    expect(component.price).toEqual(900);
  });

  it('ApplyNumberDiscount: number of glasses:12, price: 1200 -> expected price: 1100 (-100% from the cheapest glasses)', () => {
    component.price = 1200;
    component.applyNumberDiscount([100,100,100,100,100,100,100,100,100,100,100,100]);
    expect(component.price).toEqual(1100);
  });

  it('ApplyNumberDiscount: number of glasses:12, price: 1180 -> expected price: 1084 (-120% from the cheapest glasses)', () => {
    component.price = 1180;
    component.applyNumberDiscount([100,100,100,100,100,100,100,100,100,100,100,80]);
    expect(component.price).toEqual(1084);
  });

  it('ApplyAgeDiscount && ApplyNumberDiscount: age: 35, number of glasses: 1, price: 100 -> expected price: 100', () => {
    component.price = 100;
    component.applyAgeDiscount(35);
    component.applyNumberDiscount([100]);
    expect(component.price).toEqual(100);
  })

  it('ApplyAgeDiscount && ApplyNumberDiscount: age: 40, number of glasses: 2, price: 200 -> expected price: 145', () => {
    component.price = 200;
    component.applyAgeDiscount(40);
    component.applyNumberDiscount([100,100]);
    expect(component.price).toEqual(145);
  })
});

