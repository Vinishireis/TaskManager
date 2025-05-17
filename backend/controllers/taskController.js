const Task = require("../models/Task")

// @desc  Get todas as tarefas (Admin: todos, Usuários: somente com tarefas)
// @route Get /api/tasks/
// @acess Private 
const getTasks = async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {};

        if (status) {
            filter.status = status;
        }

        let tasks;

        if (req.user.role === "admin") {
            tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        } else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        }

        // Adicionar contador de todoChecklist entre as tarefas
        const enrichedTasks = await Promise.all(
    tasks.map(async (task) => {
        const checklist = task.todoChecklist || [];
        const completedCount = checklist.filter(item => item.completed).length;
        return { ...task._doc, completedCount };
    })
);


        // Status Summary Counts
        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : { assignedTo: req.user._id }
        );

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: "Pendente",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: "Em Progresso",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        const completedTasks = await Task.countDocuments({
            ...filter,
            status: "Completo",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        res.json({
            tasks: enrichedTasks,
            statusSummary: {
                all: allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Erro no Servidor", error: error.message });
    }
};


// @desc Get tarefas pelo ID
// @route Get api/tasks/:id
// @acess Private 
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        if (!task) return res.status(404).json({ message: "Tarefa não Encontrada"});
        
        res.json(task);
    } catch (error) {
        res.status(500).json({message: "Erro no Servidor", error: error.message});
    }
}

// @desc Create a new task (Somente adminstradores)
// @route Post api/tasks/
// @acess (Somente Administradores)
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist,
        } = req.body;
        if (!Array.isArray(assignedTo)) {
            return res
            .status(400)
            .json({ message: "assignedTo deve ser um array de IDs de usuários" })

        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            todoChecklist,
            attachments,
        })

        res.status(201).json({ message: "Task Created sucessfully", task})
    } catch (error) {
        res.status(500).json({message: "Erro no Servidor", error: error.message});
    }
};

// @desc Update Detalhes das Tarefas
// @route PUT /api/tasks/:id
// @acess Private 
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: "Tarefa não encontrada"})

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoChecklist = req.body.todoCheckList || task.todoChecklist;
        task.attachments = req.body.attachments || task.attachments;

        if (req.body.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)) {
                return res
                .status(400)
                .json({ message: "assignedTo must be an array of user IDs"})
            }
            task.assignedTo = req.body.assignedTo;
        }

    const updatedTask = await task.save()
    res.json({ message: "Tarefa atualizada com Sucesso", updatedTask })
    } catch (error) {
        res.status(500).json({message: "Erro no Servidor", error: error.message});
    }
};

// @desc Delete task (Somente Administradores)
// @route Delete /api/tasks/:id
// @acess Private (Admin)
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)

        if (!task) return res.status(404).json({ message: "Tarefa não encontrada" })

            await task.deleteOne();
            res.json({ message: "Tarefa Deletada com Sucesso"})
    } catch (error) {
        res.status(500).json({message: "Erro no Servidor", error: error.message});
    }
};

// @desc Update task Status
// @route PUT /api/tasks/:id/status
// @acess Private 
const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Tarefa não encontrada" });


        const isAssigned = task.assignedTo.some(
            (userId) => userId.toString() === req.user._id.toString()
        );

        if (!isAssigned && req.user.role !== "admin") {
            return res.status(403).json({ message: "Não autorizado" });
        }

        // Atualiza o status da tarefa
        task.status = req.body.status || task.status;

        if (task.status === "Completo") {
            task.todoChecklist.forEach((item) => (item.completed = true));
            task.progress = 100;
        }

        await task.save();
        res.json({ message: "Status da Tarefa Atualizado", task });
    } catch (error) {
        res.status(500).json({ message: "Erro no Servidor", error: error.message });
    }
};


// @desc Atualiza o item da checklist de uma tarefa
// @route PUT /api/tasks/:id/todo
// @access Private
const updateTaskCheckList = async (req, res) => {
  try {
    const { todoChecklist } = req.body; // note o 'c' minúsculo
    
    if (!Array.isArray(todoChecklist)) {
      return res.status(400).json({ message: "Formato inválido da checklist" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }

    task.todoChecklist = todoChecklist;

    const completedCount = task.todoChecklist.filter(item => item.completed).length;
    const totalItems = task.todoChecklist.length;
    task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    if (task.progress === 100) {
      task.status = "Completo";
    } else if (task.progress > 0) {
      task.status = "Em Progresso";
    } else {
      task.status = "Pendente";
    }

    await task.save();

    const updatedTask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    res.json({ message: "Checklist da tarefa atualizado", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Erro no Servidor", error: error.message });
  }
};



// @desc Dashboard Data (Somente Adminstradores)
// @route Get /api/tasks/dashboard-data
// @acess Private
const getDashboardData = async (req, res) => {
    try {
        //Fetch statistics
        const totalTasks = await Task.countDocuments()
        const pendingTasks = await Task.countDocuments({ status: "Pendente"})
        const completedTasks = await Task.countDocuments({ status: "Completo"})
        const overdueTasks = await Task.countDocuments({
            status: { $ne: "Completo"},
            dueDate: { $lt: new Date()},
        })

        // Ensure alt possible statuses are included
        const taskStatuses = ["Pendente", "Em Progresso", "Completo"]
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1},
                },
            },
        ]);
    const taskDistribution = taskStatuses.reduce((acc, status) => {
        const formattedKey = status.replace(/\s+/g, ""); //Remove espaços para chaves
        acc[formattedKey] = 
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
        return acc;
    }, {})
    taskDistribution["Todos"] = totalTasks; // Add total count to taskDistribution


    //Ensure all priority levels are included
    const taskPriorities = ["Baixo", "Médio", "Alto"]
    const taskPriorityLevelsRaw = await Task.aggregate([
        {
            $group: {
                _id: "$priority",
                count: { $sum: 1},
            },
        },
    ])

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
        acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0
        return acc;
    }, {})


    //Fetch recent 10 tasks
    const recentTasks = await Task.find()
    .sort({ createdAt: -1})
    .limit(10)
    .select("title status priority dueDate createdAt")

    res.status(200).json({
        statistics: {
            totalTasks,
            pendingTasks,
            completedTasks,
            overdueTasks,
        },
        charts: {
            taskDistribution,
            taskPriorityLevels,
        },
        recentTasks,
    })
    } catch (error) {
        res.status(500).json({message: "Erro no Servidor", error: error.message});
    }
};

// @desc Dashboard Data (Usuários Específicos)
// @route Get /api/tasks/user-dashboard-data
// @acess Private 
const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id; // Somente dados do usuário logado

        // Estatísticas específicas do usuário
        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pendente" });
        const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Completo" });
        const overdueTasks = await Task.countDocuments({
            assignedTo: userId,
            status: { $ne: "Completo" },
            dueDate: { $lt: new Date() },
        });

        // Tarefas Distribuição por status
        const taskStatuses = ["Pendente", "Em Progresso", "Completo"];
        const taskDistributionRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, ""); // Remove espaços para usar como chave
            acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks;

        // Distribuição por prioridade
        const taskPriorities = ["Baixo", "Médio", "Alta"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { _id: "$priority", count: { $sum: 1 } } }
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        }, {});

        // Últimas 10 tarefas criadas
        const recentTasks = await Task.find({ assignedTo: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });
    } catch (error) {
        res.status(500).json({ message: "Erro no Servidor", error: error.message });
    }
};


module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskCheckList,
    getDashboardData,
    getUserDashboardData,
};