import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Character } from 'src/app/Models/Character';
import { CharacterClass } from 'src/app/Models/CharacterClass';
import { CharacterService } from 'src/app/services/character.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit{
  displayedColumns: string[] = [
    
    'char-name',
    'char-class',
    'char-ilvl',
  ];
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
  }

  get user() {
    return this.userService.user;
  }

  get characters() {
    return this.characterService.characters;
  }

  get groups() {
    return this.characterService.groupedClasses;
  }

  startAdd() {
    this.isAdding = !this.isAdding;
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      characterClass: ['', Validators.required],
      itemLevel: '',
    });
  }
  cancelAdd() {
    this.isAdding = !this.isAdding;
    this.addForm = null;
  }

  handleAdd() {
    const character: Character = {
      id: 0,
      name: this.addForm?.value.name,
      characterClass: this.addForm?.value.characterClass,
      itemLevel: this.addForm?.value.itemLevel,
      user: this.userService.user!,
    };
    this.characterService.addCharacter(character);
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      characterClass: ['', Validators.required],
      itemLevel: '',
    });
  }

  startDelete() {
    this.isRemoving = !this.isRemoving;
    this.removeForm = this.formBuilder.group({
      character: ['', Validators.required],
    });
  }

  cancelRemoving() {
    this.isRemoving = !this.isRemoving;
    this.removeForm = null;
  }

  handleRemove() {
    if(confirm('Are you sure?')){
    this.characterService.deletecharacter(this.removeForm?.value.character)
    this.removeForm = this.formBuilder.group({
      character: ['', Validators.required],
    });
    }

  }

  classText(characterClass: CharacterClass) {
    return this.characterService.classStringConverter(characterClass);
  }
}
