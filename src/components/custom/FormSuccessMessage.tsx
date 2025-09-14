import { CircleCheck } from "lucide-react";

export default function FormSuccessMessage({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 text-green-500 text-sm">
            <CircleCheck className="h-4 w-4" />
            <div>{children}</div>
        </div>
    )
}