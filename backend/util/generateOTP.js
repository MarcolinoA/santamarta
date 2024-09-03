const generateOTP = () => {
  try {
    // Genera un OTP a 4 cifre
    return `${Math.floor(1000 + Math.random() * 9000)}`;
  } catch (error) {
    throw error;
  }
};

export default generateOTP;