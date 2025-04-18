
import {Toaster} from "react-hot-toast";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import { RoutersProvider } from "./providers/RoutersProvider";

function App() {

    return (
        <ReactQueryProvider>
            <RoutersProvider />
            <Toaster />
            <ReactQueryDevtools initialIsOpen={false} />
        </ReactQueryProvider>
    )
}

export default App