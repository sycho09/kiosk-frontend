import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminMain from "../Page/Admin/AdminMain";
import AdminManageProductAddItem from "../Page/Admin/AdminManageProductAddItem";
import AdminManageProductItemList from "../Page/Admin/AdminManageProductItemList";
import AdminMenu from "../Page/Admin/AdminMenu";
import AdminLayout from "../Layouts/AdminLayout";
import PageNotFound from "../Page/404/404";
import MangeOrderMain from "../Page/MangeOrder/MangeOrderMain";
import OrderLayout from "../Layouts/OrderLayout";
import ClientLayout from "../Layouts/ClientLayout";
import ClientMain from "../Page/Client/ClientMain";
import ClientMenu from "../Page/Client/ClientMenu";
import ClientSelectList from "../Page/Client/ClientSelectList";

const Router = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="login" element={<AdminMain />} />
        <Route path=":id">
          <Route path="menu" element={<AdminMenu />} />
          <Route path="manage-customer-order" />
          <Route
            path="manage-product"
            element={<AdminManageProductItemList />}
          />
          <Route path="add-product" element={<AdminManageProductAddItem />} />
        </Route>
      </Route>
      <Route path="/manage-order" element={<OrderLayout />}>
        <Route path="" element={<MangeOrderMain />} />
      </Route>
      <Route path="/order" />
      <Route path="/client" element={<ClientLayout />}>
        <Route path="" element={<Navigate to="/client/main" />} />
        <Route path="main" element={<ClientMain />} />
        <Route path="menu" element={<ClientMenu />} />
        <Route path="select-list" element={<ClientSelectList />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default Router;
