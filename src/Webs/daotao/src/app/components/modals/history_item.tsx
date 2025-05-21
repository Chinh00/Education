import {EventHistory} from "@/domain/event_history.ts";
import { Badge} from "@/app/components/ui/badge"
import { Button } from "../ui/button";
import {ChevronDown, ChevronUp} from "lucide-react";
import {AnimatePresence, motion} from "framer-motion";
import {DateTimeFormat} from "@/infrastructure/date.ts";
const HistoryItem = ({
                         item,
                         index,
                         getEventColor,
                         isExpanded,
                         toggleExpand,
                     }: {
    item: EventHistory
    index: number
    getEventColor: (eventName: string) => string
    isExpanded: boolean
    toggleExpand: () => void
}) => {
    const hasChanges = item.changeDetails.length > 0

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center p-4 border-b border-gray-100 dark:border-gray-700">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getEventColor(item.eventName)}`}>
                        {item.eventName.includes("Tạo mới") ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                        )}
                    </div>
                    <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.eventName}</h3>
                            <Badge
                                variant="outline"
                                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-normal"
                            >
                                {item.performedByName}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{DateTimeFormat(item?.createdAt)}</p>
                    </div>
                </div>

                {hasChanges && (
                    <div className="border-t border-gray-100 dark:border-gray-700">
                        <div
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            onClick={toggleExpand}
                        >
                            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Chi tiết thay đổi ({item.changeDetails.length})
              </span>
                                {!isExpanded && (
                                    <Badge className="ml-2 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 border-0">
                                        {item.changeDetails.length} thay đổi
                                    </Badge>
                                )}
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </Button>
                        </div>

                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50">
                                        {item.changeDetails.map((detail, idx) => (
                                            <div key={idx} className="mb-3 last:mb-0">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">{detail.propertyName}</span>
                                                </div>
                                                <div className="flex items-center mt-1 space-x-2">
                                                    <div className="flex-1 p-2 rounded bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
                                                        <p className="text-xs text-red-600 dark:text-red-400">{detail.oldValue}</p>
                                                    </div>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4 text-gray-400"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                        />
                                                    </svg>
                                                    <div className="flex-1 p-2 rounded bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30">
                                                        <p className="text-xs text-green-600 dark:text-green-400">{detail.newValue}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </>
    )
}
export { HistoryItem }