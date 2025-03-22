import key from "../../config/APIKey.js";
import speakeasy from "speakeasy";

const verifyOTP = async (otp) => {
  const verified = speakeasy.totp.verify({
    secret: key,
    encoding: "base32",
    token: otp,
  });

  return verified;
};

export default verifyOTP;
