"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Prevent hydration mismatch
    React.useEffect(() => setMounted(true), [])
    if (!mounted) return null

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className={cn(
                "relative h-10 w-10 rounded-full",
                "hover:bg-primary hover:text-primary-foreground",
                "focus-visible:ring-2 focus-visible:ring-primary",
                "transition-colors duration-300"
            )}
        >
            <div className="relative h-4 w-4">
                <Sun
                    className={cn(
                        "absolute h-4 w-4 transition-all duration-300",
                        theme === "light"
                            ? "scale-100 rotate-0 opacity-100"
                            : "scale-0 -rotate-90 opacity-0"
                    )}
                />
                <Moon
                    className={cn(
                        "absolute h-4 w-4 transition-all duration-300",
                        theme === "dark"
                            ? "scale-100 rotate-0 opacity-100"
                            : "scale-0 rotate-90 opacity-0"
                    )}
                />
            </div>
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}