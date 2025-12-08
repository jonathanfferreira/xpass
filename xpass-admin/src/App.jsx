import React from 'react';
import AdminApp from './pages/AdminApp';

function App() {
  const handleReturnToPortal = () => {
    // In a real app this would redirect to a central portal or login
    console.log("Returning to portal...");
    alert("Logout / Return to Portal triggered");
  };

  return (
    <AdminApp onReturnToPortal={handleReturnToPortal} />
  );
}

export default App;
