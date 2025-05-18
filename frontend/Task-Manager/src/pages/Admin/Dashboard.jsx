import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import "moment/locale/pt-br";
import InfoCard from "../../components/Cards/InfoCard";
import { addThousandsSeparator } from "../../utils/helper";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";

moment.locale("pt-br");

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

const Dashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chart Data
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || {};
    const taskPriorityLevels = data?.taskPriorityLevels || {};

    const taskDistributionData = [
      { status: "Pendente", count: taskDistribution.Pendente || 0 },
      { status: "Em Progresso", count: taskDistribution.EmProgresso || 0 },
      { status: "Completo", count: taskDistribution.Completo || 0 },
    ];

    console.log("Dados formatados para o gráfico:", taskDistributionData);
    setPieChartData(taskDistributionData);

    const PriorityLevelData = [
      { priority: "Baixo", count: taskPriorityLevels.Baixo || 0 },
      { priority: "Médio", count: taskPriorityLevels.Médio || 0 },
      { priority: "Alto", count: taskPriorityLevels.Alto || 0 },
    ];

    setBarChartData(PriorityLevelData);
  };

  const getDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      if (response.data) {
        console.log("Dados completos da API:", response.data);
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || {});
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSeeMore = () => navigate("/admin/tasks");

  useEffect(() => {
    getDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const formatDate = () => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "America/Sao_Paulo",
    };
    return new Intl.DateTimeFormat("pt-BR", options).format(new Date());
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="flex justify-center items-center h-64">
          <p>Carregando dados...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div>
          <div className="col-span-5">
            <h2 className="text-xl md:text-2xl">
              {getGreeting()}! {user?.name}
            </h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
              {formatDate()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <InfoCard
            label="Todas as Tarefas"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Todos || 0
            )}
            color="bg-blue-500"
          />

          <InfoCard
            label="Tarefas Em Progresso"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.EmProgresso || 0
            )}
            color="bg-orange-500"
          />

          <InfoCard
            label="Tarefas Pendentes"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Pendente || 0
            )}
            color="bg-red-500"
          />

          <InfoCard
            label="Tarefas Completas"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Completo || 0
            )}
            color="bg-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        {/* Gráfico de Pizza */}
        <div>
          <div className="card" style={{ minHeight: "400px" }}>
            <div className="flex items-center justify-between p-4">
              <h5 className="font-medium">Distribuição de Tarefas</h5>
            </div>
            {pieChartData.some((item) => item.count > 0) ? (
              <CustomPieChart data={pieChartData} colors={COLORS} />
            ) : (
              <div className="flex items-center justify-center h-64">
                <p>Não há dados suficientes para exibir o gráfico</p>
              </div>
            )}
          </div>
        </div>

        {/* Gráfico de Barras */}
        <div>
          <div className="card" style={{ minHeight: "400px" }}>
            <div className="flex items-center justify-between p-4">
              <h5 className="font-medium">Distribuição por Prioridade</h5>
            </div>
            {barChartData.some((item) => item.count > 0) ? (
              <CustomBarChart 
              data={barChartData} />
            ) : (
              <div className="flex items-center justify-center h-64">
                <p>Não há dados suficientes para exibir o gráfico</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabela de Tarefas Recentes */}
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between p-4">
              <h5 className="text-lg">Tarefas Recentes</h5>
              <button className="card-btn" onClick={onSeeMore}>
                Ver Todas <LuArrowRight className="text-base" />
              </button>
            </div>
            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
