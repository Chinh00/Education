import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
    {
        name: "Tháng 1",
        total: 2400,
    },
    {
        name: "Tháng 2",
        total: 1398,
    },
    {
        name: "Tháng 3",
        total: 2800,
    },
    {
        name: "Tháng 4",
        total: 3908,
    },
    {
        name: "Tháng 5",
        total: 4800,
    },
    {
        name: "Tháng 6",
        total: 3800,
    },
    {
        name: "Tháng 7",
        total: 4300,
    },
    {
        name: "Tháng 8",
        total: 5300,
    },
    {
        name: "Tháng 9",
        total: 5800,
    },
    {
        name: "Tháng 10",
        total: 6000,
    },
    {
        name: "Tháng 11",
        total: 4300,
    },
    {
        name: "Tháng 12",
        total: 2400,
    },
]

export function Overview() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: any) => `${value}`} />
                <Tooltip />
                <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
            </BarChart>
        </ResponsiveContainer>
    )
}
