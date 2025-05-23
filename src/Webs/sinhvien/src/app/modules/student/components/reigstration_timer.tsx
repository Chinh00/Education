"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Clock, Calendar, AlertCircle, ArrowRight } from "lucide-react"
import { Badge } from "@/app/components/ui/badge"
import { cn } from "@/app/lib/utils"

interface RegistrationTimerProps {
    startTime: string
    endTime: string
    timeSlot: string
}

export default function RegistrationTimer({ startTime, endTime, timeSlot }: RegistrationTimerProps) {
    const [timeRemaining, setTimeRemaining] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })
    const [progress, setProgress] = useState(0)
    const [isUrgent, setIsUrgent] = useState(false)
    const [isExpired, setIsExpired] = useState(false)
    useEffect(() => {
        const calculateTimeRemaining = () => {
            const now = new Date()

            // Set countdown to end on May 31, 2025 at midnight
            const registrationEndDate = new Date("2025-05-31T23:59:59")

            // For demo purposes, let's set it to 2 hours from now so you can see it counting down
            const demoEndDate = new Date()
            demoEndDate.setHours(demoEndDate.getHours() + 2)
            demoEndDate.setMinutes(demoEndDate.getMinutes() + 30)
            demoEndDate.setSeconds(demoEndDate.getSeconds() + 45)

            const timeLeft = demoEndDate.getTime() - now.getTime()

            if (timeLeft <= 0) {
                setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 })
                setIsExpired(true)
                return
            }

            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

            setTimeRemaining({ days, hours, minutes, seconds })

            // Set urgent state when less than 1 hour remaining
            setIsUrgent(timeLeft < 60 * 60 * 1000)

            // Calculate progress (assuming registration period is 10 days)
            const registrationStartDate = new Date("2025-05-22T00:00:00")
            const totalDuration = demoEndDate.getTime() - registrationStartDate.getTime()
            const elapsed = now.getTime() - registrationStartDate.getTime()
            const progressPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))

            setProgress(progressPercent)
        }

        calculateTimeRemaining()
        const timer = setInterval(calculateTimeRemaining, 1000)

        return () => clearInterval(timer)
    }, [])

    const formatNumber = (num: number) => {
        return num.toString().padStart(2, "0")
    }

    const getUrgencyColor = () => {
        if (isExpired) return "from-red-600 to-red-700"
        if (isUrgent) return "from-orange-600 to-red-600"
        return "from-blue-600 to-indigo-600"
    }



    if (isExpired) {
        return (
            <Card className="border-0 shadow-sm overflow-hidden w-full">
                <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-red-600 to-red-700 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <AlertCircle className="h-5 w-5 mr-2 text-white" />
                                <h2 className="text-white font-medium">Thời gian đăng ký đã kết thúc</h2>
                            </div>
                            <Badge className="bg-white/20 text-white border-0">Học kỳ 1_2025_2026</Badge>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="text-center py-8">
                            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-red-700 mb-2">Đã hết thời gian đăng ký</h3>
                            <p className="text-red-600">Vui lòng liên hệ phòng đào tạo để được hỗ trợ</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={cn("border-0 shadow-sm overflow-hidden w-full", isUrgent && "animate-pulse")}>
            <CardContent className="p-0">
                <div className={cn("bg-gradient-to-r p-4", "from-blue-600 to-indigo-600")}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-white" />
                            <h2 className="text-white font-medium">
                                {isUrgent ? "⚠️ Sắp hết thời gian đăng ký!" : "Thời gian đăng ký"}
                            </h2>
                        </div>
                        <Badge className="bg-white/20 text-white border-0">Học kỳ 1_2025_2026</Badge>
                    </div>
                </div>

                {/* Horizontal Registration Period */}
                <div className="p-4">
                    <div className="flex flex-col space-y-4">
                        {/* Registration Period Timeline */}
                        <div className="relative">
                            <div className="flex justify-between items-center mb-2">
                                <div className="text-center">
                                    <div className="text-sm text-slate-500">Bắt đầu</div>
                                    <div className="font-medium">{startTime}</div>
                                </div>
                                <ArrowRight className="h-5 w-5 text-slate-400 hidden sm:block" />
                                <div className="text-center">
                                    <div className="text-sm text-slate-500">Kết thúc</div>
                                    <div className="font-medium">{endTime}</div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-in-out",
                                            isUrgent
                                                ? "bg-gradient-to-r from-orange-500 to-red-500"
                                                : "bg-gradient-to-r from-blue-500 to-indigo-500",
                                        )}
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Đã bắt đầu</span>
                                    <span>{Math.round(progress)}% thời gian đã trôi qua</span>
                                </div>
                            </div>
                        </div>

                        {/* Horizontal Time Slot and Countdown */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {/* Time Slot */}
                            <div
                                className={cn(
                                    "md:col-span-2 rounded-lg p-3 border flex items-center",
                                    isUrgent ? "bg-orange-50 border-orange-200" : "bg-blue-50 border-blue-200",
                                )}
                            >
                                <Clock
                                    className={cn(
                                        "h-10 w-10 mr-3 flex-shrink-0",
                                        isUrgent ? "text-orange-600 animate-bounce" : "text-blue-600 animate-pulse",
                                    )}
                                />
                                <div>
                                    <h3 className={cn("font-medium", isUrgent ? "text-orange-800" : "text-blue-800")}>
                                        Khung giờ đăng ký của bạn
                                    </h3>
                                    <p className={cn(isUrgent ? "text-orange-600" : "text-blue-600")}>
                                        Bạn được đăng ký tín chỉ trong khoảng [{timeSlot}]
                                    </p>
                                </div>
                            </div>

                            {/* Animated Countdown Timer */}
                            <div className="md:col-span-3">
                                <div className="grid grid-cols-4 gap-2 h-full">
                                    {/* Days */}
                                    <div className={cn("rounded-lg border overflow-hidden", "bg-indigo-50 border-indigo-200 text-indigo-700")}>
                                        <div className="relative h-full flex flex-col items-center justify-center p-2">
                                            <div className="text-2xl font-bold relative">
                                                <div className={cn("transition-all duration-500 transform", isUrgent && "animate-pulse")}>
                                                    {formatNumber(timeRemaining.days)}
                                                </div>
                                            </div>
                                            <div className="text-xs">Ngày</div>
                                        </div>
                                    </div>

                                    {/* Hours */}
                                    <div className={cn("rounded-lg border overflow-hidden", "bg-indigo-50 border-indigo-200 text-indigo-700")}>
                                        <div className="relative h-full flex flex-col items-center justify-center p-2">
                                            <div className="text-2xl font-bold relative">
                                                <div className={cn("transition-all duration-500 transform", isUrgent && "animate-pulse")}>
                                                    {formatNumber(timeRemaining.hours)}
                                                </div>
                                            </div>
                                            <div className="text-xs">Giờ</div>
                                        </div>
                                    </div>

                                    {/* Minutes */}
                                    <div className={cn("rounded-lg border overflow-hidden", "bg-indigo-50 border-indigo-200 text-indigo-700")}>
                                        <div className="relative h-full flex flex-col items-center justify-center p-2">
                                            <div className="text-2xl font-bold relative">
                                                <div className={cn("transition-all duration-500 transform", isUrgent && "animate-pulse")}>
                                                    {formatNumber(timeRemaining.minutes)}
                                                </div>
                                            </div>
                                            <div className="text-xs">Phút</div>
                                        </div>
                                    </div>

                                    {/* Seconds - with special animation */}
                                    <div className={cn("rounded-lg border overflow-hidden", "bg-indigo-50 border-indigo-200 text-indigo-700")}>
                                        <div className="relative h-full flex flex-col items-center justify-center p-2">
                                            <div className="text-2xl font-bold relative">
                                                <div className={cn("transition-all duration-300 transform", "animate-pulse scale-110")}>
                                                    {formatNumber(timeRemaining.seconds)}
                                                </div>
                                            </div>
                                            <div className="text-xs">Giây</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Warning Message */}
                        <div
                            className={cn(
                                "rounded-lg p-3 border",
                                isUrgent ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200",
                            )}
                        >
                            <div className="flex items-center">
                                <AlertCircle
                                    className={cn(
                                        "h-5 w-5 mr-3 flex-shrink-0",
                                        isUrgent ? "text-red-600 animate-bounce" : "text-amber-600",
                                    )}
                                />
                                <div className={cn("text-sm", isUrgent ? "text-red-700" : "text-amber-700")}>
                                    {isUrgent
                                        ? "⚠️ KHẨN CẤP: Thời gian đăng ký sắp kết thúc! Hãy nhanh chóng hoàn tất đăng ký."
                                        : "Vui lòng đăng ký trong thời gian quy định. Hệ thống sẽ tự động đóng khi hết thời gian."}
                                </div>
                            </div>
                        </div>

                        {/* Countdown Status */}
                        <div className="text-center">
                            <div
                                className={cn(
                                    "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium",
                                    isUrgent
                                        ? "bg-red-100 text-red-800 border border-red-200"
                                        : "bg-green-100 text-green-800 border border-green-200",
                                )}
                            >
                                <div
                                    className={cn("w-2 h-2 rounded-full mr-2", isUrgent ? "bg-red-500 animate-ping" : "bg-green-500")}
                                ></div>
                                {isUrgent ? "Thời gian sắp hết!" : "Đang trong thời gian đăng ký"}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
