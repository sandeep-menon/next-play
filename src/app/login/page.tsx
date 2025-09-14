"use client"

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { loginSchema, signupSchema, type LoginInput, type SignUpInput } from "@/schemas/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormErrorMessage from "@/components/custom/FormErrorMessage";
import { useEffect, useState } from "react";
import FormLoadingMessage from "@/components/custom/FormLoadingMessage";
import FormSuccessMessage from "@/components/custom/FormSuccessMessage";

enum userNameStatuses {
    idle = "idle",
    loading = "loading",
    available = "available",
    taken = "taken"
}

export default function LoginPage() {
    const [usernameStatus, setUsernameStatus] = useState<userNameStatuses>(userNameStatuses.idle);

    const {
        register: registerLogin,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginErrors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: { username: "", password: "" },
    });

    const {
        register: registerSignup,
        handleSubmit: handleSignupSubmit,
        reset: resetSignup,
        formState: { errors: signupErrors },
        watch,
    } = useForm<SignUpInput>({
        resolver: zodResolver(signupSchema),
        defaultValues: { email: "", username: "", password: "", retypePassword: "" },
    });

    const username = watch("username");

    const onLogin = (data: LoginInput) => {
        console.log("Login data: ", data);
        // TODO
    }

    const onSignup = (data: SignUpInput) => {
        console.log("Signup data: ", data);
        // TODO
    }

    const handleReset = () => {
        resetSignup(
            { email: "", username: "", password: "", retypePassword: "" }
        );
    }

    useEffect(() => {
        if (!username) {
            setUsernameStatus(userNameStatuses.idle);
            return;
        }

        setUsernameStatus(userNameStatuses.loading);

        const handler = setTimeout(async () => {
            try {
                // TODO
                const res = await fakeCheckUsername(username);
                setUsernameStatus(res.available ? userNameStatuses.available : userNameStatuses.taken);
            } catch (err) {
                setUsernameStatus(userNameStatuses.idle);
                console.error(err);
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [username]);

    async function fakeCheckUsername(username: string): Promise<{ available: boolean }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("Checking username: ", username);
                resolve({ available: true });
            }, 2000);
        });
    }


    return (
        <div className="w-full md:w-xl">
            <Tabs defaultValue="login">
                <TabsList>
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <form onSubmit={handleLoginSubmit(onLogin)}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Login</CardTitle>
                                <CardDescription>
                                    Enter your username below to login to your account.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="login-username">Username</Label>
                                    <Input id="login-username" placeholder="Enter your username..." {...registerLogin("username")} />
                                    {loginErrors.username && <FormErrorMessage>{loginErrors.username.message}</FormErrorMessage>}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="login-password">Password</Label>
                                    <Input id="login-password" type="password" placeholder="Enter your password..." {...registerLogin("password")} />
                                    {loginErrors.password && <FormErrorMessage>{loginErrors.password.message}</FormErrorMessage>}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit">Login</Button>
                            </CardFooter>
                        </Card>
                    </form>
                </TabsContent>
                <TabsContent value="signup">
                    <form onSubmit={handleSignupSubmit(onSignup)}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Sign Up</CardTitle>
                                <CardDescription>
                                    First time here? Don&apos;t worry!
                                </CardDescription>
                                <CardDescription>
                                    Simply Sign Up using your Email Address and choose a unique Username.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <Input id="signup-email" placeholder="Enter your email address..." {...registerSignup("email")} />
                                    {signupErrors.email && <FormErrorMessage>{signupErrors.email.message}</FormErrorMessage>}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="signup-username">Username</Label>
                                    <Input id="signup-username" placeholder="Choose your username..." {...registerSignup("username")} />
                                    {signupErrors.username && <FormErrorMessage>{signupErrors.username.message}</FormErrorMessage>}
                                    {usernameStatus === userNameStatuses.loading && <FormLoadingMessage>Checking username availability</FormLoadingMessage>}
                                    {usernameStatus === userNameStatuses.available && <FormSuccessMessage>Username is available!</FormSuccessMessage>}
                                    {usernameStatus === userNameStatuses.taken && <FormErrorMessage>Username is already taken!</FormErrorMessage>}

                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="signup-password">Password</Label>
                                    <Input id="signup-password" placeholder="Enter a password..." type="password" {...registerSignup("password")} />
                                    {signupErrors.password && <FormErrorMessage>{signupErrors.password.message}</FormErrorMessage>}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="signup-retype-password">Retype Password</Label>
                                    <Input id="signup-retype-password" placeholder="Enter a password..." type="password" {...registerSignup("retypePassword")} />
                                    {signupErrors.retypePassword && <FormErrorMessage>{signupErrors.retypePassword.message}</FormErrorMessage>}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                                <Button type="submit">Sign Up</Button>
                                <Button onClick={() => handleReset()} variant="ghost">Reset</Button>
                            </CardFooter>
                        </Card>
                    </form>
                </TabsContent>
            </Tabs>
        </div>
    )
}