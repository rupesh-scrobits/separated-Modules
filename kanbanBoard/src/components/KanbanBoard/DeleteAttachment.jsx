import React from 'react';
import styles from '../../styles/components-style/ModalStyles.module.css';
import { Button, Modal } from 'antd';
import {
  deleteCardAttachment,
  deleteProjectAttachment,
  setDeleteAttachmentModal,
  setProjectBoard,
  setSelectedCardDetails
} from '../../redux/features/projectSlices/ProjectManagementSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getProjectBoardName } from '../../utilities/commonFunctions/commonComponents';

const DeleteAttachment = props => {
  const dispatch = useDispatch();
  const {
    deleteAttachmentModal,
    deleteAttachmentLoader,
    deleteAttachmentId,
    selectedCardDetails,
    projectBoard
  } = useSelector(state => state.feature.ProjectSlice);

  const handleCancel = () => {
    dispatch(setDeleteAttachmentModal({ value: false }));
  };

  const handleOk = () => {
    if (props?.from === 'cardDetails') {
      dispatch(
        deleteCardAttachment({ attachmentId: deleteAttachmentId })
      );

      // Remove the deleted attachment from selectedCardDetails
      const updatedAttachments =
        selectedCardDetails?.attachments?.filter(
          data => data.id !== deleteAttachmentId
        );

      dispatch(
        setSelectedCardDetails({
          data: {
            ...selectedCardDetails,
            attachments: updatedAttachments
          }
        })
      );

      // Remove the deleted attachment from projectBoard
      const updatedProjectBoard = projectBoard.map(board => {
        if (board.name === getProjectBoardName( projectBoard, selectedCardDetails)) {
          const updatedCards = board.cards.map(card =>
            card.id === selectedCardDetails?.id
              ? { ...card, attachments: updatedAttachments }
              : card
          );
          return { ...board, cards: updatedCards };
        }
        return board;
      });
      dispatch(setProjectBoard({ value: updatedProjectBoard }));
    } else {
      dispatch(
        deleteProjectAttachment({ attachmentId: deleteAttachmentId })
      );
    }
  };

  return (
    <div>
      <Modal
        open={deleteAttachmentModal}
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
            loading={deleteAttachmentLoader}
            onClick={handleOk}
          >
            Confirm
          </Button>
        ]}
      >
        <h3>Are you sure you want to delete?</h3>
      </Modal>
    </div>
  );
};

export default DeleteAttachment;
