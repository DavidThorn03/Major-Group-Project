import dotenv from "dotenv";
dotenv.config();
import speakeasy from "speakeasy";

const verifyOTP = async (otp) => {
  const verified = speakeasy.totp.verify({
    secret: process.env.AUTHKEY,
    encoding: "base32",
    token: otp,
  });

  return verified;
};

export default verifyOTP;
