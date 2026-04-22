import { Collection, MongoClient } from "mongodb";
import { Users, GamesApi, Results, Game } from "./types";
import { configDotenv } from "dotenv";
configDotenv();

const uriMongo = process.env.MONGODB;

const url: string = `https://api.rawg.io/api/games?key=30778c23f4f34908a65b042d94443ba7&dates=1969-01-01,2025-11-25`;
export let counter = 1;
let gamesOfApi: GamesApi;

if (!uriMongo) {
  throw new Error("MONGODB string not defined in .env!");
}
let client: MongoClient = new MongoClient(uriMongo);
let userCollection: Collection<Users> = client
  .db("users")
  .collection("userinfo");

export async function connect() {
  try {
    await client.connect();
    console.log("Connected to the database!");
    process.on("SIGINT", exit);
  } catch (error) {
    console.error(error);
  }
}

export function exit() {
  try {
    client.close();
    console.log("Closed the database!");
  } catch (error) {
    console.error(error);
  }
}

export function loginUser() {}

export async function registerUser(newUser: Users) {
  await userCollection.insertOne(newUser);
}

export async function checkIfUserExists(
  email: string,
  username: string,
): Promise<boolean> {
  let allUsers: Users[] = await userCollection.find().toArray();
  return allUsers.some(
    (u) =>
      u.email.toLowerCase() === email || u.username.toLowerCase() === username,
  );
}

export async function getUser(emailOrUsername: string) {
  //implementing mongo and actual logic later after login works fully (which needs security class stuff)

  const allUsers: Users[] = await userCollection.find().toArray();

  const currentUser: Users | undefined = allUsers.find(
    (u) =>
      u.username.toLowerCase() === emailOrUsername ||
      u.email.toLowerCase() === emailOrUsername,
  );

  return currentUser;
}

export async function getGames() {
  gamesOfApi = await fetch(`${url}`).then((res) => res.json());
  return gamesOfApi;
}

export function increaseCounter() {
  counter += 1;
}

export function decreaseCounter() {
  counter -= 1;
}

export async function getRecentGameswithPageSize() {
  gamesOfApi = await fetch(
    `${url}&ordering=-released&page=${counter}&page_size=20`,
  ).then((res) => res.json());
  return gamesOfApi;
}

export async function getOrderdGamesByReleaseYearAsc() {
  gamesOfApi = await fetch(
    `${url}&ordering=released&page=${counter}&page_size=20`,
  ).then((res) => res.json());
  return gamesOfApi;
}

export async function getOrderdGamesByNameDes() {
  gamesOfApi = await fetch(
    `${url}&ordering=-name&page=${counter}&page_size=20`,
  ).then((res) => res.json());
  return gamesOfApi;
}

export async function getOrderdGamesByNameAsc() {
  gamesOfApi = await fetch(
    `${url}&ordering=name&page=${counter}&page_size=20`,
  ).then((res) => res.json());
  return gamesOfApi;
}

export async function getOrderdGamesByRatingDes() {
  gamesOfApi = await fetch(
    `${url}&ordering=-rating&page=${counter}&page_size=20`,
  ).then((res) => res.json());
  return gamesOfApi;
}

export async function getOrderdGamesByRatingAsc() {
  gamesOfApi = await fetch(
    `${url}&ordering=rating&page=${counter}&page_size=20`,
  ).then((res) => res.json());
  return gamesOfApi;
}

export async function getOrderdGamesBySingleplayer() {
  gamesOfApi = await fetch(
    `${url}&ordering=singleplayer&page=${counter}&page_size=20`,
  ).then((res) => res.json());
  return gamesOfApi;
}

export async function getOrderdGamesByMultiplayer() {
  gamesOfApi = await fetch(
    `${url}&ordering=multiplayer&page=${counter}&page_size=20`,
  ).then((res) => res.json());
  return gamesOfApi;
}

export async function searchGame(searchedGame: string) {
  gamesOfApi = await fetch(`${url}&search=${searchedGame}`).then((res) =>
    res.json(),
  );
  return gamesOfApi;
}

export async function getRecentGames() {
  gamesOfApi = await fetch(`${url}&ordering=-released`).then((res) =>
    res.json(),
  );
  return gamesOfApi;
}
