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

  ngOnInit(): void {
    this.glassesForm = this.fb.group({
      glassesArray: this.fb.array([])
    });
  }

  addGlasses() {

  }

  deleteGlasses(i) {

  }

}
