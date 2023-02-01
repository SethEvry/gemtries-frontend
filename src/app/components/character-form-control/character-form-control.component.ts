import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Character } from 'src/app/Models/Character';

@Component({
  selector: 'app-character-form-control',
  templateUrl: './character-form-control.component.html',
  styleUrls: ['./character-form-control.component.scss']
})
export class CharacterFormControlComponent implements OnInit{

  @Input() character: Character;
  @Input() form: FormGroup;
  @Output() formEvent = new EventEmitter();


  ngOnInit(){
  }

  handleChange(){
    this.formEvent.emit();
  }



}
