import { CharacterClass } from "./CharacterClass";
import { User } from "./User";

export interface Character {
    id: number;
    name: string;
    characterClass: CharacterClass;
    itemLevel: number;
    user: User;
}