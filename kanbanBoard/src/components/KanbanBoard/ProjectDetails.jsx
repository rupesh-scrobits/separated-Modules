import React, { useState } from "react";
import { Col, Form, Input, Row, Select, DatePicker, Modal, Upload } from "antd";
import styles from "../../styles/components-style/VendorDrawer.module.css";
import formstyle from "../../styles/components-style/projectDetails.module.css";
import drawerStyles from "../../styles/components-style/CreateDrawer.module.css";
import TextArea from "antd/es/input/TextArea";
import { projectIcons, tableIcons } from "../../utilities/icons/Icons";
import Activity from "./Activity";
import "../../styles/components-style/Kanban.css";
import Attach from "./createProjectDrawer/AttachFile";
import { useDispatch } from "react-redux";
import {
  setDeleteAttachmentModal,
  setUpdateProject,
} from "../../redux/features/projectSlices/ProjectManagementSlice";

import { useSelector } from "react-redux";
import { priorityOptions } from "../../utilities/commonFunctions/tableOptions";
import DeleteAttachment from "./DeleteAttachment";
import moment from "moment";

const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

const ProjectDetails = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  // const { projectId } = useParams();
  const [showAllAttachments, setShowAllAttachments] = useState(false);
  const [current, setCurrent] = useState(4);
  const { projectDetails } = useSelector((state) => state.feature.ProjectSlice);

  const showDrawer = () => {
    setOpen(true);
    // dispatch(getProjectDetails({ projectId: projectId }));
  };

  const onClose = () => {
    setOpen(false);
  };

  const onBlur = (e) => {
    // dispatch(
    //   updateProject({
    //     projectData: {
    //       [e.target.name]: projectDetails?.[0]?.[e.target.name],
    //     },
    //     projectId: projectDetails[0]?.id,
    //   })
    // );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setUpdateProject({ ...projectDetails[0], [name]: value }));
  };

  const changeDoc = (value) => {};

  const showMore = () => {
    if (current === 4) {
      setCurrent(projectDetails[0]?.attachment?.length);
    } else {
      setCurrent(4);
    }
    setShowAllAttachments(!showAllAttachments);
  };

  const deleteAttachment = (attachmengId) => {
    dispatch(
      setDeleteAttachmentModal({
        value: true,
        attachmentId: attachmengId,
      })
    );
  };

  return (
    <>
      <button
        className="projectDetails"
        onClick={showDrawer}
        style={{ marginLeft: 10 }}
      >
        Project Details
      </button>

      <Modal
        footer={null}
        title={<div className={formstyle.modalTitle}>Project Details</div>}
        open={open}
        onCancel={onClose}
        width={900}
        className="cardDetailsModalStyle"
      >
        <div className={formstyle.mainContent}>
          <Row>
            <Col span={16}>
              <div className={formstyle.projectDetailA}>
                <Form layout="vertical">
                  <div className={formstyle.projectImage}>
                    {projectDetails?.[0]?.thumbnail === null ? (
                      <Upload
                        action="/upload.do"
                        listType="picture-card"
                        className={`${formstyle.projectUpload} projectTumbnailUpload`}
                        onChange={changeDoc}
                      >
                        <div className={formstyle.projectUpload}>
                          Upload image
                        </div>
                      </Upload>
                    ) : (
                      <img
                        alt="project image"
                        src={projectDetails?.[0]?.thumbnail}
                      />
                    )}
                  </div>

                  <Form.Item>
                    <Input
                      defaultValue="Project name"
                      className={`${styles.formInput} ${formstyle.projectInput}`}
                      value={projectDetails && projectDetails[0]?.title}
                      name="title"
                      onBlur={onBlur}
                      onChange={handleChange}
                    />
                  </Form.Item>
                  <Form.Item>
                    <TextArea
                      autoSize={{
                        minRows: 3,
                        maxRows: 5,
                      }}
                      placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                      className={formstyle.projectDescription}
                      value={projectDetails && projectDetails[0]?.description}
                      name="description"
                      onBlur={onBlur}
                      onChange={handleChange}
                    />
                  </Form.Item>

                  <Row gutter={16} className={drawerStyles.contactInfoFields}>
                    <Col span={12}>
                      <Form.Item
                        className={`${drawerStyles.contactFieldsInput}`}
                      >
                        <DatePicker
                          className={formstyle.projectDate}
                          format={dateFormatList}
                          value={moment(
                            projectDetails?.[0]?.dueDate
                              ? projectDetails?.[0]?.dueDate
                              : new Date()
                          )}
                          onChange={(e) =>
                            handleChange({
                              target: { name: "dueDate", value: e },
                            })
                          }
                          onBlur={(e) =>
                            onBlur({
                              target: { name: "dueDate", value: e },
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        className={`${drawerStyles.contactFieldsInput}`}
                      >
                        <Select
                          className="selectContactCreateDrawer"
                          defaultValue="high"
                          name="priority"
                          options={priorityOptions}
                          onBlur={(e) =>
                            onBlur({
                              target: { name: "priority", value: e },
                            })
                          }
                          onChange={(e) =>
                            handleChange({
                              target: { name: "priority", value: e },
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  {projectDetails && projectDetails[0]?.attachment && (
                    <div className={formstyle.projectAttachment}>
                      <p>Attachments:-</p>
                      <div className={formstyle.projectAttachmentMain}>
                        {projectDetails[0]?.attachment
                          ?.slice(0, showAllAttachments ? undefined : current)
                          ?.map((attachments, index) => {
                            return (
                              <div className={formstyle.projectAttachContent}>
                                <div
                                  className={formstyle.projectAttachContentImg}
                                >
                                  {attachments.link.includes("youtu") ? (
                                    <div>{projectIcons.youtube}</div>
                                  ) : (
                                    <div>{projectIcons.attachIcon}</div>
                                  )}
                                </div>
                                <div
                                  className={formstyle.projectAttachContentText}
                                >
                                  <h3>
                                    {attachments.name}{" "}
                                    <span
                                      className={formstyle.icon}
                                      onClick={() =>
                                        deleteAttachment(attachments?.id)
                                      }
                                    >
                                      {tableIcons.delete}
                                    </span>
                                  </h3>
                                  <a href={attachments.link} target="_blank">
                                    {attachments.link?.length >= 45
                                      ? attachments.link?.slice(0, 45) + "..."
                                      : attachments.link}
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

                  {projectDetails && projectDetails[0]?.referenceVideo && (
                    <div className={formstyle.projectReference}>
                      <h4>
                        Reference Videos{" "}
                        <span style={{ cursor: "pointer" }}>
                          {projectIcons.editIcon}
                        </span>
                      </h4>
                      <div className={formstyle.projectReferenceContent}>
                        {projectDetails[0]?.referenceVideo?.includes(
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
                </Form>
              </div>
            </Col>
            <Col span={8}>
              <div className={formstyle.projectDetailB}>
                <Activity />
                <Attach from={"projectDetails"} />
                <DeleteAttachment />
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default ProjectDetails;
