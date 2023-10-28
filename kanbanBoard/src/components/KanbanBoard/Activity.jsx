import React, { useState } from "react";
import styles from "../../styles/components-style/Activity.module.css";
import { projectIcons } from "../../utilities/icons/Icons";
import { Input, Modal } from "antd";

const Activity = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={styles.projectActivity} onClick={showModal}>
        <p>
          <span>{projectIcons.activityIcon} </span> Activity
        </p>
      </div>
      <Modal
        className={`${styles.main} header`}
        title={<div className={styles.modalTitle}>Activity</div>}
        footer={null}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className={styles.modalContent}>
          <div className={styles.modalDiv}>
            <img src={"public/assets/activity1.png"} />
            <Input
              className={styles.activityInput}
              placeholder="write a comment"
            />
          </div>
          <div className={styles.modalDiv}>
            <img src={"public/assets/activity1.png"} />
            <div className={styles.modalText}>
              <h2>Jane Cooper</h2>
              <p>2 May 2023 at 11:24 AM</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
          <div className={styles.modalDiv}>
            <img src={"public/assets/activity2.png"} />
            <div className={styles.modalText}>
              <h2>Jane Cooper</h2>
              <p>2 May 2023 at 11:24 AM</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Activity;
