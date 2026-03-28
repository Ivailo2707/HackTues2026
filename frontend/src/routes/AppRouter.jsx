import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

import Index from "../pages/Index";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import CreateVillage from "../pages/CreateVillage";
import VillageDetail from "../pages/VillageDetail";

const AppRouter = () => {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/create-village" element={<CreateVillage />} />
                <Route path="/villages/:id" element={<VillageDetail />} />
            </Route>

        </Routes>
    );
};

export default AppRouter;