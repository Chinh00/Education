import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactNode, useEffect} from "react";
import {useAppSelector} from "@/app/stores/hook.ts";

const ReactQueryProvider = ({children}: {children: ReactNode}) => {
  const client = new QueryClient()
  const {authenticate} = useAppSelector(e => e.common)
  useEffect(() => {
    if (authenticate === false) {
      client.clear()
    }
  }, [authenticate]);
    return <QueryClientProvider client={client}>
        {children}
    </QueryClientProvider>
}
export default ReactQueryProvider