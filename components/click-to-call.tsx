"use client"

import { Phone } from "lucide-react"

interface ClickToCallProps {
  phone: string
  className?: string
  showIcon?: boolean
  size?: "sm" | "md"
}

/**
 * Splits a multi-number string (e.g. "+251913086343/+251933791003")
 * into individual clickable tel: links with formatted display.
 */
export function ClickToCall({ phone, className = "", showIcon = true, size = "md" }: ClickToCallProps) {
  const numbers = phone.split("/").map((n) => n.trim())

  const formatDisplay = (num: string) => {
    const cleaned = num.replace(/\s+/g, "")
    if (cleaned.startsWith("+251") && cleaned.length === 13) {
      return `+251 ${cleaned.slice(4, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`
    }
    return num
  }

  const textSize = size === "sm" ? "text-sm" : "text-base"

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {numbers.map((num) => {
        const cleaned = num.replace(/\s+/g, "")
        return (
          <a
            key={cleaned}
            href={`tel:${cleaned}`}
            className={`inline-flex items-center gap-2 ${textSize} text-muted-foreground hover:text-foreground transition-colors group w-fit`}
          >
            {showIcon && (
              <Phone
                size={size === "sm" ? 14 : 16}
                className="text-primary/60 group-hover:text-primary transition-colors shrink-0"
              />
            )}
            <span className="group-hover:underline underline-offset-2">{formatDisplay(num)}</span>
          </a>
        )
      })}
    </div>
  )
}
