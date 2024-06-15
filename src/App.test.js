import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
    test("renders login button when not authenticated", () => {
        render(<App />);
        const loginButton = screen.getByRole("button", { name: /login/i });
        expect(loginButton).toBeInTheDocument();
    });

    test("renders predictor when authenticated", () => {
        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => "true"),
            },
        });
        render(<App />);
        const predictorForm = screen.getByRole("form");
        expect(predictorForm).toBeInTheDocument();
    });

    test("shows login form when login button is clicked", () => {
        render(<App />);
        const loginButton = screen.getByRole("button", { name: /login/i });
        userEvent.click(loginButton);
        const loginForm = screen.getByTestId("login-form");
        expect(loginForm).toBeInTheDocument();
    });

    test("authenticates user with valid credentials", async () => {
        const credentials = [{ login: "validUser", password: "validPassword" }];
        jest.spyOn(window, "fetch").mockResolvedValueOnce({
            json: async () => credentials,
        });

        render(<App />);
        const loginButton = screen.getByRole("button", { name: /login/i });
        userEvent.click(loginButton);

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole("button", { name: /submit/i });

        userEvent.type(usernameInput, "validUser");
        userEvent.type(passwordInput, "validPassword");
        userEvent.click(submitButton);

        await waitFor(() => {
            const predictorForm = screen.getByRole("form");
            expect(predictorForm).toBeInTheDocument();
        });
    });
});
