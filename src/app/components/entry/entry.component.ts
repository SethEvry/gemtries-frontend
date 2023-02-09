import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Character } from 'src/app/Models/Character';
import { Gemtry } from 'src/app/Models/Gemtry';
import { CharacterService } from 'src/app/services/character.service';
import { GemtryService } from 'src/app/services/gemtry.service';
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
    private gemtryService: GemtryService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {

    //get/refresh daily gemtryies
    this.gemtryService.getDailies();
    //refresh a user's character list
    this.characterService.getCharacters();

    //initialize character form
    this.characterForm = this.formBuilder.group({
      characters: this.formBuilder.array([]),
    });

    //if there are entries for the day, have that populate the list instead of
    //local storage

    if(this.gemtryService.daily.length){
      const chars = this.characterForm.get('characters') as FormArray;
      this.gemtryService.daily.forEach(gemtry =>{
        this.cycleCharacters.push(gemtry.character);
        chars.push(this.createCharacter(gemtry.character))
      })

    }

    //check to see if the day for the items in localstorage is today
    const date = new Date();

    //get hours is -6 because new Date() sets up a local time (est) 
    //and I want it count a new day as 6 am the next day
    //there's better ways to do it, but this app is for me anyway
    date.setHours(date.getHours() - 6);

    const savedDay = localStorage.getItem('currentDay') || '';

    if (date.getDay().toString() == savedDay && !this.gemtryService.daily.length) {
      //set current cycled characters to that from local storage
      this.cycleCharacters = localStorage.getItem('currentCycle')
        ? JSON.parse(localStorage.getItem('currentCycle') || '')
        : [];

      //set formgroups of characterForm to those in localstorage
      if (localStorage.getItem('currentForm')) {
        const data = JSON.parse(localStorage.getItem('currentForm') || '');
        const chars = this.characterForm.get('characters') as FormArray;
        data.characters.forEach((char: any) => {
          chars.push(this.formBuilder.group(char));
        });
        this.characterForm.setValue(data);
      }
    }

    if (this.userService.user?.hasSubmitted) {
      this.characterForm.disable();
    }
  }

  get characters() {
    return this.characterService.characters;
  }

  createCharacter(character: Character): FormGroup {
    const gemtry:Gemtry | null = this.gemtryService.getDailyGemtry(character);
    if(gemtry){
      let redRoom = gemtry.redRoomOne > 0 ? 1 : 0 + gemtry.redRoomTwo > 0 ? 1 : 0;
      return this.formBuilder.group({
        firstRun: gemtry.firstRun,
        secondRun: gemtry.secondRun,
        bossRush: gemtry.bossRush,
        redRoom: redRoom,
        redRoomOne: gemtry.redRoomOne,
        redRoomTwo: gemtry.redRoomTwo,
      });
    }
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

  //reveals add character form and creates formgroup
  startAdd() {
    this.isAdding = !this.isAdding;
    this.addForm = this.formBuilder.group({
      character: ['', Validators.required],
    });
  }

  //cancels add character form and wipes form group
  cancelAdd() {
    this.isAdding = !this.isAdding;
    this.addForm = null;
  }

  //adds character to today's cycle, creates a formgroup for them, refreshes localstorage, 
  //then clears form to be able to add another
  handleAdd() {
    this.cycleCharacters.push(this.addForm?.value.character);
    const chars = this.characterForm.get('characters') as FormArray;
    chars.push(this.createCharacter(this.addForm?.value.character));
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
      if (!chars.length) {
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

  //create/refreshes localstorage instances of currentday, cycle, and characterForm
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

  //creates an array of gemtries from the characterForm and saves to database
  //then disables the form (backend sets user.hasSubmitted to true)

  handleSubmit() {
    const gemtries: Gemtry[] = this.characterForm.value.characters.map(
      (gemtry: any, index: number) => {
        const character = this.cycleCharacters[index];
        const foundGem = this.gemtryService.getDailyGemtry(character);
        const date = new Date();
        date.setHours(date.getHours() - 6);
        const newGemtry: Gemtry = {
          id: foundGem ? foundGem.id : 0,
          localDate: date,
          firstRun: gemtry.firstRun,
          secondRun: gemtry.secondRun,
          bossRush: parseInt(gemtry.bossRush) || 0,
          rested: 2,
          redRoomOne:
            (parseInt(gemtry.redRoom) || 0) > 0
              ? parseInt(gemtry.redRoomOne) || 0
              : 0,
          redRoomTwo:
            (parseInt(gemtry.redRoom) || 0) > 1
              ? parseInt(gemtry.redRoomTwo) || 0
              : 0,
          character: character,
          user: this.userService.user!,
        };
        return newGemtry;
      }
    );
    this.characterForm.disable();
    this.gemtryService.saveGemtries(gemtries);
  }
}
