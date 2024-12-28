import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router';
import LoginTheme from './template/LoginTheme/LoginTheme';
import AppTheme from './template/AppTheme/AppTheme';
import Home from "./screens/Home/Home";
import UserScreen from "./screens/Users/User";
import UsersScreen from "./screens/Users/Users";
import ProductsScreen from "./screens/Products/Products";
import ProductsCategoryScreen from "./screens/Products/ProductsCategory";
import PermissionsScreen from "./screens/Permissions/Permissions";

const Router = () => {
    const { LoginData } = useSelector((state: any) => state);
    const isAdmin = LoginData.role === "ADMIN";

    if (LoginData.token === null) return <Routes>
        <Route path="/login">
            <Route index element={<LoginTheme />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>

    return (
        <Routes>
            <Route path="/home">
                <Route path="" element={<AppTheme><Home /></AppTheme>} />
            </Route>

            <Route path="/usuario">
                <Route path="" element={<AppTheme><UserScreen /></AppTheme>} />
            </Route>

            {isAdmin && (
                <>
                    <Route path="/usuarios">
                        <Route path="" element={<AppTheme><UsersScreen /></AppTheme>} />
                    </Route>
                    <Route path="/ajustes">
                        <Route index element={<AppTheme><PermissionsScreen /></AppTheme>} />
                    </Route>
                </>
            )}

            <Route path="/produtos">
                <Route index element={<AppTheme><ProductsScreen /></AppTheme>} />
                <Route path="categorias" element={<AppTheme><ProductsCategoryScreen /></AppTheme>} />
            </Route>

            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    )
}

export default Router;