export interface GameType {
    id: number;
    name: string;
    cover: CoverType;
}

export interface CoverType {
    id: number;
    url: string;
}