import { AuthProvider } from "./context/AuthContext";
import { ScheduleProvider } from "./context/ScheduleContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <ScheduleProvider>
        <AppRoutes />
      </ScheduleProvider>
    </AuthProvider>
  );
}

export default App;