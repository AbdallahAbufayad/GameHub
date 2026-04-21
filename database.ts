import { Users } from "./types";

export function getUser() : Users{

    //implementing mongo and actual logic later after login works fully (which needs security class stuff)

    try{

    }
    catch(e){

    }
    finally{

    }

    const user : Users = {
        username: "username",
        email: "",
        password: "",
        level: 1,
        about_me: "Geen info gevonden",
        profile_picture: "/images/user.png",
        collection_more: [],
        public_profile: false
    }

    return user;
}
