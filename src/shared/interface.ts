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
}

export interface UserConfig {
    platforms?: string[];
    favourites?: string[];
}