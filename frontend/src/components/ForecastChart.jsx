import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

export default function ForecastChart({ data }) {
    return (
        <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data}>
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v) => `Rs.${v.toLocaleString()}`} />
                <ReferenceLine y={0} stroke="red" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="balance" stroke="#16a34a" strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    )
}