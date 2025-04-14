import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "User Not Authorized" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id) {
      req.body = req.body || {};
      req.body.userId = tokenDecode.id;
    } else {
      return res
        .status(403)
        .json({ success: false, message: "User Not Authorized" });
    }
    next();
  } catch (error) {
    console.log("Error in Auth Middleware : ", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default authUser;
