const Task = require("../models/Task");
const User = require("../models/User");
const excelJS = require("exceljs");

// @desc Exporta todas as tarefas em um arquivo Excel
// @route GET /api/reports/export/tasks
// @access Modo Administrador (Privado)
const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Task Report");

    worksheet.columns = [
    { header: "ID da Tarefa", key: "_id", width: 25 },
    { header: "Título", key: "title", width: 30 },
    { header: "Descrição", key: "description", width: 50 },
    { header: "Prioridade", key: "priority", width: 15 },
    { header: "Status", key: "status", width: 20 },
    { header: "Data de Vencimento", key: "dueDate", width: 20 },
    { header: "Atribuído a", key: "assignedTo", width: 40 },

    ];

    tasks.forEach((task) => {
      const assignedTo = task.assignedTo
        .map((user) => `${user.name} (${user.email})`)
        .join(", ")
      worksheet.addRow({
        _id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.toISOString().split("T")[0],
        assignedTo: assignedTo || "Não Atribuído",
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="tasks_report.xlsx"'
    );

    return workbook.xlsx.write(res).then(() => {
        res.end()
    });
  } catch (error) {
    res.status(500)
    .json({ message: "Erro na exportação das tarefas", error: error.message,});
  }
};


// @desc Exporta tarefas de usuários em um arquivo Excel
// @route GET /api/reports/export/users
// @access Modo Administrador (Privado)
const exportUsersReport = async (req, res) => {
    try {
        const users = await User.find().select("name email _id").lean();
        const userTasks = await Task.find().populate("assignedTo", "name email _id");

        const userTaskMap = {};

        users.forEach((user) => {
            userTaskMap[user._id] = {
                name: user.name,
                email: user.email,
                taskCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0,
            };
        });

        userTasks.forEach((task) => {
            if (task.assignedTo) {
                task.assignedTo.forEach((assignedUser) => {
                    if (userTaskMap[assignedUser._id]) {
                        userTaskMap[assignedUser._id].taskCount += 1;
                        if (task.status === "Pendente") {
                            userTaskMap[assignedUser._id].pendingTasks +=1
                        } else if (task.status === "Em Progresso") {
                            userTaskMap[assignedUser._id].inProgressTasks += 1
                        } else if (task.status === "Completo") {
                            userTaskMap[assignedUser._id].completedTasks +=1
                        }
                    }
                })
            }
        });

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("User Task Report");

        worksheet.columns = [
         { header: "Nome do Usuário", key: "name", width: 30 },
         { header: "E-mail", key: "email", width: 40 },
         { header: "Total de Tarefas Atribuídas", key: "taskCount", width: 20 },
         { header: "Tarefas Pendentes", key: "pendingTasks", width: 20 },
         { header: "Tarefas em Andamento", key: "inProgressTasks", width: 20 },
         { header: "Tarefas Concluídas", key: "completedTasks", width: 20 },

        ];

        Object.values(userTaskMap).forEach((user) => {
            worksheet.addRow(user);
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="users_reports.xlsx"'
        );

        return workbook.xlsx.write(res).then(() => {
            res.end();
        });

    } catch (error) {
        res.status(500).json({
            message: "Erro na exportação dos usuários",
            error: error.message,
        });
    }
};

module.exports = {
    exportTasksReport,
    exportUsersReport,
};