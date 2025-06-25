
import {Toaster} from "react-hot-toast";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import { RoutersProvider } from "./providers/RoutersProvider";
import LocalizationMuiProvider from "@/app/providers/LocalizationMuiProvider.tsx";
import ReduxProvider from "@/app/providers/ReduxProvider.tsx";
import '@ant-design/v5-patch-for-react-19';


import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import dayjs from 'dayjs'
import {MicrosoftAuthProvider} from "@/app/providers/MicrosoftAuthProvider.tsx";
dayjs.extend(utc)
dayjs.extend(timezone)
function App() {

    return (
        <MicrosoftAuthProvider >
            <ReduxProvider >
                <ReactQueryProvider>
                    <LocalizationMuiProvider>
                        <RoutersProvider />
                    </LocalizationMuiProvider>
                    <Toaster />
                    <ReactQueryDevtools initialIsOpen={false} />
                </ReactQueryProvider>
            </ReduxProvider>
        </MicrosoftAuthProvider>
    )
}

export default App