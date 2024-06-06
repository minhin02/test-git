import { useState } from "react";
import * as Yup from "yup";
import "./ForgotPassword.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../config/axios";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({});

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
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
        const response = await api.post("/forgot_password", {
          email: formData.email,
        });
        console.log("Forgot password success:", response);
        toast.success("Password reset link sent to your email");
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
    <div className="form-box forgot-password">
      <img src="public/assets/logo.jpg" className="logo" alt="Logo" />
      <form onSubmit={handleSubmit}>
        <h3>Forgot Password</h3>

        <div className="mb-3">
          <label className="title">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Reset Password
          </button>
        </div>
        {/* <div className="Login-Link">
          <p>
            <Link to="/login">Login</Link>
          </p>
        </div> */}

        <ToastContainer />
      </form>
    </div>
  );
}

/* import { useState } from "react";
import * as Yup from "yup";
import "./ForgotPassword.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../config/axios";

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({});

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
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
        const response = await api.post("/forgot-password", {
          email: formData.email,
        });
        console.log("Forgot password success:", response);
        toast.success(`Chúng tôi đã gửi hướng dẫn thay đổi mật khẩu vào email "${formData.email}", vui lòng kiểm tra hộp thư cũng như thư mục spam của bạn`);
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
    <div className="form-box forgot-password">
      <img src="public/assets/logo.jpg" className="logo" alt="Logo" />
      <form onSubmit={handleSubmit}>
        <h3>Forgot Password</h3>

        <div className="mb-3">
          <label className="title">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Reset Password
          </button>
        </div>

        <ToastContainer />
      </form>
    </div>
  );
}
 */
