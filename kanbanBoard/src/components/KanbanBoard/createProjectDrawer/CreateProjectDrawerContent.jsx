import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Upload
} from 'antd';
import React, { useRef, useState } from 'react';
import styles from '../../../styles/components-style/VendorDrawer.module.css';
import formstyle from '../../../styles/components-style/ProjectDrawer.module.css';
import drawerStyles from '../../../styles/components-style/CreateDrawer.module.css';
import { Editor } from '@tinymce/tinymce-react';
import Attach from './AttachFile';
import { priorityOptions } from '../../../utilities/commonFunctions/tableOptions';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  setUpdateCreateProject,
  setUploadImageFile
} from '../../../redux/features/projectSlices/ProjectManagementSlice';
import { uploadFile } from '../../../services/uploadFile';
import { UPLOAD_DOC_URLS } from '../../../services/URLConstants';

const { TextArea } = Input;

const CreateProjectDrawerContent = () => {
  const editorRef = useRef();
  const { createProjectData, uploadImageFile } = useSelector(
    state => state.feature.ProjectSlice
  );
  const dispatch = useDispatch();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    );
  };

  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleEditorChange = () => {
    if (editorRef) {
      dispatch(
        setUpdateCreateProject({
          data: { referenceVideo: editorRef.current.getContent() }
        })
      );
    }
  };

  const handleUploadSuccess = async file => {
    dispatch(setUploadImageFile(file?.file?.originFileObj));
  };

  const getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className={formstyle.createFormFieldsWrapper}>
      <div className={styles.formDetails}>
        <Row className={drawerStyles.contactInfoFields}>
          <Col sm={24}>
            <Form.Item
              label=""
              valuePropName="fileList"
              getValueFromEvent={normFile}
              className={`${drawerStyles.contactFieldsInput}`}
            >
              {uploadImageFile ? (
                <Upload
                  action={null}
                  maxCount={1}
                  onChange={handleUploadSuccess}
                  listType="picture-card"
                  className={`${formstyle.projectUpload} projectTumbnailUpload`}
                  // onPreview={handlePreview}
                >
                  <div className={formstyle.projectUpload}>
                    Upload image
                  </div>
                </Upload>
              ) : null}
            
              <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
              >
                <img
                  alt="example"
                  style={{
                    width: '100%'
                  }}
                  src={previewImage}
                />
              </Modal>
            </Form.Item>
          </Col>
        </Row>

        <Row className={drawerStyles.contactInfoFields}>
          <Col span={24}>
            <Form.Item
              name="title"
              label={
                <label className={styles.formLabel}>
                  Project name
                </label>
              }
              className={`${drawerStyles.contactFieldsInput} ${formstyle.inputFields}`}
              rules={[
                {
                  required: true,
                  message: 'Please enter project name',
                }
              ]}
            >
              <Input className={styles.formInput} />
            </Form.Item>
          </Col>
        </Row>

        <Row className={drawerStyles.contactInfoFields}>
          <Col span={24}>
            <Form.Item
              name="description"
              label={
                <label className={styles.formLabel}>
                  Description
                </label>
              }
              className={`${drawerStyles.contactFieldsTextarea}`}
              rules={[
                {
                  required: true,
                  message: 'Please enter description',
                }
              ]}
            >
              <textarea />
            </Form.Item>
          </Col>
        </Row>

        <Row className={drawerStyles.contactInfoFields}>
          <Col span={11}>
            <Form.Item
              name="startDate"
              label={
                <label className={styles.formLabel}>
                  Start Date
                </label>
              }
              className={`${drawerStyles.contactFieldsInput}`}
              rules={[
                {
                  message: 'Please select start date',
                  required: true
                }
              ]}
            >
              <input type="date" className={formstyle.formDate} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="dueDate"
              label={
                <label className={styles.formLabel}>Due Date</label>
              }
              className={`${drawerStyles.contactFieldsInput}`}
              rules={[
                {
                  message: 'Please select end date',
                  required: true
                }
              ]}
            >
              <input type="date" className={formstyle.formDate} />
            </Form.Item>
          </Col>
        </Row>

        <Row className={drawerStyles.contactInfoFields}>
          <Col span={24}>
            <Form.Item
              name="priority"
              label={
                <label className={styles.formLabel}>Priority</label>
              }
              className={`${drawerStyles.contactFieldsInput}`}
              rules={[
                {
                  message: 'Please set your priority',
                  required: true
                }
              ]}
            >
              <Select
                showSearch
                placeholder="Set Priority"
                options={priorityOptions}
                className="selectContactCreateDrawer"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row className={drawerStyles.contactInfoFields}>
          <Col sm={24}>
            {/* ------------------Attachment-------------- */}
            <Form.Item
              className={`${drawerStyles.contactFieldsInput}`}
            >
              <Attach from={'createProject'} />
            </Form.Item>
          </Col>
        </Row>

        <Row className={drawerStyles.contactInfoFields}>
          <Col sm={24}>
            <Form.Item
              label={
                <label className={styles.formLabel}>
                  {' '}
                  Reference Videos
                </label>
              }
              className={`${drawerStyles.contactFieldsInput}`}
            >
              <Editor
                apiKey="w9gimue80rrzpo68utosnbh26d7qtpkgba0tvwzs13qhukon"
                onInit={(event, editor) =>
                  (editorRef.current = editor)
                }
                init={{
                  height: 300,
                  menubar: true,
                  plugins: [
                    'image',
                    'code',
                    'lists',
                    'autolink',
                    'link',
                    'charmap',
                    'preview',
                    'anchor',
                    'help',
                    'searchreplace',
                    'visualblocks',
                    'code',
                    'insertdatetime',
                    'media',
                    'table',
                    'wordcount'
                  ],
                  toolbar:
                    'undo redo | formatselect | bold italic | \
                alignleft aligncenter alignright | \
                bullist numlist outdent indent | help | image | underline | code | fontselect',
                  selector: 'textarea', // change this value according to your HTML
                  font_formats: `'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats'`,
                  relative_urls: false,
                  remove_script_host: false,
                  convert_urls: true
                }}
                onEditorChange={handleEditorChange}
                value={createProjectData?.referenceVideo}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row className={drawerStyles.contactInfoFields}>
          <Col span={24}>
            <Form.Item
              name="comment"
              label={
                <label className={styles.formLabel}>Comments</label>
              }
              className={`${drawerStyles.contactFieldsTextarea}`}
              rules={[
                {
                  message: `Please enter "comments"`,
                  required: true
                }
              ]}
            >
              <textarea
                autoSize={{
                  minRows: 3,
                  maxRows: 5
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CreateProjectDrawerContent;
