import LayoutFadeIn from "@/app/components/layouts/layout_fadein.tsx";
import {Card, CardContent} from "../../../components/ui/card.tsx";

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