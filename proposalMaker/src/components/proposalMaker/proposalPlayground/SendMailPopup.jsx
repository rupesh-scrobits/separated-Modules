import { Button, Input, Modal } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  genericProposalEdit,
  handleEmailDetailsChange
} from '../../../redux/features/ProposalMakerSlice';
import styles from '../../../styles/components-style/SendMailPopup.module.css';
import { ExportOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
const { TextArea } = Input;

const SendMailPopup = ({
  sendMail,
  openEmailSendModal,
  handleCancel
}) => {
  const dispatch = useDispatch();

  const { emailSendLoader } = useSelector(state => {
    return state.feature.ProposalMaker;
  });

  const handleChange = e => {
    dispatch(
      handleEmailDetailsChange({ [e.target.id]: e.target.value })
    );
  };

  return (
    <div>
      <Modal
        title="Enter Email Details"
        open={openEmailSendModal}
        onOk={() => {
          sendMail();
        }}
        confirmLoading={emailSendLoader}
        width={500}
        className={styles.sendMailPopup}
        okText={'Send Mail'}
        onCancel={handleCancel}
      >
        <div className={styles.sendEmailInputsWrapper}>
          <div className={styles.sendEmailInputGroup}>
            <label htmlFor="proposalName">Proposal Name</label>
            <Input
              placeholder="Enter Proposal Title"
              onChange={e => {
                dispatch(
                  genericProposalEdit({
                    proposalName: e.target.value
                  })
                );
              }}
              id="proposalName"
            />
          </div>
          <div className={styles.sendEmailInputGroup}>
            <label htmlFor="email">Send To</label>
            <Input
              placeholder="Enter email"
              onChange={handleChange}
              id="email"
            />
          </div>
          <div className={styles.sendEmailInputGroup}>
            <label htmlFor="subject">Enter Subject</label>
            <Input
              placeholder="Enter Subject"
              onChange={handleChange}
              id="subject"
            />
          </div>
          <div className={styles.sendEmailInputGroup}>
            <label htmlFor="body">Enter Body</label>
            <TextArea onChange={handleChange} id="body" rows={6} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SendMailPopup;
