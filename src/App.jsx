import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Collections from "./pages/Collections";
import Reports from "./pages/Reports";

function App() {

return (
    <BrowserRouter>

        <Routes>

            <Route
                path="/"
                element={<Dashboard />}
            />

            <Route
                path="/customers"
                element={<Customers />}
            />

            <Route
                path="/collections"
                element={<Collections />}
            />

            <Route
                path="/reports"
                element={<Reports />}
            />
        </Routes>

    </BrowserRouter>
);

}

export default App;
