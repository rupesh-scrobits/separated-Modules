import React from "react";
import "../../styles/components-style/Kanban.css";
import { Avatar, Button, Input, Tooltip } from "antd";
import { Kanban, filterIcons } from "../../utilities/icons/Icons";
import ProjectDetails from "./ProjectDetails";
import CreateCardDrawer from "./CreateCardDrawer";
import GiveRating from "./GiveRating";
import filterStyles from "../../styles/components-style/AllContactsPageFilters.module.css";
import {
  setCardSearch,
  setOpenCreateCardDrawer,
} from "../../redux/features/projectSlices/ProjectManagementSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
// import CreateCardDrawer from './CreateCardDrawer';
import { getJwtBody } from "../../utilities/commonFunctions/commonComponents";
import { Link } from "react-router-dom";

const KanbanHeader = () => {
  const access = getJwtBody(sessionStorage.getItem("token"));
  const dispatch = useDispatch();
  const { projectDetails, projectBoard } = useSelector((state) => {
    return state.feature.ProjectSlice;
  });

  function getAllMemberNames(projectBoardData) {
    const membersMap = {};

    if (Array.isArray(projectBoardData)) {
      projectBoardData
        .flatMap((entry) => entry?.cards || []) // Flatten the nested cards array
        .forEach((card) => {
          card?.members?.forEach((member) => {
            if (member?.name && member?.color) {
              membersMap[member.name] = member.color;
            }
          });
        });
    }

    // Convert the object to an array of objects
    const uniqueMembers = Object.keys(membersMap).map((name) => ({
      name,
      color: membersMap[name],
    }));

    return uniqueMembers;
  }
  const filteredUserData = getAllMemberNames(projectBoard);
  const handleCreateCard = () => {
    dispatch(setOpenCreateCardDrawer({ value: true }));
  };

  const handleSearch = (e) => {
    dispatch(setCardSearch({ data: e.target.value }));
  };
  return (
    <div className="kanbanHeader">
      <div className="kanbanSearchContainer">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <span>
            <Link style={{ display: "flex", alignItems: "center" }} to={"/"}>
              {Kanban.leftArrow}
            </Link>
          </span>
          <h1
            style={{
              color: "#2F343E",
              fontSize: 16,
              margin: "0",
              fontWeight: "bold !important",
            }}
          >
            {projectDetails?.[0]?.title}
          </h1>
        </div>
        <div className="kanbanSearch">
          <Input
            suffix={filterIcons.search}
            id="searchInput"
            placeholder="Search Task"
            className="kaSearchInput"
            onChange={handleSearch}
            allowClear
          />

          {/* <Button disabled className="kanbanTaskButton">
            Only my Tasks
          </Button> */}
        </div>
      </div>
      <div className="kanbanProjectContainer">
        <Avatar.Group maxCount={3} className="avatar-group-container">
          {filteredUserData?.map((card, index) => {
            const initials = card?.name
              .split(" ")
              .map((part) => part.charAt(0).toUpperCase())
              .join("");
            return (
              <Tooltip title={card?.name} placement="bottom" key={index}>
                <Avatar style={{ backgroundColor: "#" + card?.color }}>
                  {initials}
                </Avatar>
              </Tooltip>
            );
          })}
        </Avatar.Group>

        <ProjectDetails />
        <CreateCardDrawer />
        {access?.vendor === 1 ? null : (
          <>
            <GiveRating />
            <div className={filterStyles.createButtons}>
              <Button onClick={() => handleCreateCard()} className="createCard">
                Create Card
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default KanbanHeader;
