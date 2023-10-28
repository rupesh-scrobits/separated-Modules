import React, { useState } from "react";
import styles from "../../../styles/components-style/Attachment.module.css";
import formstyle from "../../../styles/components-style/ProjectDrawer.module.css";
import { projectIcons } from "../../../utilities/icons/Icons";
import { Button, Form, Input, Modal, Upload } from "antd";

const Attachment = () => {
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

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  return (
    <>
      <div className={styles.projectAttachText} onClick={showModal}>
        <p>
          <span>{projectIcons.attachIcon} </span> Attachment
        </p>
      </div>
      <Modal
        className={styles.main}
        title={<div className={styles.modalTitle}>Add Attachment</div>}
        footer={null}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <Form.Item>
            <Input
              className={styles.formInput}
              placeholder="Paste any link here...."
            />
          </Form.Item>
          <Form.Item>
            <Input className={styles.formInput} placeholder="Link name" />
          </Form.Item>
          <Form.Item>
            <Button className={formstyle.attachBtn}>Attach</Button>
          </Form.Item>
          <p className={formstyle.orText}>OR</p>
          <Form.Item
            label=""
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              action="/upload.do"
              listType="picture-card"
              className={`${formstyle.projectUpload} ${formstyle.attachUpload}`}
            >
              <div
                style={{
                  marginTop: 8,
                  color: "#00BBCC",
                }}
              >
                Attach from device
              </div>
            </Upload>
          </Form.Item>
        </div>
      </Modal>
    </>
  );
};

export default Attachment;
