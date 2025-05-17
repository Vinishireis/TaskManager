const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Geração do Token JWT
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {expiresIn: "7d"});
}

// @desc    Registra um novo usuário
// @route POST /api/auth/register
// @acess Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl, adminInviteToken } = req.body;

        // Verifica se o usuário já existe 
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Usuário já existe" });
        }

        let role = "member";
        if (adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN) {
            role = "admin";
        }
        
        // Hash da Senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Criar um novo usuário
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role,
        });

        // Retorna User Data com o JWT
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });

    } catch (error) {
        res.status(500).json({ message: "Erro no Servidor", error: error.message });
    }
};



// @desc Login USer
// @route Post /api/auth/login
// @acess Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
if (!user) {
  return res.status(401).json({ message: "Email ou Senha Inválidos" });
}


        // Comparar a Senha
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Email ou Senha Inválidos" });
        }

        // Retorna user data com JWT
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Erro no Servidor", error: error.message });
    }
};


// @desc GET user profile
// @route GET /api/auth/profile
// @acess Private (Requires JWT)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user){
            return res.status(401).json({ message: "Usuário não encontrado"});
        }
        return res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erro no Servidor", error: error.message });
    }
};



// @desc UPDATE user profile
// @route PUT /api/auth/profile
// @acess Private (Requires JWT)
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)

        if (!user) {
            return res.status(401).json({ message: "Usuário não encontrado"});
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;


        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt)
        }

        const updateUser = await user.save();
        res.json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            role: updateUser.role,
            token: generateToken(updateUser._id),
        })
    } catch (error) {
        res.status(500).json({ message: "Erro no Servidor", error: error.message });
    }
};


module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };