import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CalendarPage() {
    const today = new Date()
    const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' })

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">🗓️ Warm Calendar</h1>
                <Button variant="outline">Logout</Button>
            </div>

            {/* Calendar */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-center text-xl">{monthName}</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Calendar grid placeholder */}
                    <div className="grid grid-cols-7 gap-2 text-center">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="font-semibold text-muted-foreground p-2">
                                {day}
                            </div>
                        ))}
                        {/* Placeholder days */}
                        {Array.from({ length: 35 }, (_, i) => (
                            <div
                                key={i}
                                className="p-4 border rounded-md hover:bg-accent cursor-pointer transition-colors"
                            >
                                {((i % 31) + 1)}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}