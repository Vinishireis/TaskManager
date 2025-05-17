const jwt = require("jsonwebtoken");
const User = require("../models/User");

//Middleware para proteger as rotas
const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if ( token && token.startsWith("Bearer")) {
            token = token.split(" ") [1] // Extrair o Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } else {
            res.status(401).json({ message: "Não Autorizado, sem Token" })
        }
    }  catch (error) {
        res.status(401).json({ message: "Falha de Token", error: error.message });
    }
}

//Middleware para Acesso Somente Admin 
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({message: "Acesso Negado, somente Administradores"})
    }
}

module.exports = { protect, adminOnly }