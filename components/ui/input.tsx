import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean
    label?: string
    helperText?: string
    showPasswordToggle?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type: initialType, error, label, helperText, showPasswordToggle = false, ...props }, ref) => {
        const id = React.useId()
        const [showPassword, setShowPassword] = React.useState(false)
        const type = initialType === 'password' && showPassword ? 'text' : initialType

        return (
            <div className="relative w-full">
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-sm font-medium leading-6 text-foreground mb-2"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        type={type}
                        className={cn(
                            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                            "ring-offset-background placeholder:text-muted-foreground",
                            "focus-visible:outline-none",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            error && "border-destructive focus-visible:ring-destructive",
                            showPasswordToggle && initialType === 'password' && "pr-10",
                            className
                        )}
                        ref={ref}
                        id={id}
                        aria-describedby={helperText ? `${id}-description` : undefined}
                        aria-invalid={error}
                        {...props}
                    />
                    {showPasswordToggle && initialType === 'password' && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={cn(
                                "absolute right-3 top-1/2 -translate-y-1/2",
                                "text-muted-foreground hover:text-foreground",
                                "focus:outline-none",
                                "p-1"
                            )}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    )}
                </div>
                {helperText && (
                    <p
                        className={cn(
                            "mt-2 text-sm",
                            error ? "text-destructive" : "text-muted-foreground"
                        )}
                        id={`${id}-description`}
                    >
                        {helperText}
                    </p>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }