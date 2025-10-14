import React from "react"
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Input, Button } from '@heroui/react';

// Usuarios hardcoded
const usuariosHardcoded = [
    {
        username: "susana",
        password: "admin123",
        name: "Susana Gutiérrez",
        role: "Admin",
        isActive: true,
    },
    {
        username: "david",
        password: "user123",
        name: "David Henao",
        role: "Librarian",
        isActive: true,
    },
    {
        username: "Maria",
        password: "holi123",
        name: "María Rodríguez",
        role: "User",
        isActive: true,
    }
];

export default function Home() {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    // Verificar si ya hay una sesión activa
    useEffect(() => {
        const session = localStorage.getItem("userSession");
        if (session) {
            router.push("/dashboard");
        }
    }, [router]);

    const handleClick = async () => {
        setError("");
        setLoading(true);

        // Validaciones básicas
        if (!user.trim()) {
            setError("Username is required");
            setLoading(false);
            return;
        }

        if (!pass.trim()) {
            setError("Password is required");
            setLoading(false);
            return;
        }

        // Buscar usuario en la lista hardcoded
        const usuarioEncontrado = usuariosHardcoded.find(
            u => u.username === user && u.password === pass
        );

        if (usuarioEncontrado) {
            // Guardar sesión en localStorage
            const sessionData = {
                username: usuarioEncontrado.username,
                name: usuarioEncontrado.name,
                role: usuarioEncontrado.role,
                isActive: usuarioEncontrado.isActive,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem("userSession", JSON.stringify(sessionData));
            router.push("/dashboard");
        } else {
            setError("Invalid username or password");
        }
        
        setLoading(false);
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="text-2xl font-bold mb-4">Library Login</div>
                
                {error && (
                    <div className="error-message mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <Input
                    label="Username"
                    placeholder="Enter your username"
                    type="text"
                    value={user}
                    onChange={(e) => {
                        setUser(e.target.value);
                        setError(""); // Limpiar error al escribir
                    }}
                    isInvalid={!!error && !user.trim()}
                    className="mb-3"
                />

                <Input
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    value={pass}
                    onChange={(e) => {
                        setPass(e.target.value);
                        setError(""); // Limpiar error al escribir
                    }}
                    isInvalid={!!error && !pass.trim()}
                    className="mb-4"
                />

                <Button 
                    onPress={handleClick}
                    className="bg-linear-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                    radius="full"
                    isLoading={loading}
                    isDisabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </Button>

                {/* <div className="mt-6 text-sm text-gray-600">
                    <p className="font-semibold">Demo Users:</p>
                    <p>• susana / user123 (admin)</p>
                    <p>• carlos / admin456 (librarian)</p>
                    <p>• maria / manager789 (manager)</p>
                </div> */}
            </div>
        </div>
    )
}
