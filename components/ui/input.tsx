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
                        className="block text-sm font-medium leading-6 text-gray-300 mb-2"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        type={type}
                        className={cn(
                            "flex h-10 w-full rounded-md bg-[#1A1B1E] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
                            error && "focus-visible:ring-red-500",
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
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none p-1"
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
                            error ? "text-red-500" : "text-gray-400"
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