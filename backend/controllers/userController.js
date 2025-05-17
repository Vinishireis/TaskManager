const Task = require("../models/Task")
const User = require("../models/User")
const bcrypt = require("bcryptjs")


// @desc    Get All Users (Administradores Somente)
// @route   Get /api/users/
// @acess   Private (Admin)
const getUsers = async (req, res) => {
    try {
        const users = await User.find ({ role: 'member'}).select("-password");
        
        // Adicionar Tarefas para outro usuário
        const userWithTaskCounts = await Promise.all(users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "Pendente"});
        const inProgressTask = await Task.countDocuments({ assignedTo: user._id, status: "Em Progresso"});
        const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "Completo"})


        return {
            ...user._doc, 
            pendingTasks,
            inProgressTask,
            completedTasks,
        };
        }))
    
        res.json(userWithTaskCounts);
    } catch (error) {
        res.status(500).json({ message: "Erro no Servidor", error: error.message});
    }
};

// @desc    Get user by ID
// @route   Get /api/users/:id
// @acess Private 
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "Usuário Não Encontrado"});
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erro no Servidor", error: error.message});
    }
};


module.exports = { getUsers, getUserById}