import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Collections from "./pages/Collections";
import Reports from "./pages/Reports";
import Denominations from "./pages/DenominationCounter";

import ProtectedRoute from "./ProtectedRoute";

function App() {

return (

    <BrowserRouter>

        <Routes>

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/customers"
                element={
                    <ProtectedRoute>
                        <Customers />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/collections"
                element={
                    <ProtectedRoute>
                        <Collections />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/reports"
                element={
                    <ProtectedRoute>
                        <Reports />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/denominations"
                element={
                    <ProtectedRoute>
                        <Denominations/>
                    </ProtectedRoute>
                }
            />

        </Routes>

    </BrowserRouter>

);

}

export default App;
