import { Navigate } from 'react-router-dom'

/**
 * ProtectedRoute
 *
 * Wraps any page that requires authentication.
 * If the user is not logged in (no localStorage token),
 * they are redirected to /login automatically.
 */
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('chronosops_auth') === 'true'

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
