function SignupForm() {
  return (
    <div>
      <h2>Signup</h2>
      <input type="text" placeholder="Full Name"/>
      <input type="email" placeholder="Email"/>
      <input type="password" placeholder="Password"/>
      <input type="password" placeholder="Confirm Password"/>
      <button className="submit-btn">Signup</button>
    </div>
  );
}

export default SignupForm;