import { CircleAlert } from "lucide-react";

export default function FormErrorMessage({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 text-red-500 text-sm">
            <CircleAlert className="h-4 w-4" />
            <div>{children}</div>
        </div>
    )
}