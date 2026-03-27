import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

import Index from "../pages/Index";


const AppRouter = () => {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/" element={<Index />} />

            </Route>

            <Route element={<ProtectedRoute />}>
            </Route>

        </Routes>
    );
};

export default AppRouter;