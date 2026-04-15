function LoginForm() {
  return (
    <div>
      <h2>Login</h2>
      <input type="email" placeholder="Email"/>
      <input type="password" placeholder="Password"/>
      <button className="submit-btn">Login</button>
    </div>
  );
}

export default LoginForm;