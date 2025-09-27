"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Loader } from "lucide-react";
import { SearchResultItem } from "@/shared/interface";
import { useRouter } from "next/navigation";

function useDebounce(value: string, delay = 500) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debounced;
}

export default function SearchBox() {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const debouncedSearch = useDebounce(searchTerm, 500);
    const router = useRouter();

    const fetchResults = useCallback(async (query: string) => {
        setLoading(true);
        try {
            const res = await fetch (`/api/search-games/?name=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data);
        } catch (error) {
            console.error(error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (debouncedSearch.trim()) {
            fetchResults(debouncedSearch);
        } else {
            setResults([]);
        }
    }, [debouncedSearch, fetchResults]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleResultClick = (e: React.MouseEvent<HTMLLIElement>) => {
        const gameId = e.currentTarget.dataset.gameId;
        router.push(`/game/${gameId}`);
    }

    return (
        <div className="relative flex flex-col gap-4 w-80 md:w-92 mx-auto py-2" ref={containerRef}>
            <Input type="text" placeholder="Search..." value={searchTerm} onFocus={() => setOpen(true)} onChange={(e) => setSearchTerm(e.target.value)} />
            {open && (
                <div className="absolute left-0 right-0 mt-10 rounded-md border bg-popover p-2 shadow-md w-80 md:w-92">
                    {!searchTerm ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader className="h-4 w-4 animate-spin" />
                            Start typing...
                        </div>
                    ) : loading ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader className="h-4 w-4 animate-spin" />
                            Searching...
                        </div>
                    ) : results.length > 0 ? (
                        <ul className="space-y-1">
                            {results.map((item: SearchResultItem) => (
                                <li
                                    key={item.id}
                                    className="cursor-pointer rounded-md p-2 hover:bg-accent"
                                    data-game-id={item.id}
                                    onClick={handleResultClick}
                                >
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-sm text-muted-foreground">No results found</div>
                    )}
                </div>
            )}
        </div>
    )
}