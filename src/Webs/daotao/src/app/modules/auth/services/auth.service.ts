import http from "@/infrastructure/http";
import {AxiosResponse} from "axios";
import {UserInfo} from "@/domain/user_info.ts";


export type AuthLoginModel = {
    username: string;
    password: string;
}
const getTestAccessTokenFromServer = async ({userLoginModel}: {userLoginModel: AuthLoginModel}) => {
    return await http.post("/identityservice/connect/token", {
        client_secret: "secret",
        grant_type: "password",
        client_id: "daotao",
        scopes: ["openid", "profile", "api.admin", "role"],
        username: userLoginModel.username,
        password: userLoginModel.password
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    })
}

const getUserInfo = async (): Promise<AxiosResponse<UserInfo, any>> => {
    return await http.post("/identityservice/connect/userinfo")
}



export {getTestAccessTokenFromServer, getUserInfo}