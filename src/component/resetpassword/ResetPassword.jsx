import { useState } from "react";
import * as Yup from "yup";
import "./ResetPassword.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../config/axios";
import { useParams, Link } from "react-router-dom";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const { token } = useParams(); 
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
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
        const response = await api.post("/reset_password", {
          token,
          password: formData.password,
        });
        console.log("Reset password success:", response);
        toast.success("Password reset successfully");
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data || "Request failed");
      }
    } catch (validationErrors) {
      const formattedErrors = validationErrors.inner.reduce((acc, error) => {
        return { ...acc, [error.path]: error.message };
      }, {});
      setErrors(formattedErrors);
    }
  };

  return (
    <div className="form-box reset-password">
      <img src="public/assets/logo.jpg" className="logo" alt="Logo" />
      <form onSubmit={handleSubmit}>
        <h3>Reset Password</h3>

        <div className="mb-3">
          <label className="title">New Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter your new password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>

        <div className="mb-3">
          <label className="title">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Confirm your new password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Reset Password
          </button>
        </div>
        <div className="Login-Link">
          <p>
            <Link to="/login">Login</Link>
          </p>
        </div>

        <ToastContainer />
      </form>
    </div>
  );
}
