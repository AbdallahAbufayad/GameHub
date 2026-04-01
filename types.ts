import { ObjectId } from "mongodb";

export interface Users {
  _id?: ObjectId;
  email: string;
  username: string;
  password: string;
  level: number;
  about_me: string;
  profile_picture: string;
  collection_more: Collection_more[];
}

export interface Collection_more {
  collectionName: string;
  allGames: AllGames[];
}

export interface AllGames {
  gameId: string;
  gameName: string;
  gameImge: string;
}
