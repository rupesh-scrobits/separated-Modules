import React, { useState } from "react";
import {
  Col,
  Row,
  Select,
  DatePicker,
  Modal,
  Avatar,
  Popover,
  Input,
  Tooltip,
  Checkbox,
  List,
} from "antd";
import { PlusOutlined, PlusCircleOutlined } from "@ant-design/icons";
import "../../styles/components-style/Kanban.css";
import styles from "../../styles/components-style/VendorDrawer.module.css";
import formstyle from "../../styles/components-style/projectDetails.module.css";
import editstyle from "../../styles/components-style/CardDetails.module.css";
import drawerStyles from "../../styles/components-style/CreateDrawer.module.css";
import TextArea from "antd/es/input/TextArea";
import {
  passwordIcons,
  projectIcons,
  tableIcons,
  todoIcons,
  vendorIcons,
} from "../../utilities/icons/Icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
// import Activity from './Activity';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  setDeleteAttachmentModal,
  createTodo,
  setOpenCardDetailsModal,
  setSelectedCardUpdateDetails,
  setProjectBoard,
  setTodoData,
  setDeleteTodoModal,
  updateProjectCard,
  updateCardMembers,
} from "../../redux/features/projectSlices/ProjectManagementSlice";
import Attach from "./createProjectDrawer/AttachFile";
import { priorityOptions } from "../../utilities/commonFunctions/tableOptions";
import DeleteAttachment from "./DeleteAttachment";
import DeleteTodo from "./DeleteTodo";
import { getProjectBoardName } from "../../utilities/commonFunctions/commonComponents";
dayjs.extend(customParseFormat);
import moment from "moment";
import { useLocation } from "react-router-dom";

const CardDetails = () => {
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(4);
  const [todoInput, setTodoInput] = useState(false);
  const [popoverStates, setPopoverStates] = useState(-1);
  const [showAllAttachments, setShowAllAttachments] = useState(false);
  const { projectBoard, selectedCardDetails, cardDetailsModal, todoData } =
    useSelector((state) => state.feature.ProjectSlice);

  const { allVendors } = useSelector((state) => state.feature.VendorSlice);
  // const access = getJwtBody(sessionStorage.getItem("token"));
  const [filteredMembers, setFilteredMembers] = useState(null);
  const projectId = useLocation().pathname?.includes("project")
    ? useLocation()?.pathname?.split("/")[
        useLocation().pathname?.split("/")?.length - 1
      ]
    : "";

  const onClose = () => {
    setTodoInput(false);
    dispatch(setTodoData({ type: "remove" }));
    dispatch(setOpenCardDetailsModal({ value: false }));
  };

  const onBlur = (e) => {
    dispatch(
      updateProjectCard({
        cardData: {
          [e.target.name]: selectedCardDetails[e.target.name],
        },
        cardId: selectedCardDetails?.id,
      })
    );

    let projBoardArr = [...projectBoard];
    let selectedProjectBoard = projectBoard.find(
      (data) =>
        data.name === getProjectBoardName(projectBoard, selectedCardDetails)
    );
    let updatedCarsArr = [...selectedProjectBoard.cards];
    updatedCarsArr.splice(
      selectedProjectBoard?.cards?.findIndex(
        (data) => data.id === selectedCardDetails?.id
      ),
      1,
      {
        ...selectedCardDetails,
        [e.target.name]: selectedCardDetails[e.target.name],
      }
    );
    projBoardArr.splice(projBoardArr.indexOf(selectedProjectBoard), 1, {
      ...selectedProjectBoard,
      cards: updatedCarsArr,
    });
    dispatch(
      setProjectBoard({
        value: [...projBoardArr],
      })
    );
  };
  const handleVendor = async (vendorId, vendorName) => {
    const selectedMemberIds = selectedCardDetails?.members?.map((x) => ({
      id: x?.id,
      name: x?.name,
    }));
    let updatedMembers = selectedMemberIds?.filter(
      (member) => member.id !== vendorId
    );
    const existingVendor = selectedMemberIds?.find(
      (member) => member.id === vendorId
    );
    if (!existingVendor) {
      if (!updatedMembers) {
        updatedMembers = [];
      }
      updatedMembers.push({ id: vendorId, name: vendorName });
    }
    dispatch(
      setSelectedCardUpdateDetails({
        ...selectedCardDetails,
        members: updatedMembers,
      })
    );

    //below code for vendor member updatation

    // if (selectedMemberIds?.some((member) => member.id === vendorId)) {
    //   await dispatch(
    //     deleteCardMembers({
    //       data: {
    //         members: [vendorId],
    //       },
    //       cardId: selectedCardDetails?.id,
    //     })
    //   );
    // } else {
    //   await dispatch(
    //     updateCardMembers({
    //       data: {
    //         members: [vendorId],
    //       },
    //       cardId: selectedCardDetails?.id,
    //     })
    //   );
    // }
    // await dispatch(getProjectBoardWithoutLoader({ projectId: projectId }));
  };

  const handleChanges = (e) => {
    dispatch(
      setSelectedCardUpdateDetails({
        ...selectedCardDetails,
        [e.target.name]: e.target.value,
      })
    );
  };

  const handleTodoInput = (e, index, state, priority) => {
    const { todos, id } = selectedCardDetails;

    const updatedTodos = todos.map((todo, i) =>
      i === index
        ? {
            ...todo,
            [e.target.id]:
              e.target.id === "priority" ? priority : e.target.value,
          }
        : todo
    );

    dispatch(
      setSelectedCardUpdateDetails({
        ...selectedCardDetails,
        todos: updatedTodos,
      })
    );

    const updatedProjectBoard = projectBoard.map((board) => {
      if (
        board.name === getProjectBoardName(projectBoard, selectedCardDetails)
      ) {
        const updatedCards = board.cards.map((card) =>
          card.id === id ? { ...card, todos: updatedTodos } : card
        );
        return { ...board, cards: updatedCards };
      }
      return board;
    });
    dispatch(setProjectBoard({ value: updatedProjectBoard }));
  };

  const addNewTodo = (data, index, state) => {
    if (state === "edit") {
      dispatch(
        updateTodo({
          todoData: {
            title: data?.title,
            dueDate: moment(data?.dueDate).format("YYYY-MM-DD HH:mm:ss.SSSSSS"),
            priority: data?.priority,
          },
          todoId: data?.id,
        })
      );
    } else {
      dispatch(
        createTodo({
          id: data?.id,
          title: data?.title,
          dueDate: moment(data?.dueDate).format("YYYY-MM-DD HH:mm:ss.SSSSSS"),
          priority: data?.priority,
        })
      );

      // Update the todos in selectedCardDetails
      let tempTodos = [...selectedCardDetails.todos];
      tempTodos.splice(index, 0, {
        id: data?.id,
        title: data?.title,
        dueDate: moment(data?.dueDate).format("YYYY-MM-DD HH:mm:ss.SSSSSS"),
        priority: data?.priority,
      });
      dispatch(
        setSelectedCardUpdateDetails({
          ...selectedCardDetails,
          todos: [...tempTodos],
        })
      );

      const updatedProjectBoard = projectBoard.map((board) => {
        if (
          board.name === getProjectBoardName(projectBoard, selectedCardDetails)
        ) {
          const updatedCards = board.cards.map((card) =>
            card.id === data?.id ? { ...card, todos: [...tempTodos] } : card
          );
          return { ...board, cards: updatedCards };
        }
        return board;
      });
      dispatch(setProjectBoard({ value: updatedProjectBoard }));
    }
    dispatch(setTodoData({ type: "remove" }));
    setTodoInput(false);
  };

  const handleTodoStatus = (todo, index) => {
    let tempTodos = [...selectedCardDetails.todos];
    tempTodos.splice(index, 1, {
      ...tempTodos[index],
      complete: todo?.complete === 1 ? 0 : 1,
    });
    dispatch(
      updateTodo({
        todoData: tempTodos?.[0],
        todoId: tempTodos?.[0]?.id,
      })
    );
    dispatch(
      setSelectedCardUpdateDetails({
        ...selectedCardDetails,
        todos: [...tempTodos],
      })
    );
    const updatedProjectBoard = projectBoard.map((board) => {
      if (
        board.name === getProjectBoardName(projectBoard, selectedCardDetails)
      ) {
        const updatedCards = board.cards.map((card) =>
          card.id === selectedCardDetails?.id
            ? { ...card, todos: tempTodos }
            : card
        );
        return { ...board, cards: updatedCards };
      }
      return board;
    });
    dispatch(setProjectBoard({ value: updatedProjectBoard }));
  };

  const showMore = () => {
    if (current === 4) {
      setCurrent(selectedCardDetails?.attachments?.length);
    } else {
      setCurrent(4);
    }
    setShowAllAttachments(!showAllAttachments);
  };

  const deleteAttachment = (attachmentId) => {
    dispatch(
      setDeleteAttachmentModal({
        value: true,
        attachmentId: attachmentId,
      })
    );
  };

  const handleDeleteTodo = (e, todoId) => {
    e.stopPropagation();
    dispatch(
      setDeleteTodoModal({
        value: true,
        todoId: todoId,
      })
    );
  };

  const content = (
    <div>
      {priorityOptions.map((option) => (
        <div
          key={option.value}
          onClick={() =>
            dispatch(
              setTodoData({
                ...todoData,
                modalOpen: !todoData?.modalOpen,
                priority: option?.value,
                flag: option?.label,
              })
            )
          }
          className={styles.priorityOption}
        >
          {option.label}

          <span className={`priorityColor${option?.label.replace(/\s+/g, "")}`}>
            {projectIcons.flagIcon}
          </span>
        </div>
      ))}
    </div>
  );

  const editContent = (todoItem, index) => (
    <div>
      {priorityOptions.map((option) => (
        <div
          id="priority"
          key={option.value}
          onClick={async (e) => {
            await handleTodoInput(e, index, "edit", option.value);
            setPopoverStates(-1);
            addNewTodo({ ...todoItem, priority: option.value }, index, "edit");
          }}
          className={styles.priorityOption} // Make sure `styles` is defined
        >
          {option.label}

          <span className={`priorityColor${option?.label.replace(/\s+/g, "")}`}>
            {projectIcons.flagIcon}
          </span>
        </div>
      ))}
    </div>
  );
  const handleVendorSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = allVendors?.result?.filter(
      (vendor) =>
        vendor?.firstName.toLowerCase().includes(searchTerm) ||
        vendor?.lastName.toLowerCase().includes(searchTerm)
    );
    setFilteredMembers(filtered);
  };

  const handleAddRemoveVendor = (
    <div className="cardDetailsPopoverContainer">
      <div className="cardDetailsSearch">
        <Input placeholder="Search Vendors" onChange={handleVendorSearch} />
      </div>
      <div className="cardDetailsBoardMembers">
        <p className="cardDetailsBoardMembersText">Board Members</p>
        <List
          itemLayout="horizontal"
          dataSource={filteredMembers ? filteredMembers : allVendors?.result}
          renderItem={(vendor, index) => {
            const fullName = `${vendor?.firstName} ${vendor?.lastName}`;
            const initials = fullName
              .split(" ")
              .map((word) => word?.[0]?.toUpperCase())
              .join("");
            const isMemberSelected = selectedCardDetails?.members?.some(
              (member) => member?.id === vendor?.id
            );

            return (
              <List.Item onClick={() => handleVendor(vendor?.id, fullName)}>
                <List.Item.Meta
                  avatar={
                    <Tooltip
                      title={`${vendor?.firstName} ${vendor?.lastName}`}
                      placement="bottom"
                      key={index}
                    >
                      <Avatar
                        style={{
                          backgroundColor: "#" + vendor?.color,
                        }}
                      >
                        <div>{initials}</div>
                      </Avatar>
                    </Tooltip>
                  }
                  title={`${vendor?.firstName} ${vendor?.lastName}`}
                />
                {isMemberSelected && vendorIcons?.vendorCheck}
              </List.Item>
            );
          }}
        />
      </div>
    </div>
  );

  return (
    <>
      <Modal
        centered
        footer={null}
        title={
          <div className={editstyle.modalTitle}>
            <p className={editstyle.modalText}>
              {getProjectBoardName(projectBoard, selectedCardDetails)}
            </p>
          </div>
        }
        open={cardDetailsModal}
        onCancel={onClose}
        width={900}
        style={{
          top: 0,
        }}
        className="cardDetailsModalStyle"
      >
        <div className={formstyle.mainContent}>
          <Row>
            <Col span={16}>
              <div className={editstyle.projectDetailA}>
                <h1>{selectedCardDetails?.title}</h1>
                <div>
                  <div className={`${drawerStyles.contactFieldsTextarea}`}>
                    <label className={editstyle.formLabel}>Description</label>
                    <TextArea
                      style={{ marginBottom: "20px" }}
                      autoSize={{
                        minRows: 3,
                        maxRows: 5,
                      }}
                      placeholder="Enter description"
                      value={selectedCardDetails?.description}
                      name="description"
                      onBlur={onBlur}
                      onChange={handleChanges}
                    />
                  </div>

                  <Row gutter={16} className={drawerStyles.contactInfoFields}>
                    <Col span={12}>
                      <div className={`${drawerStyles.contactFieldsInput}`}>
                        <DatePicker
                          className={formstyle.projectDate}
                          name="dueDate"
                          format={"DD-MM-YYYY"}
                          defaultValue={moment(selectedCardDetails?.dueDate)}
                          onChange={(e) => {
                            handleChanges({
                              target: {
                                value: moment(e),
                                name: "dueDate",
                              },
                            });
                          }}
                          onBlur={(e) => {
                            onBlur({
                              target: {
                                value: moment(e).toISOString(),
                                name: "dueDate",
                              },
                            });
                          }}
                        />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className={`${drawerStyles.contactFieldsInput}`}>
                        <Select
                          className="selectContactCreateDrawer"
                          defaultValue="high"
                          value={selectedCardDetails?.priority}
                          options={priorityOptions}
                          name="priority"
                          onChange={(e) =>
                            handleChanges({
                              target: { value: e, name: "priority" },
                            })
                          }
                          onBlur={(e) =>
                            onBlur({
                              target: { value: e, name: "priority" },
                            })
                          }
                        />
                      </div>
                    </Col>
                  </Row>
                  {/* -------------------------avatar-------------------- */}
                  <div className={`${editstyle.vendorContainer}`}>
                    <Avatar.Group
                      className="avatar-group-container"
                      maxCount={2}
                    >
                      {selectedCardDetails?.members?.map((member, index) => {
                        const initials = member?.name
                          .split(" ")
                          .map((word) => word?.[0]?.toUpperCase())
                          .join("");
                        return (
                          <Tooltip title={member?.name} placement="bottom">
                            <Avatar
                              style={{
                                backgroundColor: "#" + member?.color,
                              }}
                            >
                              {initials}
                            </Avatar>
                          </Tooltip>
                        );
                      })}
                    </Avatar.Group>
                    {/* {access?.vendor === 1 ? null : ( */}
                    <Popover
                      overlayClassName={`cardDetailsAddRemoveVendorPopover`}
                      content={handleAddRemoveVendor}
                      title="Vendors"
                      placement="right"
                      trigger="click"
                    >
                      <Avatar
                        icon={<PlusCircleOutlined />}
                        className={`${editstyle.vendorPlus}`}
                      />
                    </Popover>
                    {/* )} */}
                  </div>
                  {/* ----------------------------todo--------------------------- */}
                  <div>
                    <label className={`${editstyle.formLabel}`}>To Do</label>
                    {selectedCardDetails?.todos?.map((todoItem, index) => (
                      <div style={{ display: "flex" }}>
                        <Checkbox
                          style={{
                            display: "flex",
                            marginTop: "0.5rem",
                          }}
                          className={editstyle.checkboxStyle}
                          checked={todoItem.complete}
                          onChange={() => handleTodoStatus(todoItem, index)}
                        ></Checkbox>
                        <Input
                          key={index}
                          id="title"
                          className={`${styles.formInput} ${formstyle.todoInput2} todoInput2`}
                          onChange={(event) => {
                            handleTodoInput(event, index, "edit");
                          }}
                          onBlur={() => addNewTodo(todoItem, index, "edit")}
                          value={todoItem?.title}
                          suffix={
                            <div className={formstyle.todoIconStyle}>
                              <span>
                                <input
                                  type="date"
                                  id="dueDate"
                                  value={
                                    todoItem?.dueDate
                                      ? moment(todoItem?.dueDate).format(
                                          "YYYY-MM-DD"
                                        )
                                      : null
                                  }
                                  onBlur={() => {
                                    addNewTodo(todoItem, index, "edit");
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleTodoInput(e, index, "edit");
                                  }}
                                  className={formstyle.todoFormDate}
                                />
                              </span>
                              <Popover
                                open={popoverStates === index}
                                content={() => editContent(todoItem, index)}
                                onOpenChange={() => {
                                  if (popoverStates === -1) {
                                    setPopoverStates(index);
                                  } else {
                                    setPopoverStates(-1);
                                  }
                                }}
                                title="Priority"
                                trigger="click"
                                className="popover-content"
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                  className={`priorityColor${
                                    todoItem?.priority === 1
                                      ? "Low"
                                      : todoItem?.priority === 2
                                      ? "Average"
                                      : todoItem?.priority === 3
                                      ? "High"
                                      : todoItem?.priority === 4
                                      ? "VeryHigh"
                                      : null
                                  }`}
                                >
                                  {projectIcons?.flagIcon}
                                </span>
                              </Popover>

                              {/* <span>{todoIcons.correct}</span> */}
                              <span
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  handleDeleteTodo(e, todoItem?.id);
                                }}
                              >
                                {tableIcons.delete}
                              </span>
                            </div>
                          }
                        />
                        {/* </Checkbox> */}
                      </div>
                    ))}
                    <div className={editstyle.checkboxMain}>
                      {todoInput && (
                        <Input
                          onChange={(event) => {
                            dispatch(
                              setTodoData({
                                ...todoData,
                                title: event.target.value,
                              })
                            );
                          }}
                          value={todoData?.title}
                          className={`${styles.formInput} ${formstyle.todoInput} todoInput`}
                          placeholder="Name"
                          suffix={
                            <div className={formstyle.todoIconStyle}>
                              <span>
                                <input
                                  type="date"
                                  value={
                                    todoData?.dueDate
                                      ? moment(todoData?.dueDate).format(
                                          "YYYY-MM-DD"
                                        )
                                      : null
                                  }
                                  onChange={(event) =>
                                    dispatch(
                                      setTodoData({
                                        ...todoData,
                                        dueDate: event.target.value,
                                      })
                                    )
                                  }
                                  className={formstyle.todoFormDate}
                                />
                              </span>
                              <Popover
                                open={todoData?.modalOpen == true}
                                content={content}
                                title="Priority"
                                onOpenChange={() => {
                                  if (popoverStates === false) {
                                    dispatch(
                                      setTodoData({
                                        ...todoData,
                                        modalOpen: !todoData?.modalOpen,
                                      })
                                    );
                                  } else {
                                    dispatch(
                                      setTodoData({
                                        ...todoData,
                                        modalOpen: !todoData?.modalOpen,
                                      })
                                    );
                                  }
                                }}
                                trigger="click"
                              >
                                <span
                                  onClick={() =>
                                    dispatch(
                                      setTodoData({
                                        ...todoData,
                                        modalOpen: !todoData?.modalOpen,
                                      })
                                    )
                                  }
                                  className={
                                    todoData?.flag
                                      ? "priorityColor" + todoData?.flag
                                      : "priorityColorLow"
                                  }
                                >
                                  {projectIcons.flagIcon}
                                </span>
                              </Popover>
                              <span
                                onClick={() => {
                                  if (todoData?.title && todoData?.dueDate) {
                                    addNewTodo(
                                      {
                                        ...todoData,
                                        id: selectedCardDetails?.id,
                                      },
                                      selectedCardDetails?.todos?.length,
                                      "add"
                                    );
                                  }
                                }}
                              >
                                {todoIcons.correct}
                              </span>
                              <span
                                onClick={() => {
                                  setTodoInput(false);
                                  dispatch(setTodoData({ type: "remove" }));
                                }}
                              >
                                {todoIcons.close}
                              </span>
                            </div>
                          }
                        />
                      )}
                      <div
                        className={editstyle.subTask}
                        onClick={() => setTodoInput(true)}
                      >
                        <p>
                          <span>{<PlusOutlined />} </span>
                          New Subtask
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedCardDetails?.attachments && (
                    <div className={formstyle.projectAttachment}>
                      <p>Attachments:-</p>
                      <div className={formstyle.projectAttachmentMain}>
                        {selectedCardDetails?.attachments
                          ?.slice(0, showAllAttachments ? undefined : current)
                          ?.map((attachment, index) => {
                            return (
                              <div className={formstyle.projectAttachContent}>
                                <div
                                  className={formstyle.projectAttachContentImg}
                                >
                                  {attachment?.link?.includes("youtu") ? (
                                    <div>{projectIcons.youtube}</div>
                                  ) : (
                                    <div>{projectIcons.attachIcon}</div>
                                  )}
                                </div>
                                <div
                                  className={formstyle.projectAttachContentText}
                                >
                                  <h3>
                                    {attachment.name}
                                    <span
                                      className={formstyle.icon}
                                      onClick={() =>
                                        deleteAttachment(attachment?.id)
                                      }
                                    >
                                      {tableIcons.delete}
                                    </span>
                                  </h3>
                                  {/* { console.log( attachment ) } */}
                                  <a href={attachment.link} target="_blank">
                                    {attachment.link?.length >= 45
                                      ? attachment.link?.slice(0, 45) + "..."
                                      : attachment.link}
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        <button
                          onClick={showMore}
                          className={formstyle.attachBtn}
                        >
                          {showAllAttachments ? "view less" : "view more"}
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedCardDetails?.referenceVideo &&
                    selectedCardDetails?.referenceVideo && (
                      <div className={formstyle.projectReference}>
                        <h4>
                          Reference Videos{" "}
                          <span style={{ cursor: "pointer" }}>
                            {projectIcons.editIcon}
                          </span>
                        </h4>
                        <div className={formstyle.projectReferenceContent}>
                          {selectedCardDetails?.referenceVideo?.includes(
                            "youtu"
                          ) ? (
                            <div>{projectIcons.youtube}</div>
                          ) : (
                            <div>{projectIcons.attachIcon}</div>
                          )}
                          <div
                            dangerouslySetInnerHTML={{
                              __html: projectDetails[0]?.referenceVideo,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className={formstyle.projectDetailB}>
                {/* <Activity /> */}
                <Attach from={"cardDetails"} />
                <DeleteAttachment from={"cardDetails"} />
                <DeleteTodo from={"cardDetails"} />
              </div>
              <div className={`${drawerStyles.contactFieldsTextarea}`}>
                <label className={editstyle.formLabel}>Comments</label>
                <TextArea
                  style={{ marginBottom: "20px" }}
                  autoSize={{
                    minRows: 6,
                  }}
                  value={selectedCardDetails?.comments}
                  placeholder="Enter comments"
                  name="comments"
                  onBlur={onBlur}
                  onChange={handleChanges}
                />
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default CardDetails;
