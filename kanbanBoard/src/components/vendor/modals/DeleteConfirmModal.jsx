import React from 'react';
import {
  setOpenDeleteModal,
  setRecordToDelete,
  setSelectedRow,
} from '../../../redux/features/projectSlices/VendorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, notification } from 'antd';
import styles from '../../../styles/components-style/ModalStyles.module.css';

const DeleteConfirmModal = props => {
  const dispatch = useDispatch();
  const {
    openDeleteModal,
    deleteVendorLoader,
    recordToDelete,
    selectRow
  } = useSelector(state => state.feature.VendorSlice);

  const handleOk = async () => {
    if (props?.from === 'allVendors') {
      await dispatch(
        deleteMultipleVendors({
          vendorId: selectRow?.map(x => x?.id)
        })
      );
      await dispatch(getVendor({ from: 0, count: 10000 }));
      notification.destroy();
    } else {
      await dispatch(deleteVendor({ vendorId: recordToDelete.id }));
      await dispatch(getVendor({ from: 0, count: 10000 }));
    }
  };

  const handleCancel = () => {
    dispatch(setOpenDeleteModal({ value: false }));
    dispatch(setRecordToDelete({ record: {} }));
    dispatch(setSelectedRow({ selectedRowKeys: [] }));
  };

  return (
    <div>
      <Modal
        open={openDeleteModal}
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
            loading={deleteVendorLoader}
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

export default DeleteConfirmModal;
