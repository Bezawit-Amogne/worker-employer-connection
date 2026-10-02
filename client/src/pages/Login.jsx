import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        try {
            const data = await loginUser(formData);

            // Check if token was returned
            if (!data.token) {
                throw new Error(
                    "Login failed: authentication token was not returned."
                );
            }

            // Check if user information was returned
            if (!data.user) {
                throw new Error(
                    "Login failed: user information was not returned."
                );
            }

            // Save JWT token
            localStorage.setItem("token", data.token);

            // Save logged-in user information
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            setMessage(data.message);

            // Redirect based on user role
            if (data.user.role === "worker") {

                navigate("/worker-dashboard");

            } else if (data.user.role === "employer") {

                navigate("/employer-dashboard");

            } else if (data.user.role === "admin") {

                navigate("/admin-dashboard");

            } else {

                navigate("/");
            }

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <main className="auth-page">

            <div className="auth-card">

                <h1>Login</h1>

                <p className="auth-description">
                    Login to your Serategna account.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="form-button"
                    >
                        Login
                    </button>

                </form>

                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

            </div>

        </main>
    );
}

export default Login;

