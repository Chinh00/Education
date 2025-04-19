
import {Toaster} from "react-hot-toast";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import { RoutersProvider } from "./providers/RoutersProvider";
import LocalizationMuiProvider from "@/app/providers/LocalizationMuiProvider.tsx";

function App() {

    return (
        <ReactQueryProvider>
            <LocalizationMuiProvider>
                <RoutersProvider />
            </LocalizationMuiProvider>
            <Toaster />
            <ReactQueryDevtools initialIsOpen={false} />
        </ReactQueryProvider>
    )
}

export default App