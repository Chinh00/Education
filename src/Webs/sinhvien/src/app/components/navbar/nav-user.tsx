

import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
} from "lucide-react"

import {useNavigate} from "react-router";
import {useAppDispatch} from "@/app/stores/hook.ts";
import { setAuthenticate } from "@/app/stores/common_slice.ts";
import {RoutePaths} from "@/cores/route_paths.ts";
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import {DropdownMenu, DropdownMenuContent,
    DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {Box} from "@mui/material";
import AvatarIcon from "@/assets/images/avatar.png"
export function NavUser({user,}: {
    user: {
        name: string
        email: string
        avatar: string
    }
}) {
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
    
    
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Box className={"flex justify-center items-center gap-1"}>
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={AvatarIcon} alt={user.name} />
                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate text-xs">{user.email}</span>
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
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{user.name}</span>
                            <span className="truncate text-xs">{user.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Sparkles />
                        Upgrade to Pro
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <BadgeCheck />
                        Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CreditCard />
                        Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Bell />
                        Notifications
                    </DropdownMenuItem>
                </DropdownMenuGroup>
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
