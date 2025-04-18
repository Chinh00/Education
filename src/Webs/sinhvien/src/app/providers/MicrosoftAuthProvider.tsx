import { msalInstance } from "@/cores/msalConfig";
import {MsalProvider} from "@azure/msal-react";
import {ReactNode} from "react";

export const MicrosoftAuthProvider = ({children}: {children: ReactNode}) => {
    return <MsalProvider instance={msalInstance}>
        {children}
    </MsalProvider>
}