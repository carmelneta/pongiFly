export interface User {
    name: string;
    uid: string;
}

export interface PlayerMath extends User {
    approve: boolean;
}

export enum MatchState {
    set,
    played,
    approved,
}

export interface Match {
    players: PlayerMath[];
    playersIds: string[];   //  Query helper :)
    results: string[];
    state: MatchState;
    week: number;
}
