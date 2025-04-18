import http from "@/infrastructure/http.ts";
import {UserLoginModel} from "../interface.ts";

const getAccessTokenFromServer = async (idToken: string) => {
    return await http.post("/identityservice/connect/token", {
        client_secret: "secret",
        grant_type: "external",
        client_id: "microsoft",
        scopes: ["openid", "profile", "api"],
        token: idToken,
        provider: "microsoft"
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    })
}

const getTestAccessTokenFromServer = async ({userLoginModel}: {userLoginModel: UserLoginModel}) => {
    return await http.post("/identityservice/connect/token", {
        client_secret: "secret",
        grant_type: "password",
        client_id: "sinhvientest",
        scopes: ["openid", "profile", "api.student"],
        username: userLoginModel.username,
        password: userLoginModel.password
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    })
}


export  {getAccessTokenFromServer, getTestAccessTokenFromServer}