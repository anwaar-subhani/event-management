// TODO: implement organizerSignup, organizerLogin, organizerProfile
// Keep this file owned by Member A (Auth).

async function organizerSignup(req, res) {
  return res.status(501).json({ message: 'organizerSignup not implemented yet' });
}

async function organizerLogin(req, res) {
  return res.status(501).json({ message: 'organizerLogin not implemented yet' });
}

async function organizerProfile(req, res) {
  return res.status(501).json({ message: 'organizerProfile not implemented yet' });
}

module.exports = {
  organizerSignup,
  organizerLogin,
  organizerProfile
};
