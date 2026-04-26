import { Collection, MongoClient } from "mongodb";
import { Users, GamesApi, Results, Game } from "./types";
import { configDotenv } from "dotenv";
configDotenv();

if (!process.env.MONGODB) {
  console.error("Mongo string not defined!");
  process.exit(1);
}

let gamesOfApi: GamesApi;
export let counter = 1;
const url: string =
  "https://api.rawg.io/api/games?key=30778c23f4f34908a65b042d94443ba7&dates=1969-01-01,2026-04-11";
const client: MongoClient = new MongoClient(process.env.MONGODB);
let userCollection: Collection<Users> = client
  .db("users")
  .collection("userinfo");

export async function exit() {
  try {
    await client.close();
    console.log("Database closed!");
    process.exit(0);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}

export async function connect() {
  try {
    await client.connect();
    console.log("Database successfully connected!");
    process.on("SIGINT", exit);
    process.on("SIGUSR2", exit);
  } catch (error) {
    console.error(error);
    process.exit(1);
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

//////////////

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
