import Link from "next/link";

export default function Navbar() {
    return (
        <div className="max-w-[1280px] mx-auto px-4 py-2 flex justify-between items-center">
            <div className="text-lg font-bold">
                <Link href="/">Next Play</Link>
            </div>
            <div></div>
        </div>
    )
}