import React, { useState } from 'react';
import * as Yup from 'yup';
import './Register.css';
import { FaUser, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../../config/axios";
import { Link} from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(2, "No shorter than 2 characters!")
      .max(50, "No longer than 50 characters!")
      .required('Username is required'),
    phone: Yup.string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number cannot exceed 15 digits")
      .required('Phone number is required'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });

      const user = await api.post('/register', {
        username: formData.username,
        phone: formData.phone,
        password: formData.password,
      });
      console.log("Registration success:", user.data);
      toast.success('Registration Successful');

    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((err) => {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [err.path]: err.message,
          }));
        });
      } else {
        console.log(error);
        toast.error(error.response?.data || 'Registration failed');

      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="form-box register">
      <form onSubmit={handleSubmit}>
        <img src='public/assets/logo.jpg' className="logo" alt="Logo" />
        <h3>SIGN UP</h3>

        <div className="mb-3">
          <label className="title">Username</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <FaUser className="icon" />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        <div className="mb-3">
          <label className="title">Phone Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter phone number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            pattern="[0-9]*"
            onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
          />
          <FaPhone className="icon" />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
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
            <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEye /> : <FaEyeSlash  />}
            </span>
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="mb-3">
          <label className="title">Confirm Password</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="form-control"
              placeholder="Confirm password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <span className="password-toggle-icon" onClick={toggleConfirmPasswordVisibility}>
              {showConfirmPassword ? <FaEye/> : <FaEyeSlash  />}
            </span>
          </div>
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">Sign up</button>
        </div>

        <div className="Login-Link">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>

        <ToastContainer />
      </form>
    </div>
  );
}
