import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export const useUserAuth = () => {
    const { user, loading, cleanUser } = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (loading) return;
        if (user) return;
        
        if(!user) {
            cleanUser()
            navigate("/login")
        }
    }, [user, loading, cleanUser, navigate])
}