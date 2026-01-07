import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string
    alt?: string
    fallback?: string
    size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
}

export function Avatar({
    src,
    alt = "Avatar",
    fallback,
    size = 'md',
    className,
    ...props
}: AvatarProps) {
    const [imageError, setImageError] = React.useState(false)

    const getFallbackText = () => {
        if (fallback) return fallback.slice(0, 2).toUpperCase()
        if (alt) return alt.slice(0, 2).toUpperCase()
        return '?'
    }

    return (
        <div
            className={cn(
                "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary/80 to-primary text-primary-foreground font-medium shadow-sm ring-2 ring-background",
                sizeClasses[size],
                className
            )}
            {...props}
        >
            {src && !imageError ? (
                <img
                    src={src}
                    alt={alt}
                    className="aspect-square h-full w-full object-cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                <span className="select-none">{getFallbackText()}</span>
            )}
        </div>
    )
}
