import jwt from 'jsonwebtoken';

// Questo è un middleware di autenticazione che verifica il token JWT
const authMiddleware = (req, res, next) => {
  // Estrae il token dal cookie 'authToken'
  const token = req.cookies.authToken;

  // Se non c'è un token, restituisce un errore 401 (Non autorizzato)
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verifica il token usando la chiave segreta JWT_SECRET
    // Se il token è valido, 'decoded' conterrà i dati decodificati del token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Aggiunge i dati dell'utente decodificati all'oggetto request
    // Questo rende i dati dell'utente disponibili per le route successive
    req.user = decoded;

    // Passa al prossimo middleware o alla route handler
    next();
  } catch (error) {
    // Se la verifica del token fallisce (es. token scaduto o non valido),
    // restituisce un errore 401 (Non autorizzato)
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;