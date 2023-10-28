import { Button, Drawer, Form, notification } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterIcons } from '../../../utilities/icons/Icons';
import styles from '../../../styles/components-style/CreateUserDrawer.module.css';
import useScreenSize from '../../../utilities/commonFunctions/ScreenSize';
import {
  UploadImageLoader,
  createProject,
  createRemoveProjectAttachment,
  setOpenCreateProjectDrawer,
  setUploadImageFile
} from '../../../redux/features/projectSlices/ProjectManagementSlice';
import CreateProjectDrawerContent from './CreateProjectDrawerContent';
import { uploadFile } from '../../../services/uploadFile';
import { openNotification } from '../../../App';

const CreateProjectDrawer = () => {
  const screenSize = useScreenSize();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const {
    uploadImageFile,
    openCreateProjectDrawer,
    createProjectData,
    createProjectLoader,
    attachments,
    allUploadedAttachmentFiles
  } = useSelector(state => {
    return state.feature.ProjectSlice;
  });

  const updateAttachments = async (values, fileLink) => {
    const filteredUploadAttachments = attachments.filter(
      attachment => attachment.type === 'device'
    );
    const filteredLinkAttachments = attachments.filter(
      attachment => attachment.type != 'device'
    );
    const updatedUploadAttachments = await Promise.all(
      filteredUploadAttachments.map(async attachment => {
        const matchingFile = allUploadedAttachmentFiles.find(
          file => file.name === attachment.name
        );
        if (matchingFile) {
          dispatch(UploadImageLoader(true));
          const fileLink = await (
            await uploadFile(matchingFile)
          ).data; // Replace with your logic
          return { ...attachment, link: fileLink?.fileurl }; // Create a new object with 'link' property added
        }
        return attachment; // Return the existing object if no match
      })
    );

    // Combine the updated 'updatedUploadAttachments' with 'filteredLinkAttachments'
    const combinedAttachments = [
      ...updatedUploadAttachments,
      ...filteredLinkAttachments
    ];

    await dispatch(
      createProject({
        projectData: {
          ...values,
          priority: parseInt(values?.priority),
          dueDate: new Date(values?.dueDate).toISOString(),
          startDate: new Date(values?.startDate).toISOString(),
          referenceVideo: createProjectData?.referenceVideo,
          thumbnail: fileLink?.fileurl,
          attachment: combinedAttachments
        }
      })
    );
    await onClose();
  };

  const onFinish = async values => {
    const startDate = new Date(values?.startDate);
    const endDate = new Date(values?.dueDate);
    if (startDate >= endDate) {
      openNotification(
        api,
        'bottomLeft',
        'End Date must be greater than the Start Date',
        'error'
      );
      return;
    }
    try {
      let fileLink = '';
      if (uploadImageFile?.name && uploadImageFile?.size < 3145728) {
        dispatch(UploadImageLoader(true));
        fileLink = await (await uploadFile(uploadImageFile)).data;
      }
      await updateAttachments(values, fileLink);
    } catch (error) {
      console.error('Error creating project:', error);
      // Handle error, display error message, etc.
    }
  };

  const onClose = () => {
    form.resetFields();
    dispatch(setUploadImageFile(null));
    dispatch(createRemoveProjectAttachment({ type: 'removeAll' }));
    dispatch(setOpenCreateProjectDrawer({ value: false }));
  };

  const handleFormData = value => {};

  return (
    <div>
      {contextHolder}
      <Drawer
        title="Create New Project"
        headerStyle={{
          border: 'none'
        }}
        placement="right"
        bodyStyle={{
          padding: '0%'
        }}
        width={screenSize <= 768 ? '100%' : 745}
        open={openCreateProjectDrawer}
        closable={false}
        extra={
          <>
            <span onClick={onClose} style={{ cursor: 'pointer' }}>
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
          <CreateProjectDrawerContent />
          <div className={'customDrawerFooter'}>
            <Button
              className={styles.createUserBtn}
              htmlType="submit"
              loading={createProjectLoader}
            >
              Create Project
            </Button>
          </div>
        </Form>
      </Drawer>
    </div>
  );
};

export default CreateProjectDrawer;
