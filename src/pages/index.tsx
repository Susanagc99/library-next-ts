import React from "react"
import { useState } from "react";
import { useRouter } from "next/router";
import { Input, Button } from '@heroui/react';

const userLogueado = {
    name: "susana",
    role: "admin",
    isActive: true,
}

export default function Home() {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");

    console.log(userLogueado)

    const router = useRouter();

    const handleClick = async () => {
        if (user === "susana" && pass === "user123") {
            router.push("/dashboard");
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="text-2xl">Login</div>

                <label></label>
                <Input
                    label="User"
                    placeholder="Enter your user"
                    type="text"
                    onChange={(e) => {
                        setUser(e.target.value);
                    }}
                />

                <label></label>
                <Input
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    onChange={(e) => {
                        setPass(e.target.value);
                    }}
                />


                <Button onPress={handleClick}
                    className="bg-linear-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                    radius="full"
                >
                    Login
                </Button>


            </div>
        </div>
    )
}
