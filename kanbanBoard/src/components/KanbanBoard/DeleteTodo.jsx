import React from "react";
import styles from "../../styles/components-style/ModalStyles.module.css";
import { Button, Modal } from "antd";
import {
  setDeleteTodoModal,
  setProjectBoard,
  setSelectedCardUpdateDetails,
} from "../../redux/features/projectSlices/ProjectManagementSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getProjectBoardName } from "../../utilities/commonFunctions/commonComponents";

const DeleteTodo = (props) => {
  const dispatch = useDispatch();
  const {
    deleteTodoModal,
    deleteTodoLoader,
    deleteTodoId,
    projectBoard,
    selectedCardDetails,
  } = useSelector((state) => state.feature.ProjectSlice);

  const handleCancel = () => {
    dispatch(setDeleteTodoModal({ value: false }));
  };

  const handleOk = () => {
    if (props?.from === "cardDetails") {
      dispatch(deleteTodo(deleteTodoId));

      // Remove the deleted todo from selectedCardDetails
      const updatedTodos =
        selectedCardDetails.todos?.filter((todo) => todo.id !== deleteTodoId) ||
        [];
      dispatch(
        setSelectedCardUpdateDetails({
          ...selectedCardDetails,
          todos: updatedTodos,
        })
      );

      // Remove the deleted todo from projectBoard
      const updatedProjectBoard = projectBoard.map((board) => {
        if (
          board.name === getProjectBoardName(projectBoard, selectedCardDetails)
        ) {
          const updatedCards = (board.cards || []).map((card) => ({
            ...card,
            todos: card.todos?.filter((todo) => todo.id !== deleteTodoId) || [],
          }));
          return { ...board, cards: updatedCards };
        }
        return board;
      });
      dispatch(setProjectBoard({ value: updatedProjectBoard }));
    }
  };

  return (
    <div>
      <Modal
        open={deleteTodoModal}
        title="Delete"
        onCancel={handleCancel}
        maskClosable={false}
        footer={[
          <Button
            className={styles.deleteConfirmModalCancelBtn}
            key="back"
            onClick={handleCancel}
          >
            Cancel
          </Button>,
          <Button
            className={styles.deleteConfirmModalSubmitBtn}
            key="submit"
            type="primary"
            loading={deleteTodoLoader}
            onClick={handleOk}
          >
            Confirm
          </Button>,
        ]}
      >
        <h3>Are you sure you want to delete?</h3>
      </Modal>
    </div>
  );
};

export default DeleteTodo;
