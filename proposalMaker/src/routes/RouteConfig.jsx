import React from "react";
import { Route, Routes } from "react-router-dom";
import ProposalMakerPage from "../pages/proposalMaker/proposalMakerPage/ProposalMakerPage";
import Demo from "../components/proposalMaker/demo";
import ProposalsListPage from "../pages/proposalMaker/proposalsListPage/ProposalsListPage";

function RouteConfig() {
  return (
    <Routes>
      <Route path="/" element={<Demo />} />
      <Route
        exact
        path="/proposalmaker/:proposalId/proposaleditor"
        element={<ProposalMakerPage />}
      />
      <Route
        exact
        path="/proposalmaker/proposaleditor"
        element={<ProposalMakerPage />}
      />
      <Route
        exact
        path="/proposalmaker/allproposals"
        element={<ProposalsListPage />}
      />
    </Routes>
  );
}

export default RouteConfig;
