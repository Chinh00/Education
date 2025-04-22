import LayoutFadeIn from "@/app/components/layouts/layout_fadein.tsx";
import {Card, CardContent} from "../../../components/ui/card.tsx";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setPageLoaded} from "@/app/stores/common_slice.ts";
import {useEffect} from "react";

const Home = () => {
    return (<LayoutFadeIn>
        
        <Card className={"w-full h-[80vh]"}>
            <CardContent className={"w-full"}>
                Trang chủ
            </CardContent>
        </Card>
    </LayoutFadeIn>)
}

export default Home