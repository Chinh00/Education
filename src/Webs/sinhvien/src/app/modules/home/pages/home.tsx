import LayoutFadeIn from "@/app/components/layouts/layout_fadein.tsx";
import {Card, CardContent} from "../../../components/ui/card.tsx";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";

const Home = () => {
    return (<PredataScreen isLoading={false} isSuccess={true}>
        
        <Card className={"w-full h-[80vh]"}>
            <CardContent className={"w-full"}>
                Trang chủ
            </CardContent>
        </Card>
    </PredataScreen>)
}

export default Home