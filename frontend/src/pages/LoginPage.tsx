import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <Card className="w-[400px] shadow-2xl">
        <CardHeader className="text-center">
        <CardTitle className="text-2xl">🗓️ Warm Calendar</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
    <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
    <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" />
        </div>
        <Button className="w-full">Login</Button>
        <Button variant="outline" className="w-full">
        Sign in with Google
    </Button>
    </CardContent>
    </Card>
    </div>
        )
}