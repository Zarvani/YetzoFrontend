import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center w-full max-w-md", className)}>
        <Search className="absolute left-4 h-5 w-5 text-[#64748B]" />
        <input
          ref={ref}
          type="text"
          className="h-14 w-full rounded-[12px] border border-[#E2E8F0] bg-white pl-12 pr-4 text-[16px] text-[#0F172A] placeholder:text-[#64748B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] transition-all shadow-[0_2px_8px_rgba(15,23,42,0.02)]"
          placeholder="What service do you need?"
          {...props}
        />
      </div>
    )
  }
)
SearchBar.displayName = "SearchBar"
