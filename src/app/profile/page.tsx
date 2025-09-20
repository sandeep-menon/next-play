"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/userStore";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
    const user = useUserStore((state) => state.user);
    const updateUser = useUserStore((state) => state.updateUser);
    const [loadingSave, setLoadingSave] = useState(false);
    const [avatar, setAvatar] = useState("");

    useEffect(() => {
        if (user?.avatar) {
            setAvatar(user.avatar);
        }
    }, [user]);
    
    if (!user) return null;
    
    const handleSaveChanges = async () => {
        try {
            setLoadingSave(true);
            if (avatar == "") {
                toast.error("Avatar cannot be empty");
                return;
            }
            const res = await fetch("/api/update-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: user.id,
                    initials: avatar
                })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Profile updated!");
                updateUser({ avatar });
            } else {
                toast.error("Unable to update profile: ", data.error);
            }
        } catch (error) {
            console.error("Error while saving profile changes: ", error);
            toast.error("Error saving changes to your profile. Please try again later.");
        } finally {
            setLoadingSave(false);
        }
    }

    return (
        <div className="w-full md:w-xl">
            <div className="flex flex-col gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Your profile</CardTitle>
                        <CardDescription>Edit your profile</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-around items-center">
                            <Avatar className="h-24 w-24 hover:cursor-default select-none">
                                <AvatarFallback className="text-5xl">{avatar}</AvatarFallback>
                            </Avatar>
                            <div className="text-4xl text-muted-foreground">{user.username}</div>
                        </div>
                        <div>
                            <Accordion type="single" collapsible>
                                <AccordionItem value="avatar">
                                    <AccordionTrigger>Avatar</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex flex-col gap-2">
                                            <div className="text-muted-foreground text-sm">Change your avatar (maximum 2 characters)</div>
                                            <Input type="text" defaultValue={avatar} maxLength={2} onChange={(e) => setAvatar(e.target.value)} />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="platforms">
                                    <AccordionTrigger>Platforms</AccordionTrigger>
                                    <AccordionContent>
                                        <div>
                                            <div className="text-muted-foreground text-sm">Add platforms where you prefer to game.</div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="favourites">
                                    <AccordionTrigger>Favourites</AccordionTrigger>
                                    <AccordionContent>
                                        <div>
                                            <div className="text-muted-foreground text-sm">View your favourite games here which powers our recommendation engine.</div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <Button disabled={loadingSave} onClick={handleSaveChanges}>
                            {loadingSave && <Loader className="animate-spin" />}
                            Save
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link href="/explore">Go home</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}