import Cookie from "js-cookie"


class Auth {
    public static SaveToken(authenticate: Authenticate) {
        //if (!!accessToken) throw new Error("ArgumentException by access token.")
        Cookie.set("access_token", authenticate.access_token)
        Cookie.set("expires_in", `${authenticate.expires_in}`)
        Cookie.set("scope", authenticate.scope)
        Cookie.set("token_type", authenticate.token_type)
        
    }


    public static GetToken(): Authenticate {
        return {
            expires_in: Number(Cookie.get("expires_in")) || 0, 
            scope: Cookie.get("scope") || "", 
            token_type: Cookie.get("token_type") || "",
            access_token: Cookie.get("access_token") || ""
        }
    }

    public static ClearCookie() {
        Cookie.remove("accessToken")
        Cookie.remove("refreshToken")
    }
}

export default Auth

export type Authenticate = {
    access_token: string,
    expires_in: Number,
    token_type: string,
    scope: string
}

