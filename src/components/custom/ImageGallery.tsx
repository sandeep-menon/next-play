"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import Image from "next/image";

export default function ImageGallery({ data }: { data: string[] }) {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <div className="flex gap-2 justify-start items-center md:flex-wrap overflow-x-scroll md:overflow-auto">
            {data.map((item) => (
                <Dialog key={item} onOpenChange={(open) => !open && setSelected(null)}>
                    <DialogTitle />
                    <DialogTrigger asChild>
                        <Image
                            src={item}
                            alt="Thumbnail"
                            height={90}
                            width={90}
                            className="cursor-pointer rounded-md object-cover"
                            onClick={() => setSelected(item)}
                        />
                    </DialogTrigger>

                    <DialogContent className="h-screen w-screen flex items-center justify-center bg-black/90 p-4">
                        {selected && (
                            <Image
                                src={selected}
                                alt="Full image"
                                width={1080}
                                height={1920}
                                className="object-contain"
                            />
                        )}
                    </DialogContent>
                </Dialog>
            ))}
        </div>
    );
}
