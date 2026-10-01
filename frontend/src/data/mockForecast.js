const events = { 6: -150000, 12: -210000, 18: -300000, 25: 240000 }
let balance = 500000

export const forecast = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1
    balance += events[day] || 0
    return { date: `Oct ${day}`, balance }
})

export const shortage = forecast.find((p) => p.balance < 0)