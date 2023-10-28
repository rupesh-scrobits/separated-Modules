import React from "react";
import { Route, Routes } from "react-router-dom";
import KanbandBoardPage from "../pages/KanbanBoardPage";

function RouteConfig() {
  return (
    <div>
      <Routes>
       
        <Route
          exact
          path="/"
          element={<KanbandBoardPage />}
        />
      </Routes>
    </div>
  );
}

export default RouteConfig;
