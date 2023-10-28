import React from "react";
import KanbanHeader from "../components/KanbanBoard/KanbanHeader";
import KanbanContent from "../components/KanbanBoard/KanbanContent";
import CardDetails from "../components/KanbanBoard/CardDetails";

const KanbanBoardPage = () => {
  return (
    <div>
      <KanbanHeader />
      <KanbanContent />
      <CardDetails />
    </div>
  );
};

export default KanbanBoardPage;
