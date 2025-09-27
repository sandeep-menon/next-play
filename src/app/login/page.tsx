"use client"

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import axios from "axios";

import { loginSchema, signupSchema, type LoginInput, type SignUpInput } from "@/schemas/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormErrorMessage from "@/components/custom/FormErrorMessage";
import { useEffect, useState } from "react";
import FormLoadingMessage from "@/components/custom/FormLoadingMessage";
import FormSuccessMessage from "@/components/custom/FormSuccessMessage";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

enum userNameStatuses {
    idle = "idle",
    loading = "loading",
    available = "available",
    taken = "taken"
}

export default function LoginPage() {
    const [usernameStatus, setUsernameStatus] = useState<userNameStatuses>(userNameStatuses.idle);
    const [loadingSignUp, setLoadingSignUp] = useState(false);
    const [loadingLogin, setLoadingLogin] = useState(false);
    const router = useRouter();
    const setUser = useUserStore((state) => state.setUser);

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

    const onLogin = async (data: LoginInput) => {
        try {
            setLoadingLogin(true);
            const res = await axios.post("/api/login", {
                username: data.username,
                password: data.password,
            });

            const { user } = res.data;

            setUser(user);
            toast.success("Login successful");
            router.push("/explore");
        } catch (error) {
            console.error("Login failed: ", error);
            toast.error("Login failed! Invalid credentials");
        } finally {
            setLoadingLogin(false);
        }
    }

    const onSignup = async (data: SignUpInput) => {
        setLoadingSignUp(true);
        try {
            await axios.post("/api/signup", {
                email: data.email,
                username: data.username,
                password: data.password,
                retypePassword: data.retypePassword
            });
            toast.success("Sign Up successful. Please proceed to Login.");
        } catch (error) {
            if (typeof error === "object" && error !== null && "response" in error) {
                // @ts-expect-error: error.response is expected from axios
                toast.error(error.response.data.error);
            } else {
                toast.error("An error occurred during sign up");
            }
        }
        setLoadingSignUp(false);
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
                const res = await checkUsername(username);
                setUsernameStatus(res.available ? userNameStatuses.available : userNameStatuses.taken);
            } catch (err) {
                setUsernameStatus(userNameStatuses.idle);
                console.error(err);
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [username]);

    async function checkUsername(username: string): Promise<{ available: boolean }> {
        if (username) {
            try {
                await axios.get(`/api/check-username?username=${username}`);
                return { available: true };
            } catch (error) {
                console.error(error);
                return { available: false };
            }
        }
        return { available: false };
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
                                    <Input id="login-username" autoCapitalize="none" placeholder="Enter your username..." {...registerLogin("username")} />
                                    {loginErrors.username && <FormErrorMessage>{loginErrors.username.message}</FormErrorMessage>}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="login-password">Password</Label>
                                    <Input id="login-password" type="password" placeholder="Enter your password..." {...registerLogin("password")} />
                                    {loginErrors.password && <FormErrorMessage>{loginErrors.password.message}</FormErrorMessage>}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={loadingLogin}>
                                    {loadingLogin && <Loader className="animate-spin" />}
                                    Login</Button>
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
                                <Button type="submit" disabled={loadingSignUp}>
                                    {loadingSignUp && <Loader className="animate-spin" />}
                                    Sign Up
                                </Button>
                                <Button onClick={() => handleReset()} variant="ghost">Reset</Button>
                            </CardFooter>
                        </Card>
                    </form>
                </TabsContent>
            </Tabs>
        </div>
    )
}