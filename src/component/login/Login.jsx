import React, { useState } from "react";
import * as Yup from "yup";
import "./Login.css";
import { FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../config/axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/counterSlice";
import { auth, googleProvider } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";

export default function Login() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    phone: Yup.string().required("Phone number is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });

      try {
        const user = await api.post("/login", {
          phone: formData.phone,
          password: formData.password,
        });

        console.log("Login success:", user.data);

        localStorage.setItem("token", user.data.token);
        dispatch(login(user.data));

        toast.success("Login Successful");
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data || "Login failed");
      }
    } catch (validationErrors) {
      const formattedErrors = validationErrors.inner.reduce((acc, error) => {
        return { ...acc, [error.path]: error.message };
      }, {});
      setErrors(formattedErrors);
    }
  };

  const handleLoginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const tokenGoogle = result.user.accessToken;
    console.log(tokenGoogle);
    try {
      const user = await api.post("/login-google", { token: tokenGoogle });
      console.log("Login with Google success:", user.data);

      localStorage.setItem("token", user.data.token);
      dispatch(login(user.data));

      toast.success("Login with Google Successful");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data || "Login with Google failed");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="form-box login">
        <img src="public/assets/logo.jpg" className="logo-Login" alt="Logo" />
        <form onSubmit={handleSubmit}>
          <h3>LOGIN</h3>

          <div className="mb-3">
            <label className="title">Phone</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter phone number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              pattern="[0-9]*"
              onInput={(e) =>
                (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
              }
            />
            <FaPhone className="icon" />
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
          </div>

          <div className="mb-3">
            <label className="title">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />

              <span
                className="password-toggle-icon"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
        </form>

        <div className="login-gg">
          <button
            type="button"
            className="btn login-google"
            onClick={handleLoginWithGoogle}
          >
            Login with Google
          </button>
        </div>

        <p className="forgot-password text-right">
          <a href="forgot-password">Forgot password?</a>
        </p>

        <div className="register-link">
          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>

        <ToastContainer />
      </div>
    </>
  );
}
