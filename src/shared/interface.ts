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

export interface CompanyProps {
    id: string;
    developer: boolean;
    publisher: boolean;
    company: CompanyType;
}

export interface CompanyType {
    id: string;
    name: string;
    websites: WebsiteType[];
}

export interface WebsiteType {
    id: string;
    url: string;
}

export interface SimilarGameType {
    id: string;
    name: string;
    cover: CoverType;
    genres: GenreType[];
}

export interface GenreType {
    id: string;
    name: string;
}