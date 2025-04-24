
import loadable from "@loadable/component"
import Header from "@/app/components/header/header.tsx";
import {useAppDispatch} from "@/app/stores/hook.ts";
import {useEffect} from "react";
import { setGroupFuncName } from "@/app/stores/common_slice.ts";

const HomeSidebar = loadable(() => import('../components/home_sidebar.tsx'), {
  fallback: <div>Loading...</div>,
})


const Home = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setGroupFuncName({groupName: "Trang chủ"}));
  }, []);
  return <div className={"grid grid-cols-12 "} style={{flexWrap: "nowrap"}}>
    <div className={"col-span-12"}><Header /></div>
    <div className={"col-span-2"}><HomeSidebar /></div>
    <div className={"col-span-10 h-screen p-4 border-t-2"}>

      Home
    </div>
  </div>
}
export default Home