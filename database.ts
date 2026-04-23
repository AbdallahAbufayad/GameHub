import { Collection, MongoClient } from "mongodb";
import { Users } from "./types";
import { configDotenv } from "dotenv";
configDotenv();

if (!process.env.MONGODB_URI) {
  console.error("Mongo string not defined!");
  process.exit(1);
}

const client: MongoClient = new MongoClient(process.env.MONGODB_URI);
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
