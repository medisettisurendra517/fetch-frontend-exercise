import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import dogImage from "../assets/dogs.png";
import FetchApi from "../api/fetchapi";
import LocalApi from "../api/localapi";

const LoginPage = () => {
    const [formData, setFormData] = useState({ name: "", email: "" });
    const [alert, setAlert] = useState({ type: "", message: "", show: false });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const credentials = {
                name: formData.name,
                email: formData.email,
            };

            const response = await FetchApi.loginUser(credentials);
            if (response.status === 200) {
                LocalApi.setUserInfo(formData.name, formData.email);
                setAlert({ type: "success", message: "Login successful!", show: true });
                navigate('/user', { replace: true });
            } else {
                console.error("Login failed:", response);
                setAlert({ type: "danger", message: "Login failed. Please try again later.", show: true });
            }
        } catch (error) {
            console.error("Error during login:", error);
            setAlert({ type: "danger", message: "An error occurred. Please try again later.", show: true });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => {
                setAlert({ ...alert, show: false });
            }, 3000);
        }
    };

    return (
        <div className="container">
            <div className="row w-100">
                <div className="col-md-8 d-flex flex-column justify-content-center align-items-center text-center">
                    <h1 className="mb-4">
                        Welcome to <span className="tailmate-highlight">TailMate!</span>
                    </h1>
                    <p className="tailmate-paragraph">
                        At Tailmate, we believe every dog deserves a loving home, and we’re
                        here to help you find your perfect furry companion. Our platform
                        connects dog lovers like you to a database of shelter dogs, making
                        it easy to search, discover, and fall in love with a pup in need.
                    </p>
                    <img
                        src={dogImage}
                        alt="Cute dog"
                        className="tailmate-home-image img-fluid mt-4"
                    />
                </div>

                <div className="col-md-4 d-flex justify-content-center align-items-center">
                    <div className="login-form p-4 rounded">
                        <h2 className="text-center mb-4">Login</h2>

                        {alert.show && (
                            <div className={`alert alert-${alert.type} text-center`} role="alert">
                                {alert.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn-tailmate w-100"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Login"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
