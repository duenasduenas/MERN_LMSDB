import { Navigate } from "react-router-dom";

function RoleGuard({ allowedRoles, children }) {
    const role = localStorage.getItem("role");

    // not logged in
    if (!role) {
        return <Navigate to="/login" />;
    }

    // wrong role
    if (!allowedRoles.includes(role)) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default RoleGuard;
