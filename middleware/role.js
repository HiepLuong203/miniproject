const roleUser = (...roles) => {
  return (req, res, next) => {
    // req.user được gán từ middleware authenticateToken
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Không có token hoặc token không hợp lệ" });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền thực hiện hành động này" });
    }

    next();
  };
};

module.exports = roleUser;
