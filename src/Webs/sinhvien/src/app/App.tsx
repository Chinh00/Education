import {RoutersProvider} from "./providers/RoutersProvider.tsx";
import { Toaster } from 'react-hot-toast';
import ReactQueryProvider from "./providers/ReactQueryProvider.tsx";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {persistor} from "@/app/stores/stores.ts";
import ReduxProvider from './providers/ReduxProvider.tsx';
import { PersistGate } from 'redux-persist/integration/react';
function App() {
  return (
    // <MicrosoftAuthProvider>
        <ReduxProvider>
            <PersistGate loading={null} persistor={persistor}>
                <ReactQueryProvider>
                    <RoutersProvider />
                    <Toaster />
                    <ReactQueryDevtools initialIsOpen={false} />
                </ReactQueryProvider>
            </PersistGate>
        </ReduxProvider>
    // </MicrosoftAuthProvider>
  )
}

export default App
