import {Provider} from "react-redux";
import store from "../stores/stores.ts";
import {ReactNode} from "react";

const ReduxProvider = ({children}: {children: ReactNode}) => {
  return <Provider store={store} >
      {children}
  </Provider>
}
export default ReduxProvider