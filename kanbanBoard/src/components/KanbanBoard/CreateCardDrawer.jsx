import { Button, Drawer, Form, notification } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterIcons } from "../../utilities/icons/Icons";
import styles from "../../styles/components-style/CreateUserDrawer.module.css";
import useScreenSize from "../../utilities/commonFunctions/ScreenSize";
import {
  UploadImageLoader,
  createProjectCard,
  createRemoveProjectAttachment,
  setAllTodoData,
  setOpenCreateCardDrawer,
  setTodoData,
  setUpdateCreateProject,
} from "../../redux/features/projectSlices/ProjectManagementSlice";
import CreateCard from "./CreateCard";
import { useParams } from "react-router-dom";
import { uploadFile } from "../../services/uploadFile";
import { setSelectedRow } from "../../redux/features/projectSlices/VendorSlice";

const CreateCardDrawer = () => {
  const screenSize = useScreenSize();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const {
    openCreateCardDrawer,
    createProjectData,
    allTodoData,
    createProjectCardLoader,
    attachments,
    allUploadedAttachmentFiles,
  } = useSelector((state) => {
    return state.feature.ProjectSlice;
  });

  const { selectRow } = useSelector((state) => state.feature.VendorSlice);

  const { projectId } = useParams();

  const extractTodoData = (allTodoData) => {
    return allTodoData.map(({ dueDate, priority, title }) => ({
      dueDate,
      priority,
      title,
    }));
  };

  const updateAttachments = async (values, memberId) => {
    const filteredUploadAttachments = attachments.filter(
      (attachment) => attachment.type === "device"
    );
    const filteredLinkAttachments = attachments.filter(
      (attachment) => attachment.type != "device"
    );
    const updatedUploadAttachments = await Promise.all(
      filteredUploadAttachments.map(async (attachment) => {
        const matchingFile = allUploadedAttachmentFiles.find(
          (file) => file.name === attachment.name
        );
        if (matchingFile) {
          dispatch(UploadImageLoader(true));
          const fileLink = await (await uploadFile(matchingFile)).data; // Replace with your logic
          return { ...attachment, link: fileLink?.fileurl }; // Create a new object with 'link' property added
        }
        return attachment; // Return the existing object if no match
      })
    );

    // Combine the updated 'updatedUploadAttachments' with 'filteredLinkAttachments'
    const combinedAttachments = [
      ...updatedUploadAttachments,
      ...filteredLinkAttachments,
    ];

    await dispatch(
      createProjectCard({
        cardData: {
          ...values,
          status: parseInt(values?.status),
          priority: parseInt(values?.priority),
          dueDate: new Date(values?.dueDate).toISOString(),
          startDate: new Date(values?.startDate).toISOString(),
          member: memberId ? memberId : [],
          attachment: combinedAttachments,
          todos: extractTodoData(allTodoData),
        },
        projectId: projectId,
        // boardName: parseInt(values?.status),
      })
    );
    // await dispatch(getProjectBoard({ projectId: projectId }));
    await onClose();

    // Now 'combinedAttachments' contains the merged and updated array
  };

  const onFinish = async (values) => {
    const startDate = new Date(values?.startDate);
    const endDate = new Date(values?.dueDate);
    if (startDate >= endDate) {
      console.log("End Date must be greater than the Start Date");
      return;
    }

    const memberId = selectRow?.map((row) => row.id);
    await updateAttachments(values, memberId);
  };

  const onClose = () => {
    form.resetFields();
    dispatch(setSelectedRow("removeAll"));
    dispatch(setTodoData({ type: "remove" }));
    dispatch(setAllTodoData({ type: "removeAll" }));
    dispatch(createRemoveProjectAttachment({ type: "removeAll" }));
    dispatch(setOpenCreateCardDrawer({ value: false }));
    dispatch(setUpdateCreateProject({ data: {} }));
  };

  useEffect(() => {
    form.resetFields();
  }, [createProjectData]);

  const handleFormData = (value) => {};

  return (
    <div>
      {contextHolder}
      <Drawer
        title="Create Card"
        headerStyle={{
          border: "none",
        }}
        placement="right"
        bodyStyle={{
          padding: "0%",
        }}
        width={screenSize <= 768 ? "100%" : 745}
        open={openCreateCardDrawer}
        closable={false}
        extra={
          <>
            <span onClick={onClose} style={{ cursor: "pointer" }}>
              {filterIcons.crossIcon}
            </span>
          </>
        }
      >
        <Form
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          colon={false}
          onValuesChange={handleFormData}
          className={styles.createUserForm}
          initialValues={createProjectData}
        >
          <CreateCard />
          <div className={"customDrawerFooter"}>
            <Button
              className={styles.createUserBtn}
              htmlType="submit"
              loading={createProjectCardLoader}
            >
              Create
            </Button>
          </div>
        </Form>
      </Drawer>
    </div>
  );
};

export default CreateCardDrawer;
