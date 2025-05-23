import {
  LuLayoutDashboard,
  LuUsers,
  LuClipboardCheck,
  LuSquarePlus,
  LuLogOut,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: "02",
    label: "Gerenciar Tarefas",
    icon: LuClipboardCheck,
    path: "/admin/tasks",
  },
  {
    id: "03",
    label: "Criar Tarefa",
    icon: LuSquarePlus,
    path: "/admin/create-task",
  },
  {
    id: "04",
    label: "Membros da Equipe",
    icon: LuUsers,
    path: "/admin/users",
  },
  {
    id: "05",
    label: "Sair",
    icon: LuLogOut,
    path: "logout",
  },
];

export const SIDE_MENU_USER_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/user/dashboard",
  },
  {
    id: "02",
    label: "Gerenciar Tarefas",
    icon: LuClipboardCheck,
    path: "/user/tasks",
  },
  {
    id: "05",
    label: "Sair",
    icon: LuLogOut,
    path: "logout",
  },
];

export const PRIORITY_DATA = [
  { label: "Baixo", value: "Baixo" },
  { label: "Médio", value: "Médio" },
  { label: "Alto", value: "Alto" },
];

export const STATUS_DATA = [
  { label: "Pendente", value: "Pendente" },
  { label: "Em Progresso", value: "Em Progresso" },
  { label: "Completo", value: "Completo" },
];