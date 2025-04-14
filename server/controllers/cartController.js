import User from "../models/User.js";

// Update User CartData : /api/cart/update
export const updateCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body; // userId will come from middleware that is authUser (in middleware we are passing userId in body)

    await User.findByIdAndUpdate(userId, { cartItems });
    return res.status(200).json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log("Error in api/cart/update API : ", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
