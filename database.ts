import { Collection, MongoClient } from "mongodb";
import { Users } from "./types";
import { configDotenv } from "dotenv";
configDotenv();

const uriMongo = process.env.MONGODB;
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

export async function getUser(emailOrUsername : string) {
  //implementing mongo and actual logic later after login works fully (which needs security class stuff)

  const allUsers: Users[] = await userCollection.find().toArray();

  const currentUser: Users | undefined = allUsers.find(
    (u) =>
      u.username.toLowerCase() === emailOrUsername ||
      u.email.toLowerCase() === emailOrUsername,
  );

  return currentUser;
}
