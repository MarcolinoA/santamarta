import jwt from "jsonwebtoken";

const createToken = (
	tokenData,
	tokenKey = process.env.TOKEN_KEY,
	expiresIn = process.env.TOKEN_EXPIRY
) => {
	try {
			const token = jwt.sign(tokenData, tokenKey, { expiresIn });
			return token;
	} catch (error) {
			throw error;
	}
};

export default createToken;