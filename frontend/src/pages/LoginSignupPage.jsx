import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import Navbar from "../components/Navbar";
import "./LoginSignupPage.css";

function LoginSignupPage() {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-box">
          <div className="toggle-buttons">
            <button onClick={() => setIsLogin(true)} className={isLogin ? "active" : ""}>Login</button>
            <button onClick={() => setIsLogin(false)} className={!isLogin ? "active" : ""}>Signup</button>
          </div>
          {isLogin ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </>
  );
}

export default LoginSignupPage;