import http from "@/infrastructure/http.ts";
import { UserLoginModel } from "../interface.ts";
import { AxiosResponse } from "axios";
import { UserInfo } from "@/domain/user_info.ts";

const getAccessTokenFromServer = async (idToken: string) => {
  return await http.post("/identityservice/connect/token", {
    client_secret: "secret",
    grant_type: "microsoft",
    client_id: "microsoft",
    scopes: ["openid", "profile", "api.student"],
    id_token: idToken,
    provider: "microsoft"
  }, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    }
  })
}

const getTestAccessTokenFromServer = async ({ userLoginModel }: { userLoginModel: UserLoginModel }) => {
  return await http.post("/identityservice/connect/token", {
    client_secret: "secret",
    grant_type: "external_student",
    client_id: "sinhvientest",
    scopes: ["openid", "profile", "api.student"],
    student_code: userLoginModel.username,
  }, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    }
  })
}

const getUserInfo = async (): Promise<AxiosResponse<UserInfo, any>> => await http.post("/identityservice/connect/userinfo")

export { getAccessTokenFromServer, getTestAccessTokenFromServer, getUserInfo }
