import { Loader } from "lucide-react";

export default function FormLoadingMessage({ children }: { children?: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 text-blue-500 text-sm">
            <div className="animate-spin"><Loader className="h-4 w-4" /></div>
            <div>{children}</div>
        </div>
    )
}