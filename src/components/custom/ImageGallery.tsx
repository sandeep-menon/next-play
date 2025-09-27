"use client";

import { useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
} from "../ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { MoveLeft, MoveRight } from "lucide-react";

interface ImageGalleryProps {
    data: string[];
}

export default function ImageGallery({ data }: ImageGalleryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const openAt = (index: number) => {
        setSelectedIndex(index);
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
        setSelectedIndex(null);
    };

    const handlePrev = () => {
        if (selectedIndex === null) return;
        const newIndex = selectedIndex > 0 ? selectedIndex - 1 : data.length - 1;
        setSelectedIndex(newIndex);
    };

    const handleNext = () => {
        if (selectedIndex === null) return;
        const newIndex = selectedIndex < data.length - 1 ? selectedIndex + 1 : 0;
        setSelectedIndex(newIndex);
    };

    return (
        <>
            <div className="flex gap-2 justify-start items-center md:flex-wrap overflow-x-scroll md:overflow-auto">
                {data.map((src, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => openAt(i)}
                        className="p-0 rounded-md overflow-hidden"
                    >
                        <Image
                            src={src}
                            alt={`Thumbnail ${i + 1}`}
                            width={90}
                            height={90}
                            className="cursor-pointer rounded-md object-cover"
                        />
                    </button>
                ))}
            </div>
            <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
                <DialogTitle className="hidden" />
                <DialogContent className="h-screen w-screen flex flex-col items-center justify-center bg-black/90 p-4">
                    {selectedIndex !== null && (
                        <Image
                            src={data[selectedIndex]}
                            alt={`Image ${selectedIndex + 1}`}
                            width={1080}
                            height={720}
                            className="object-contain"
                        />
                    )}
                    <div className="flex gap-2 mt-2">
                        <Button variant="outline" onClick={handlePrev}>
                            <MoveLeft />
                        </Button>
                        <Button variant="outline" onClick={handleNext}>
                            <MoveRight />
                        </Button>
                    </div>
                    <div className="mt-2">
                        <DialogClose asChild>
                            <Button variant="outline" onClick={close}>Close</Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
