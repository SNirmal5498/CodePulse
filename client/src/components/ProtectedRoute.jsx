import { Navigate } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";

function ProtectedRoute({ children }) {
  const { isLoading, isError } = useProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;