import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data'
import { UserContext } from '../../context/userContext'

const SideMenu = ({ activeMenu }) => {
    const { user, cleanUser } = useContext(UserContext)
    const [sideMenuData, setSideMenuData] = useState([])

    const navigate = useNavigate()
    
    const handleClick = (route) => {
        if (route === "logout") {
            handleLogout()
            return
        }

        navigate(route)
    }

    const handleLogout = () => {
        localStorage.clear()
        cleanUser()
        navigate("/login")
    }

    useEffect(() => {
        if (user) {
            setSideMenuData(user?.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA)
        }  
    }, [user])

    return (
        <div className='w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20'>
            <div className='flex flex-col items-center justify-center mb-7 pt-5'>
                <div className='relative'>
                    <img
                        src={user?.profileImageUrl || ""}
                        alt='Imagem de Perfil'
                        className='w-16 h-16 rounded-full object-cover'
                    />
                </div>

                {user?.role === "admin" && (
                    <div className='text-[10px] font-medium text-white bg-blue-500 px-3 py-0.5 rounded mt-1'>
                        Administrador
                    </div>
                )}

                <h5 className='text-[12px] text-gray-500'>
                    {user?.name || ""}
                </h5>
                
                <p className='text-[12px] text-gray-500'>{user?.email || ""}</p>
            </div>

            {sideMenuData.map((item, index) => (
                <button
                    key={`menu_${index}`}
                    className={`w-full flex items-center gap-4 text-[15px] ${
                        activeMenu === item.label
                            ? "text-primary bg-gradient-to-r from-blue-50/40 to-blue-100/50 border-r-4 border-primary"
                            : ""
                    } py-3 px-6 mb-3 cursor-pointer`}
                    onClick={() => handleClick(item.path)}
                >
                    <item.icon className="text-xl" />
                    {item.label}
                </button>
            ))}
        </div>
    )
}

export default SideMenu
