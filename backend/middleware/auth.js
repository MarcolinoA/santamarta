import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
	const token = req.body.token || req.query.token || req.headers["x-access-token"];

	if(!token) {
		return res.status(403).send("è richiesto un token di autenticazione")
	}

	try {
		const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
		req.currentUser = decodedToken
	} catch (error) {
		return res.status(401).send("Token invalido")
	}

	return next();
}

module.exports = verifyToken