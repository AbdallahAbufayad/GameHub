import { Double, ObjectId } from "mongodb";

export interface Users {
  _id?: ObjectId;
  email: string;
  username: string;
  password: string;
  level: number;
  about_me: string;
  profile_picture: string;
  collection_more: Collection_more[];
  public_profile: boolean;
}

interface Collection_more {
  collectionName: string;
  allGames: AllGames[];
}

interface AllGames {
  gameId: string;
  gameName: string;
  gameImge: string;
}

export interface GamesApi {
  count: number;
  next: string;
  previous: null;
  results: Results[];
  user_platforms: false;
}

export interface Results {
  slug: string;
  name: string;
  playtime: number;
  platforms: Platforms[];
  stores: Stores[];
  released: string;
  tba: string;
  background_image: string;
  rating: Double;
  rating_top: number;
  ratings: Ratings[];
  ratings_count: number;
  reviews_text_count: number;
  added: number;
  added_by_status: Added_by_status;
  metacritic: number;
  suggestions_count: number;
  updated: string;
  id: number;
  score: null;
  clip: null;
  tags: Tags[];
  esrb_rating: Esrb_rating;
  user_game: null;
  reviews_count: number;
  saturated_color: string;
  dominant_color: string;
  short_screenshots: Short_screenshots[];
  parent_platforms: Platforms[];
  genres: Genres[];
}

interface Platforms {
  platform: Platform;
}

interface Platform {
  id: number;
  name: string;
  slug: string;
}

interface Stores {
  store: Store;
}

interface Store {
  id: number;
  name: string;
  slug: string;
}

interface Ratings {
  id: number;
  title: string;
  count: number;
  percent: Double;
}

interface Added_by_status {
  yet: number;
  owned: number;
  beaten: number;
  toplay: number;
  dropped: number;
  playing: number;
}

interface Tags {
  id: number;
  name: string;
  slug: string;
  language: string;
  games_count: number;
  image_background: string;
}

interface Esrb_rating {
  id: number;
  name: string;
  slug: string;
  name_en: string;
  name_ru: string;
}

interface Short_screenshots {
  id: number;
  image: string;
}

interface Genres {
  id: number;
  name: string;
  slug: string;
}
