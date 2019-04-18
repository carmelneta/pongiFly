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
    state: MatchState;
    week: number;
}
