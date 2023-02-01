import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Character } from '../Models/Character';
import { CharacterClass } from '../Models/CharacterClass';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private url = environment.API_URL + '/characters';

  private _characters: Character[] = [];
  private _groupedClasses = [
    {
      name: 'Warrior',
      classes: [
        CharacterClass.BERSERKER,
        CharacterClass.PALADIN,
        CharacterClass.GUNLANCER,
        CharacterClass.DESTROYER,
        CharacterClass.SLAYER,
      ],
    },
    {
      name: 'Fighter',
      classes: [
        CharacterClass.STRIKER,
        CharacterClass.WARDANCER,
        CharacterClass.SCRAPPER,
        CharacterClass.SOULFIST,
        CharacterClass.GLAVIER,
      ],
    },
    {
      name: 'Gunner',
      classes: [
        CharacterClass.MACHINIST,
        CharacterClass.GUNSLINGER,
        CharacterClass.ARTILLERIST,
        CharacterClass.DEADEYE,
        CharacterClass.SHARPSHOOTER,
      ],
    },
    {
      name: 'Mage',
      classes: [
        CharacterClass.ARCANIST,
        CharacterClass.SUMMONER,
        CharacterClass.BARD,
        CharacterClass.SORCERESS,
      ],
    },
    {
      name: 'Assassin',
      classes: [
        CharacterClass.REAPER,
        CharacterClass.SHADOWHUNTER,
        CharacterClass.DEATHBLADE,
      ],
    },
    {
      name: 'Specialist',
      classes: [CharacterClass.ARTIST, CharacterClass.AEROMANCER],
    },
  ];

  constructor(private http: HttpClient) {}

  get characters() {
    return this._characters;
  }

  get groupedClasses(){
    return this._groupedClasses;
  }

  public getCharacters() {
    this.http
      .get<Character[]>(this.url)
      .subscribe((res) => (this._characters = res));
  }

  public addCharacter(character: Character) {
    this.http.post<Character>(this.url, character, {
      headers: { 'content-type': 'application/json' },
    }).subscribe(() => {
      this.getCharacters();
    });
  }

  public deletecharacter(character: Character) {
    this.http.delete(this.url + "/" + character.id)
    .subscribe(()=> {
      this.getCharacters();
    });
  }

  public classStringConverter(characterClass: CharacterClass): string {
    switch (characterClass) {
      case 0:
        return 'Berserker';
      case 1:
        return 'Paladin';
      case 2:
        return 'Gunlancer';
      case 3:
        return 'Destroyer';
      case 4:
        return 'Slayer';
      case 5:
        return 'Striker';
      case 6:
        return 'Wardancer';
      case 7:
        return 'Scrapper';
      case 8:
        return 'Soulfist';
      case 9:
        return 'Glavier';
      case 10:
        return 'Machinist';
      case 11:
        return 'Gunslinger';
      case 12:
        return 'Artillerist';
      case 13:
        return 'Deadeye';
      case 14:
        return 'Sharpshooter';
      case 15:
        return 'Arcanist';
      case 16:
        return 'Summoner';
      case 17:
        return 'Bard';
      case 18:
        return 'Sorceress';
      case 19:
        return 'Reaper';
      case 20:
        return 'Shadowhunter';
      case 21:
        return 'Deathblade';
      case 22:
        return 'Artist';
      case 23:
        return 'Aeromancer';
      default:
        return '';
    }
  }
}
