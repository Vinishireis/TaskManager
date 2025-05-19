import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import toast from "react-hot-toast";

const StatCard = ({ label, value, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-100";
      case "Completed":
        return "text-indigo-500 bg-indigo-50 border border-indigo-100";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-100";
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        {status && (
          <span className={`text-xs px-2 py-1 rounded-md ${getStatusColor()}`}>
            {status}
          </span>
        )}
      </div>
    </div>
  );
};

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    members: 0
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      const users = response.data || [];
      
      setAllUsers(users);
      
      // Calculate statistics
      setStats({
        total: users.length,
        admins: users.filter(u => u.role === 'admin').length,
        members: users.filter(u => u.role !== 'admin').length
      });
      
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
        responseType: "blob",
      });

      // Create a URL for the blob 
      const url = window.URL.createObjectURL(new Blob([response.data])); 
      const link = document.createElement("a"); 
      link.href = url; 
      link.setAttribute("download", "user_details.xlsx"); 
      document.body.appendChild(link); 
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error", error);
      toast.error("Failed to download report. Please try again");
    }
  };

  const getUserRole = (role) => {
    return role === "admin" ? "Administrator" : "Member";
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="my-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-medium">Team Members</h2>

          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={handleDownloadReport}
          >
            <LuFileSpreadsheet className="text-lg" />
            <span>Download Report</span>
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard label="Total Users" value={stats.total} />
          <StatCard label="Administrators" value={stats.admins} status="Completed" />
          <StatCard label="Members" value={stats.members} status="In Progress" />
        </div>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">{error}</div>
        ) : allUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white p-4 rounded-lg shadow flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                  </div>
                </div>

                <div className="mt-auto">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {getUserRole(user.role)}
                  </span>

                  <p className="text-gray-500 text-xs mt-2">
                    Last access:{" "}
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : "Not available"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">No members found</div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;