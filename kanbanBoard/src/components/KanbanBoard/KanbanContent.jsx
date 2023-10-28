import React, { useEffect, useRef, useState } from "react";
import "../../styles/components-style/Kanban.css";
import {
  projectIcons,
  Kanban,
  proposalMaker,
} from "../../utilities/icons/Icons";
import { PlusOutlined } from "@ant-design/icons";
import { Avatar, Popover, Spin, Tooltip } from "antd";
import {
  deleteProjectCard,
  setOpenCardDetailsModal,
  setOpenCreateCardDrawer,
  setProjectBoard,
  setSelectedCardDetails,
  setUpdateCreateProject,
  updateProjectCard,
} from "../../redux/features/projectSlices/ProjectManagementSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import moment from "moment";
import { priorityOptions } from "../../utilities/commonFunctions/tableOptions";
import { useLocation } from "react-router-dom";

const KanbanContent = () => {
  // const params = useParams();
  const dispatch = useDispatch();
  // const access = getJwtBody(sessionStorage.getItem("token"));
  const [draggedCard, setDraggedCard] = useState(null);
  const [popoverState, setPopoverState] = useState({
    cardIndex: -1,
    vendorIndex: -1,
    boardName: "",
  });
  const [deletePopoverState, setDeletePopoverState] = useState({
    cardIndex: -1,
    boardName: "",
  });
  const projectId = useLocation().pathname?.includes("project")
    ? useLocation()?.pathname?.split("/")[
        useLocation().pathname?.split("/")?.length - 1
      ]
    : "";
  const {
    projectBoard,
    getProjectBoardLoader,
    selectedCardDetails,
    cardSearch,
  } = useSelector((state) => state.feature.ProjectSlice);

  const colors = {
    "Pitch/Demo": { borderColor: "#00BBCC" },
    "Post Production": { borderColor: "#505265" },
    "Script/Project on board": {
      borderColor: "#2BA6FF",
    },
    "Pre-Production": { borderColor: " #FFE600" },
    "Production/Shoot": { borderColor: "#8B62FF" },
    Review: { borderColor: "#FF802C" },
    Completed: { borderColor: "#56C300" },
    Discarded: { borderColor: "#505265" },
  };

  const dragItemCard = useRef();
  const dragOverItemCard = useRef();

  const dragStartSection = (board, cardIndex) => {
    dragItemCard.current = { board, cardIndex };
    setDraggedCard({ board, cardIndex });
  };

  const dragEnterSection = (board, cardIndex) => {
    dragOverItemCard.current = { board, cardIndex };
  };

  const dropSections = (board) => {
    setDraggedCard(null);
    if (
      dragItemCard?.current?.board?.name ===
      dragOverItemCard?.current?.board?.name
    ) {
      // if card moves inside same board
      const tempCards = [...board?.cards]; // cards in same board
      const dragItemContent = tempCards[dragItemCard.current.cardIndex]; // content of dragged item

      tempCards.splice(dragItemCard.current.cardIndex, 1); // remove the dragged card from array
      tempCards.splice(dragOverItemCard.current.cardIndex, 0, dragItemContent); // add the dragged card in the new position

      let tempKanban = [...projectBoard];

      let currentBoardIndex = tempKanban?.findIndex(
        (data) => data.name === board.name
      );

      tempKanban.splice(currentBoardIndex, 1, {
        ...board,
        cards: tempCards.map((data, index) => {
          return { ...data, key: index };
        }),
      }); // add the changed rows to the main boards

      // API to update card keys
      tempCards.forEach((card, index) => {
        dispatch(
          updateProjectCard({
            cardData: { key: index },
            cardId: card.id,
          })
        );
      });
      dispatch(setProjectBoard({ value: tempKanban })); // set state of the board
    } else {
      // cross movement of card from one board to another
      let tempKanban = [...projectBoard];

      let tempDragCardContent = board?.cards[dragItemCard.current.cardIndex]; // picked up card content

      let removeItemBoardIndex = tempKanban?.findIndex(
        (data) => data.name === dragItemCard.current.board?.name
      );

      let addItemBoardIndex = tempKanban?.findIndex(
        (data) => data.name === dragOverItemCard.current.board?.name
      );

      let removeBoardCards = [...tempKanban[removeItemBoardIndex]?.cards];

      removeBoardCards?.splice(dragItemCard.current.cardIndex, 1);

      let addBoardCards = [
        ...(tempKanban[addItemBoardIndex]?.cards
          ? tempKanban[addItemBoardIndex]?.cards
          : []),
      ];

      addBoardCards.splice(
        dragOverItemCard.current.cardIndex,
        0,
        tempDragCardContent
      );

      tempKanban.splice(
        tempKanban?.findIndex(
          (data) => data.name === dragItemCard?.current?.board?.name
        ),
        1,
        {
          ...tempKanban[removeItemBoardIndex],
          cards: removeBoardCards,
        }
      );

      tempKanban.splice(
        tempKanban?.findIndex(
          (data) => data.name === dragOverItemCard?.current?.board?.name
        ),
        1,
        {
          ...tempKanban[addItemBoardIndex],
          cards: addBoardCards,
        }
      );

      let cardMovedBoardIndex = projectBoard?.findIndex(
        (data) => data.name === dragOverItemCard.current.board.name
      );

      dispatch(
        updateProjectCard({
          cardData: {
            key: tempDragCardContent.key,
            status: cardMovedBoardIndex + 1,
          },
          cardId: tempDragCardContent.id,
        })
      );

      dispatch(setProjectBoard({ value: tempKanban }));
    }
    // dragItemCard.current = null;
    // dragOverItemCard.current = null;
  };

  const openCardDetails = (card) => {
    dispatch(setOpenCardDetailsModal({ value: true }));
    dispatch(setSelectedCardDetails({ data: card }));
  };

  const handleVendor = (memberId) => (
    <div className="cardVendorPopoverBody">
      <p
        className="cardVendorPopoverBodyTextDelete"
        onClick={async (e) => {
          e.stopPropagation();
          dispatch(
            deleteCardMembers({
              data: {
                members: [memberId],
              },
              cardId: selectedCardDetails?.id,
            })
          );
          dispatch(getProjectBoardWithoutLoader({ projectId: projectId }));
          setPopoverState({
            cardIndex: -1,
            vendorIndex: -1,
            boardName: "",
          });
        }}
      >
        Remove From card {proposalMaker?.delete}
      </p>
    </div>
  );

  const handleCard = (memberId) => (
    <div className="cardDeletePopoverBody">
      <p
        className="cardDeleteopoverBodyTextDelete"
        onClick={async (e) => {
          e.stopPropagation();
          await dispatch(deleteProjectCard({ cardId: memberId }));
          // await dispatch(getProjectBoard({ projectId: projectId }));
          setDeletePopoverState({
            cardIndex: -1,
            boardName: "",
          });
        }}
      >
        Remove card {proposalMaker?.delete}
      </p>
    </div>
  );

  // useEffect(() => {
  //   dispatch(getProjectDetails({ projectId: params.projectId }));
  //   dispatch(getProjectBoard({ projectId: params.projectId }));
  // }, []);

  const getFilteredData = () => {
    if (!cardSearch) {
      return Array.isArray(projectBoard)
        ? projectBoard.map((data) => ({
            ...data,
            key: data?.id,
          }))
        : [];
    }

    return Array.isArray(projectBoard)
      ? projectBoard
          .map((data) => {
            return {
              ...data,
              key: data?.id,
              cards: Array.isArray(data.cards)
                ? data.cards.filter((card) => {
                    if (
                      card?.title
                        ?.toLowerCase()
                        ?.includes(cardSearch?.toLowerCase())
                    ) {
                      return card.title;
                    }
                  })
                : [],
            };
          })
          .filter(
            (record) => Array.isArray(record.cards) && record.cards.length > 0
          )
      : [];
  };

  return (
    <div className="kanbanMain">
      {getProjectBoardLoader ? (
        <div className="loaderStyles">
          <Spin size="large" />
        </div>
      ) : (
        <div className="kanbanWrapper">
          {getFilteredData()?.map((board, boardIndex) => {
            return (
              <div
                className="kanbanColumns"
                key={boardIndex}
                onDragEnter={(e) => {
                  if (
                    !(
                      dragItemCard?.current?.board?.name ===
                      dragOverItemCard?.current?.board?.name
                    )
                  ) {
                    dragEnterSection(board, board?.cards?.length);
                  } else {
                    dragEnterSection(board, 0);
                  }
                }}
                onDragEnd={(e) => {
                  dropSections(board);
                }}
                style={{
                  backgroundColor: "#F9F9F9",
                  borderTop: `4px solid ${colors[board?.name]?.borderColor}`,
                }}
              >
                <div className="kanbanColumnsHeader">
                  <p>{board?.name}</p>
                  <span>{Kanban.optionIcon}</span>
                </div>
                <div className="kanbanOverflowContainer">
                  {[...(board?.cards ? board?.cards : [])]
                    ?.sort((a, b) => a.key - b.key)
                    ?.map((card, cardIndex) => {
                      return (
                        <div
                          draggable
                          id={"card_" + cardIndex}
                          className={
                            "kanbanCards " +
                            (draggedCard?.cardIndex === cardIndex &&
                            draggedCard?.board?.name === board?.name
                              ? "cardPickedUp"
                              : "")
                          }
                          key={cardIndex}
                          onDragStart={(e) => {
                            dragStartSection(board, cardIndex);
                          }}
                          onDragEnter={(e) => {
                            e.stopPropagation();
                            dragEnterSection(board, cardIndex);
                          }}
                          onDragEnd={(e) => {
                            e.stopPropagation();
                            dropSections(board);
                          }}
                          onClick={() =>
                            openCardDetails({
                              ...card,
                              status: board?.name,
                            })
                          }
                        >
                          <div className="kanbanCardText1">
                            <p>{card?.title}</p>
                            {/* {access?.vendor === 1 ? null : ( */}
                            <Popover
                              open={
                                deletePopoverState.cardIndex === cardIndex &&
                                deletePopoverState.boardName === board?.name
                              }
                              overlayClassName={`cardDeletePopoverContainer`}
                              content={() => handleCard(card?.id)}
                              onOpenChange={() => {
                                if (deletePopoverState.cardIndex === -1) {
                                  setDeletePopoverState({
                                    cardIndex: cardIndex,
                                    boardName: board?.name,
                                  });
                                } else {
                                  setDeletePopoverState({
                                    cardIndex: -1,
                                    boardName: "",
                                  });
                                }
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              placement="right"
                              trigger="click"
                            >
                              {Kanban?.optionVerticalIcons}
                            </Popover>
                            {/* )} */}
                          </div>
                          <div className="kanbanCardText2">
                            <p>
                              Due date:-{" "}
                              <span>
                                {moment(card?.dueDate).format("DD/MM/YYYY")}
                              </span>
                            </p>
                          </div>
                          <div className="kanbanCardIcons">
                            <Avatar.Group
                              className="avatar-group-container"
                              maxCount={2}
                              style={{
                                marginTop: 10,
                                marginLeft: 6,
                              }}
                            >
                              {card?.members?.map((member, index) => {
                                const initials = member?.name
                                  .split(" ")
                                  .map((word) => word?.[0]?.toUpperCase())
                                  .join("");
                                return (
                                  <Tooltip
                                    title={member?.name}
                                    placement="bottom"
                                  >
                                    <Popover
                                      open={
                                        popoverState.cardIndex === cardIndex &&
                                        popoverState.vendorIndex === index &&
                                        popoverState.boardName === board?.name
                                      }
                                      overlayClassName={`cardVendorPopoverContainer`}
                                      content={() => handleVendor(member?.id)}
                                      onOpenChange={() => {
                                        if (popoverState.cardIndex === -1) {
                                          setPopoverState({
                                            cardIndex: cardIndex,
                                            vendorIndex: index,
                                            boardName: board?.name,
                                          });
                                        } else {
                                          setPopoverState({
                                            cardIndex: -1,
                                            vendorIndex: -1,
                                            boardName: "",
                                          });
                                        }
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(
                                          setSelectedCardDetails({
                                            data: {
                                              ...card,
                                              status: board?.name,
                                            },
                                          })
                                        );
                                      }}
                                      title={
                                        <div
                                          className="cardVendorPopover"
                                          style={{
                                            background: "var(--color-selected)",
                                          }}
                                        >
                                          <Avatar
                                            className="cardVendorPopoverAvatar"
                                            style={{
                                              backgroundColor:
                                                "#" + member?.color,
                                              color: "white",
                                              border: "1px solid white",
                                            }}
                                          >
                                            {initials}
                                          </Avatar>

                                          <div
                                            style={{
                                              color: "white",
                                            }}
                                            className="cardVendorPopoverNameEmail"
                                          >
                                            <p className="cardVendorPopoverName">
                                              {member?.name}
                                            </p>
                                            <p className="cardVendorPopoverEmail">
                                              {member?.email}
                                            </p>
                                          </div>
                                        </div>
                                      }
                                      placement="rightBottom"
                                      trigger="click"
                                    >
                                      <Avatar
                                        style={{
                                          backgroundColor: "#" + member?.color,
                                          color: "white",
                                          textShadow:
                                            "0px 0px 2px rgba(0, 0, 0, 0.3)",
                                        }}
                                      >
                                        {initials}
                                      </Avatar>
                                    </Popover>
                                  </Tooltip>
                                );
                              })}
                            </Avatar.Group>

                            <span
                              className={
                                "priorityColor" +
                                priorityOptions
                                  ?.find(
                                    (color) => color?.value === card?.priority
                                  )
                                  ?.label?.replaceAll(" ", "")
                              }
                            >
                              {projectIcons.flagIcon}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div
                  onClick={async (e) => {
                    // if (access?.vendor !== 1) {
                    await dispatch(
                      setUpdateCreateProject({
                        data: { status: boardIndex + 1 },
                      })
                    );
                    await dispatch(setOpenCreateCardDrawer({ value: true }));
                    // }
                  }}
                  className={
                    // access?.vendor === 1
                    //   ? "kanbanColumnsFooter opacityDisabled"
                    "kanbanColumnsFooter"
                  }
                >
                  <span className="kanbanColumnsFooterIcon">
                    <PlusOutlined />
                  </span>
                  <p className="kanbanColumnsFooterTitle">Add a card</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default KanbanContent;
