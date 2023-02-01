import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Character } from 'src/app/Models/Character';
import { CharacterService } from 'src/app/services/character.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
})
export class EntryComponent implements OnInit {
  cycleCharacters: Character[] = [];

  characterForm: FormGroup;

  isAdding: boolean = false;
  isRemoving: boolean = false;

  addForm: FormGroup | null;
  removeForm: FormGroup | null;

  constructor(
    private userService: UserService,
    private characterService: CharacterService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.characterService.getCharacters();
    this.characterForm = this.formBuilder.group({
      characters: this.formBuilder.array([]),
    });
    const date = new Date();
    date.setHours(date.getHours() - 6);
    const savedDay = localStorage.getItem('currentDay') || '';
    if (date.getDay().toString() == savedDay) {
      this.cycleCharacters = localStorage.getItem('currentCycle')
        ? JSON.parse(localStorage.getItem('currentCycle') || '')
        : [];

      if (localStorage.getItem('currentForm')) {
        const data = JSON.parse(localStorage.getItem('currentForm') || '');
        const chars = this.characterForm.get('characters') as FormArray;
        data.characters.forEach((char: any) => {
          chars.push(this.formBuilder.group(char));
        });
        this.characterForm.setValue(data);
      }

      // const currentDay = new Date();
      // const nextDay = new Date(currentDay.getDate()+1);
      // nextDay.setHours(6, 0, 0, 0);
      // setTimeout(() => {
      //   this.clearLocalStorage();
      // }, nextDay.getTime()-currentDay.getTime())
    }
  }

  get characters() {
    return this.characterService.characters;
  }

  createCharacter(): FormGroup {
    return this.formBuilder.group({
      firstRun: '',
      secondRun: '',
      bossRush: '',
      redRoom: '',
      redRoomOne: '',
      redRoomTwo: '',
    });
  }

  getCharacterForm(index: number): FormGroup {
    return this.characterForm.get(['characters', index]) as FormGroup;
  }

  startAdd() {
    this.isAdding = !this.isAdding;
    this.addForm = this.formBuilder.group({
      character: ['', Validators.required],
    });
  }
  cancelAdd() {
    this.isAdding = !this.isAdding;
    this.addForm = null;
  }
  handleAdd() {
    this.cycleCharacters.push(this.addForm?.value.character);
    const chars = this.characterForm.get('characters') as FormArray;
    chars.push(this.createCharacter());
    this.refreshLocalStorage();
    this.addForm = this.formBuilder.group({
      character: ['', Validators.required],
    });
  }

  startDelete() {
    this.isRemoving = !this.isRemoving;
    this.removeForm = this.formBuilder.group({
      character: ['', Validators.required],
    });
  }

  cancelDelete() {
    this.isRemoving = !this.isRemoving;
    this.removeForm = null;
  }

  handleDelete() {
    let index = this.cycleCharacters.indexOf(this.removeForm?.value.character);
    const chars = this.characterForm.get(['characters']) as FormArray;
    if (index >= 0) {
      this.cycleCharacters.splice(index, 1);
      chars.removeAt(index);
      if(!chars.length){
        this.characterForm = this.formBuilder.group({
          characters: this.formBuilder.array([]),
        });
      }
      this.removeForm = this.formBuilder.group({
        character: ['', Validators.required],
      });
      this.refreshLocalStorage();
    }
  }

  refreshLocalStorage() {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 6);

    localStorage.setItem('currentCycle', JSON.stringify(this.cycleCharacters));
    localStorage.setItem(
      'currentForm',
      JSON.stringify(this.characterForm.value)
    );
    localStorage.setItem('currentDay', currentDate.getDay().toString());
  }
  clearLocalStorage() {
    localStorage.removeItem('currentCycle');
    localStorage.removeItem('currentForm');
  }
}
