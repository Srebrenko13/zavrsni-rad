import {AccountData} from "../models/AccountData";

export const emptyUser: AccountData = {
    id: -1,
    username: "Loading",
    email: "",
    dateCreated: new Date("1.1.1970."),
    loginStatus: false
}

export const basePath = "http://localhost:8080"