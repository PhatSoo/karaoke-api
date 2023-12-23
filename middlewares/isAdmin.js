const checkAdmin = async (req, res, next) => {
  if (!req.userInfo.isAdmin) {
    return res.status(500).json({ success: false, message: 'You have no permission to access this!' });
  }
  next();
};

module.exports = checkAdmin;
