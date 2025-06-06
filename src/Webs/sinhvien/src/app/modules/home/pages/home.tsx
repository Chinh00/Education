import LayoutFadeIn from "@/app/components/layouts/layout_fadein.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "../../../components/ui/card.tsx";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import { useGetNotifications } from "../../common/hook.ts";
import { Bell } from "lucide-react";
import { DateTimeFormat } from "@/infrastructure/datetime_format.ts";
import { Divider } from "antd";
import {motion} from "framer-motion"
import {Collapse} from "antd"
import TimelineTable from "@/app/modules/student/components/timeline_table.tsx";

const Home = () => {

    const {data: notifications} = useGetNotifications({
        Sorts: ["CreatedAtDesc"]
    })
    return (<PredataScreen isLoading={false} isSuccess={true}>
        
        <div>
            <Card className="">
                <CardHeader className={"flex justify-start items-center"} >
        
                    <Bell size={18} className={"animate-bounce transition-all"} />
                    <CardTitle >
                        Thông báo
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    
                    <div className="space-y-4">
                        {notifications && notifications?.data?.data?.items?.map((e, index) => {
                            return (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: 10
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    transition={{
                                        duration: 0.1 * index,
                                        ease: "easeInOut"
                                    }}
                                    key={e?.id} className="">
        
                                    <Collapse
                                        size={"small"}
                                        items={[{ key: '1', label: <div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-semibold">{e?.title}</span>
                                                    <span className="text-xs text-gray-500">{DateTimeFormat(e?.createdAt)}</span>
                                                </div>
                                            </div>, children: <p>
                                                {e?.content}
                                                
                                        </p> }]}
                                    />
                                    
                                    
                                </motion.div>
                            )
                        })}
        
                    </div>
                </CardContent>
            </Card>
        </div>
    </PredataScreen>)
}

export default Home