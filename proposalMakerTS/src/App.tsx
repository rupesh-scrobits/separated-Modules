import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ProposalMakerPage from "./pages/proposalMaker/proposalMakerPage/ProposalMakerPage";
import Demo from "./components/proposalMaker/demo";
import ProposalsListPage from "./pages/proposalMaker/proposalMakerPage/ProposalsListPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Demo />} />
          <Route
            path="/proposalmaker/proposaleditor"
            element={<ProposalMakerPage />}
          />
          <Route
            path="/proposalmaker/allproposals"
            element={<ProposalsListPage />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
