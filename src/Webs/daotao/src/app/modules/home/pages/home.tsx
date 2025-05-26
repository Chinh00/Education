
import loadable from "@loadable/component"
import Header from "@/app/components/header/header.tsx";
import {useAppDispatch} from "@/app/stores/hook.ts";
import {useEffect} from "react";
import { setGroupFuncName } from "@/app/stores/common_slice.ts";
import {Overview} from "@/app/modules/home/components/overview.tsx";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent
} from "@/app/components/ui/card.tsx"
import {Button} from "@/app/components/ui/button.tsx";
import {Activity, BookOpen, Calendar, LayoutDashboard, UserPlus } from "lucide-react";
import {Typography} from "antd";

const HomeSidebar = loadable(() => import('../components/home_sidebar.tsx'), {
  fallback: <div>Loading...</div>,
})


const Home = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setGroupFuncName({groupName: "Trang chủ"}));
  }, []);
  return <div className={"grid grid-cols-12 p-10 gap-5"} style={{flexWrap: "nowrap"}}>
    <Typography.Title level={2} className={"col-span-12"}>Trang chủ</Typography.Title>
    <div className={"col-span-10 h-screen"}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Truy cập nhanh</CardTitle>
            <CardDescription>Các chức năng thường xuyên sử dụng</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button className="w-full justify-start" variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Thêm sinh viên mới
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              Quản lý lớp học
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Lịch học và thi
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Activity className="mr-2 h-4 w-4" />
              Báo cáo điểm danh
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Bảng điểm
            </Button>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Sự kiện sắp tới</CardTitle>
            <CardDescription>Lịch sự kiện trong 7 ngày tới</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Hạn nộp học phí kỳ 2</p>
                  <p className="text-xs text-muted-foreground">Hôm nay, 17:00</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Hội thảo hướng nghiệp</p>
                  <p className="text-xs text-muted-foreground">Ngày mai, 09:00</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Khai giảng lớp mới</p>
                  <p className="text-xs text-muted-foreground">20/05/2025, 08:00</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Kỳ thi giữa kỳ</p>
                  <p className="text-xs text-muted-foreground">22/05/2025, 07:30</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/*<Card className="col-span-1">*/}
        {/*  <CardHeader>*/}
        {/*    <CardTitle>Thống kê sinh viên</CardTitle>*/}
        {/*    <CardDescription>Phân bố sinh viên theo khoa</CardDescription>*/}
        {/*  </CardHeader>*/}
        {/*  <CardContent>*/}
        {/*    <StudentStats />*/}
        {/*  </CardContent>*/}
        {/*</Card>*/}
      </div>
    </div>
  </div>
}
export default Home