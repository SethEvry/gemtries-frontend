import { Character } from "./Character";
import { User } from "./User";

export interface Gemtry {
    id: number;
    localDate: Date;
    firstRun: number;
    secondRun: number;
    bossRush: number;
    rested: number;
    redRoomOne: number;
    redRoomTwo: number;
    character: Character;
}