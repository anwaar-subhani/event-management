import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import Navbar from "../components/Navbar";
import "./LoginSignupPage.css";

function LoginSignupPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [signupMessage, setSignupMessage] = useState('');
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/organizer-dashboard');
  };

  const handleSignupSuccess = () => {
    setIsLogin(true);
    setSignupMessage('Signup successful! Please login to continue.');
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-box">
          <div className="toggle-buttons">
            <button onClick={() => { setIsLogin(true); }} className={isLogin ? "active" : ""}>Login</button>
            <button onClick={() => { setIsLogin(false); setSignupMessage(''); }} className={!isLogin ? "active" : ""}>Signup</button>
          </div>
          {signupMessage && isLogin ? <p>{signupMessage}</p> : null}
          {isLogin ? <LoginForm onSuccess={handleLoginSuccess} /> : <SignupForm onSuccess={handleSignupSuccess} />}
        </div>
      </div>
    </>
  );
}

export default LoginSignupPage;