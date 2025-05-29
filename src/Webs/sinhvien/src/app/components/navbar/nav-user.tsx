

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import { useNavigate } from "react-router";
import { useAppDispatch } from "@/app/stores/hook.ts";
import { setAuthenticate } from "@/app/stores/common_slice.ts";
import { RoutePaths } from "@/cores/route_paths.ts";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge, Box } from "@mui/material";
import AvatarIcon from "@/assets/images/avatar.png"
import { useGetUserInfo } from "@/app/modules/auth/hooks/useGetUserInfo";
export function NavUser() {
  // const { isMobile } = useSidebar()
  const navigate = useNavigate();
  // const {} = useMsal()
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    // instance.logout({
    //     postLogoutRedirectUri: "/login"
    // }).then(r => {
    // });
    dispatch(setAuthenticate(false))
    navigate(RoutePaths.LOGIN)
  };
  const { data } = useGetUserInfo()


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Box className={"flex justify-center items-center gap-1"}>
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={AvatarIcon} alt={"user.name"} />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate text-xs">{data?.data?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </Box>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={"bottom"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{data?.data?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]}</span>
              <span className="truncate text-xs">{data?.data?.isConfirm && <Badge>Đang hoạt động</Badge>}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={"cursor-pointer"} onClick={() => {
          handleLogout()
        }}>
          <LogOut />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
