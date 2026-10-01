import ForecastChart from '../components/ForecastChart'
import { forecast, shortage } from '../data/mockForecast'

export default function Dashboard() {
    return (
        <div className="space-y-4 p-4">
            {shortage && (
                <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
                    Warning: cash falls to Rs.{shortage.balance.toLocaleString()} on {shortage.date}
                </div>
            )}
            <div className="rounded-lg bg-white p-4 shadow">
                <h2 className="mb-2 font-semibold">30-day cash forecast</h2>
                <ForecastChart data={forecast} />
            </div>
        </div>
    )
}