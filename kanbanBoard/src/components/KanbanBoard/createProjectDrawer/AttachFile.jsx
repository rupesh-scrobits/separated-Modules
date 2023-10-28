import { Button, Col, Form, Input, Modal, Row, Upload } from 'antd';
import React, { useState } from 'react';
import styles from '../../../styles/components-style/VendorDrawer.module.css';
import formstyle from '../../../styles/components-style/ProjectDrawer.module.css';
import projectDetails from '../../../styles/components-style/projectDetails.module.css';
import drawerStyles from '../../../styles/components-style/CreateDrawer.module.css';
import {
  projectIcons,
  tableIcons
} from '../../../utilities/icons/Icons';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  createCardAttachment,
  createProjectAttachment,
  createRemoveProjectAttachment,
  setAllUploadedAttachmentFiles,
  setAttachmentModal,
  setProjectBoard,
  setSelectedCardUpdateDetails,
  setUploadedAttachmentFiles
} from '../../../redux/features/projectSlices/ProjectManagementSlice';
import { getProjectBoardName } from '../../../utilities/commonFunctions/commonComponents';
import { InboxOutlined } from '@ant-design/icons';
import { uploadFile } from '../../../services/uploadFile';

const Attach = props => {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const [current, setCurrent] = useState(4);
  const [showAllAttachments, setShowAllAttachments] =
    useState(false);
  const {
    selectedCardDetails,
    attachmentModal,
    projectBoard,
    attachments,
    uploadedAttachmentFiles,
    allUploadedAttachmentFiles
  } = useSelector(state => state.feature.ProjectSlice);

  const [form] = Form.useForm();
  const showModal = () => {
    dispatch(setAttachmentModal({ value: true }));
  };
  const handleOk = () => {
    dispatch(setAttachmentModal({ value: false }));
  };
  const handleCancel = () => {
    setUploadedAttachmentFiles([]);
    dispatch(setAttachmentModal({ value: false }));
  };

  const handlechange = () => {};

  const onFinish = async value => {
    const { fileList } = value;
    if (props?.from === 'cardDetails') {
      if (fileList && fileList.length > 0) {
        dispatch(setAttachmentModal({ value: false }));
        const updatedUploadAttachments = await Promise.all(
          fileList.map(async file => {
            const fileLink = await (await uploadFile(file)).data;
            return { name: file.name, link: fileLink.fileurl }; 
          })
        );
        
        dispatch(
          createCardAttachment({
            attachmentData: updatedUploadAttachments[0],
            cardId: selectedCardDetails?.id
          })
        );
        dispatch(setUploadedAttachmentFiles([]));
        form.resetFields();
        // Add the new attachment to selectedCardDetails
        const updatedAttachments = selectedCardDetails?.attachments
          ? [
              ...selectedCardDetails.attachments,
              updatedUploadAttachments[0]
            ]
          : [updatedUploadAttachments[0]];
        dispatch(
          setSelectedCardUpdateDetails({
            ...selectedCardDetails,
            attachments: updatedAttachments
          })
        );
        // Add the new attachment to projectBoard
        const updatedProjectBoard = projectBoard.map(board => {
          if (
            board.name ===
            getProjectBoardName(projectBoard, selectedCardDetails)
          ) {
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
          createCardAttachment({
            attachmentData: value,
            cardId: selectedCardDetails?.id
          })
        );
        // Add the new attachment to selectedCardDetails
        const updatedAttachments = selectedCardDetails?.attachments
          ? [...selectedCardDetails.attachments, value]
          : [value];
        dispatch(
          setSelectedCardUpdateDetails({
            ...selectedCardDetails,
            attachments: updatedAttachments
          })
        );
        // Add the new attachment to projectBoard
        const updatedProjectBoard = projectBoard.map(board => {
          if (
            board.name ===
            getProjectBoardName(projectBoard, selectedCardDetails)
          ) {
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
      }
    }
    if (props?.from === 'projectDetails') {
      if (fileList && fileList.length > 0) {
        const updatedUploadAttachments = await Promise.all(
          fileList.map(async file => {
            const fileLink = await (await uploadFile(file)).data; // Replace with your logic for uploading and obtaining the link

            return { name: file.name, link: fileLink.fileurl }; // Create a new object with 'link' property added
          })
        );
        dispatch(setAttachmentModal({ value: false }));
        dispatch(
          createProjectAttachment({
            attachmentData: updatedUploadAttachments[0],
            projectId: projectId
          })
        );
        dispatch(setUploadedAttachmentFiles([]));
      }
    } else if (
      props?.from === 'createProject' ||
      props?.from === 'createCard'
    ) {
      if (fileList) {
        fileList.map(file =>
          dispatch(
            createRemoveProjectAttachment({
              type: 'add',
              attachments: {
                name: file.name,
                type: 'device',
                link: ''
              }
            })
          )
        );
        dispatch(setUploadedAttachmentFiles([]));
      } else {
        dispatch(
          createRemoveProjectAttachment({
            type: 'add',
            attachments: {
              name: value.name,
              link: value.link
            }
          })
        );
      }
      form.resetFields();
    } else {
      dispatch(
        createProjectAttachment({
          attachmentData: value,
          projectId: projectId
        })
      );
    }
    dispatch(setAttachmentModal({ value: false }));
  };

  const showMore = () => {
    if (current === 4) {
      setCurrent(attachments?.length);
    } else {
      setCurrent(4);
    }
    setShowAllAttachments(!showAllAttachments);
  };

  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleBeforeUpload = file => {
    dispatch(
      setUploadedAttachmentFiles([...uploadedAttachmentFiles, file])
    );
    dispatch(
      setAllUploadedAttachmentFiles([
        ...allUploadedAttachmentFiles,
        file
      ])
    );
    onFinish({ fileList: [file] });
    // await dispatch(setAttachmentModal({ value: false }));
    return false; // Prevent automatic upload
  };

  const handleFileRemove = file => {
    const updatedFiles = uploadedAttachmentFiles.filter(
      item => item.uid !== file.uid
    );
    dispatch(setUploadedAttachmentFiles(updatedFiles));
  };

  return (
    <div>
      {attachments.length > 0 ? (
        <div className={projectDetails.projectAttachment}>
          <p>Attachments:-</p>
          <div className={projectDetails.projectAttachmentMain}>
            {attachments
              ?.slice(0, showAllAttachments ? undefined : current)
              ?.map((attachment, index) => {
                return (
                  <div
                    className={projectDetails.projectAttachContent}
                  >
                    <div
                      className={
                        projectDetails.projectAttachContentImg
                      }
                    >
                      {attachment?.link?.includes('youtu') ? (
                        <div>{projectIcons.youtube}</div>
                      ) : (
                        <div>{projectIcons.attachIcon}</div>
                      )}
                    </div>
                    <div
                      className={
                        projectDetails.projectAttachContentText
                      }
                    >
                      <h3>
                        {attachment.name}
                        <span
                          className={projectDetails.icon}
                          onClick={() => {
                            dispatch(
                              createRemoveProjectAttachment(index)
                            );
                          }}
                        >
                          {tableIcons.delete}
                        </span>
                      </h3>
                      <a href={attachment.link} target="_blank">
                        {attachment.link?.length >= 45
                          ? attachment.link?.slice(0, 45) + '...'
                          : attachment.link}
                      </a>
                    </div>
                  </div>
                );
              })}
            {attachments.length > 4 && (
              <div className={projectDetails.button}>
                <span
                  onClick={showMore}
                  className={projectDetails.attachBtn}
                >
                  {showAllAttachments ? 'view less' : 'view more'}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : null}
      <div className={formstyle.attachContent} onClick={showModal}>
        <p>{projectIcons.attachIcon}</p>
        <p> Attachment</p>
      </div>
      <Modal
        footer={null}
        title={<div></div>}
        open={attachmentModal}
        onOk={handleOk}
        onCancel={handleCancel}
        className="attachmentModal"
      >
        <div>
          <Form form={form} onFinish={onFinish}>
            <Row className={drawerStyles.contactInfoFields}>
              <Col sm={24}>
                <Form.Item
                  className={drawerStyles.contactFieldsInput}
                  name="link"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter link!'
                    }
                  ]}
                >
                  <Input
                    className={styles.formInput}
                    placeholder="Paste any link here...."
                    // value={''}
                    onChange={handlechange}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row className={drawerStyles.contactInfoFields}>
              <Col sm={24}>
                <Form.Item
                  className={drawerStyles.contactFieldsInput}
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter name!'
                    }
                  ]}
                >
                  <Input
                    className={styles.formInput}
                    placeholder="Link name"
                    // value={''}
                    onChange={handlechange}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row className={drawerStyles.contactInfoFields}>
              <Col sm={24}>
                <Form.Item className={formstyle.attachBtnWrapper}>
                  <Button
                    className={formstyle.attachBtn}
                    htmlType="submit"
                  >
                    Attach
                  </Button>
                </Form.Item>
              </Col>
            </Row>

            <p className={formstyle.orText}>OR</p>
            <Row className={drawerStyles.contactInfoFields}>
              <Col sm={24}>
                <Form.Item
                  label=""
                  name="fileList"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                >
                  <Upload.Dragger
                    beforeUpload={handleBeforeUpload}
                    fileList={uploadedAttachmentFiles}
                    maxCount={1}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag a file to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                      Support for a single upload.
                    </p>
                  </Upload.Dragger>
                  {null}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default Attach;
