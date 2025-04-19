
export const ProtectedComponent = ({ children }) => {

    const getAccessTokenFromSessionStorage= localStorage.getItem("access_token");
  // Check if the user is authenticated
  if (!getAccessTokenFromSessionStorage) {
    // If not authenticated, redirect to the login page
    window.location.href = "/login";
    return <></>;
  }

  // If authenticated, render the child routes
  return <>{children}</>;
};