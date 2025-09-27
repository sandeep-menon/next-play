export interface GameType {
    id: number;
    name: string;
    cover: CoverType;
}

export interface CoverType {
    id: number;
    url: string;
}

export interface UserInfo {
    id: string;
    username: string;
    avatar: string;
    config: UserConfig;
    exp: number;
}

export interface UserConfig {
    platforms?: string[];
    favourites?: string[];
}

export interface GameDetails {
    id: string;
    name: string;
    summary: string;
    cover: string;
    genres: string[];
}

export interface SearchResultItem {
    id: string;
    name: string;
}