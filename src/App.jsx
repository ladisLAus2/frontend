import React, { useState, useEffect, StrictMode } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Predictor from "./Predictor";
import Trainer from "./Trainer";
import Login from "./Login";
import Logout from "./Logout";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isTrainingMode, setIsTrainingMode] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [credentials, setCredentials] = useState([]);

    useEffect(() => {
        const authStatus = localStorage.getItem("isAuthenticated");
        if (authStatus === "true") {
            setIsAuthenticated(true);
        }

        fetch("/credentials.json")
            .then((response) => response.json())
            .then((data) => setCredentials(data))
            .catch((error) =>
                console.error("Error loading credentials:", error)
            );
    }, []);

    const handleLogin = (username, password) => {
        const user = credentials.find(
            (cred) => cred.login === username && cred.password === password
        );
        if (user) {
            localStorage.setItem("isAuthenticated", "true");
            setIsAuthenticated(true);
            setShowLogin(false);
        } else {
            alert("Invalid credentials");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        setIsAuthenticated(false);
        setIsTrainingMode(false);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1 className="text-center mb-4">Text similarity evaluator</h1>
            </header>
            <div className="controls">
                {isAuthenticated ? (
                    <>
                        <button
                            className="btn btn-secondary me-2"
                            onClick={() => setIsTrainingMode(!isTrainingMode)}
                        >
                            {isTrainingMode ? "Predictor" : "Train"}
                        </button>
                        <Logout onLogout={handleLogout} />
                    </>
                ) : (
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowLogin(true)}
                    >
                        Login
                    </button>
                )}
            </div>
            {showLogin ? (
                <Login onLogin={handleLogin} />
            ) : (
                <div>{isTrainingMode ? <Trainer /> : <Predictor />}</div>
            )}
        </div>
    );
}

export default App;
