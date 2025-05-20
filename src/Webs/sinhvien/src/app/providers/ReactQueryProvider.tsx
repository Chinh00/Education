import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactNode} from "react";

const ReactQueryProvider = ({children}: {children: ReactNode}) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    }
  })
    return <QueryClientProvider client={client}>
        {children}
    </QueryClientProvider>
}
export default ReactQueryProvider