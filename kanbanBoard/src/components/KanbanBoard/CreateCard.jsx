import React, { useState } from "react";
import {
  Button,
  Drawer,
  Col,
  Form,
  Input,
  Row,
  Select,
  Checkbox,
  Popover,
} from "antd";
import styles from "../../styles/components-style/VendorDrawer.module.css";
import formstyle from "../../styles/components-style/ProjectDrawer.module.css";
import drawerStyles from "../../styles/components-style/CreateDrawer.module.css";
import AssignProject from "./AssignProject";
import { todoIcons, projectIcons } from "../../utilities/icons/Icons";
import "../../styles/components-style/Kanban.css";
import Attach from "./createProjectDrawer/AttachFile";
import {
  priorityOptions,
  statusOptions,
} from "../../utilities/commonFunctions/tableOptions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  setAllTodoData,
  setTodoData,
} from "../../redux/features/projectSlices/ProjectManagementSlice";
import moment from "moment";
const { TextArea } = Input;

const CreateCard = () => {
  const dispatch = useDispatch();
  const { todoData, allTodoData } = useSelector(
    (state) => state.feature.ProjectSlice
  );
  // const [open, setOpen] = useState(false);

  // const showDrawer = () => {
  //   setOpen(true);
  // };

  // const onClose = () => {
  //   setOpen(false);
  // };

  const content = (
    <div>
      {priorityOptions.map((option) => (
        <div
          key={option.value}
          onClick={() =>
            dispatch(
              setTodoData({
                ...todoData,
                modalOpen: !todoData?.modalOpen,
                priority: option?.value,
                flag: option?.label,
              })
            )
          }
          className={styles.priorityOption} // Make sure `styles` is defined
        >
          {option.label}

          <span className={"priorityColor" + option?.label}>
            {projectIcons.flagIcon}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className={formstyle.createFormFieldsWrapper}>
      <div className={styles.formDetails}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="title"
              label={<label className={styles.formLabel}>Card Title</label>}
              // className={styles.formLabel}
              rules={[
                {
                  message: "Please enter valid card title",
                  required: true,
                },
              ]}
            >
              <Input className={styles.formInput} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label={
                <label className={styles.formLabel}>Card Description</label>
              }
              rules={[
                {
                  message: "Please enter valid card description",
                  required: true,
                },
              ]}
            >
              <TextArea
                autoSize={{
                  minRows: 3,
                  maxRows: 5,
                }}
                className={styles.formInput}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className={drawerStyles.contactInfoFields}>
          <Col span={11}>
            <Form.Item
              name="startDate"
              label={<label className={styles.formLabel}>Start Date</label>}
              className={`${drawerStyles.contactFieldsInput}`}
              rules={[
                {
                  message: "Please select start date",
                  required: true,
                },
              ]}
            >
              <input type="date" className={formstyle.formDate} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="dueDate"
              label={<label className={styles.formLabel}>Due Date</label>}
              className={`${drawerStyles.contactFieldsInput}`}
              rules={[
                {
                  message: "Please select end date",
                  required: true,
                },
              ]}
            >
              <input type="date" className={formstyle.formDate} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} className={drawerStyles.contactInfoFields}>
          <Col span={24}>
            <Form.Item
              name="priority"
              label={<label className={styles.formLabel}>Set Priority</label>}
              className={`${drawerStyles.contactFieldsInput}`}
              rules={[
                {
                  message: "Please set your priority",
                  required: true,
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Set Priority"
                className="selectContactCreateDrawer"
                options={priorityOptions}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} className={drawerStyles.contactInfoFields}>
          <Col span={24}>
            <Form.Item
              label={<label className={styles.formLabel}>Status</label>}
              className={`${drawerStyles.contactFieldsInput}`}
              name="status"
              rules={[
                {
                  message: "Please select status",
                  required: true,
                  // pattern : /^\D*$/,
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Pitch/Demo"
                className="selectContactCreateDrawer"
                options={statusOptions}
              />
            </Form.Item>
          </Col>
        </Row>
        {/* ------------------Assign to-------------- */}
        <Form.Item>
          <AssignProject />
        </Form.Item>
        {/* ------------------Attachment-------------- */}
        <Form.Item name="attachment">
          <Attach from={"createCard"} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="comment"
              label={<label className={styles.formLabel}>Comments</label>}
              rules={[
                {
                  message: "Please enter comments",
                  required: true,
                  pattern: /^\D*$/,
                },
              ]}
            >
              <TextArea
                autoSize={{
                  minRows: 3,
                  maxRows: 5,
                }}
                className={styles.formInput}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* <Form.Item
          name="todo"
          label={<label className={styles.formLabel}>To do</label>}
        > */}
        {allTodoData.map((todoItem, index) => (
          <Input
            key={index}
            className={`${styles.formInput} ${formstyle.todoInput2} todoInput2`}
            value={todoItem.title}
            suffix={
              <div className={formstyle.todoIconStyle}>
                <span>{moment(todoItem?.dueDate).format("YYYY-MM-DD")}</span>
                <span className={`priorityColor${todoItem.flag}`}>
                  {projectIcons.flagIcon}
                </span>
                {/* <span>{todoIcons.correct}</span> */}
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    dispatch(
                      setAllTodoData({
                        type: "remove",
                        index: index,
                      })
                    );
                  }}
                >
                  {todoIcons.close}
                </span>
              </div>
            }
          />
        ))}
        <label className={styles.formLabel}>Todo</label>
        <Input
          onChange={(event) =>
            dispatch(
              setTodoData({
                ...todoData,
                title: event.target.value,
              })
            )
          }
          value={todoData?.title}
          className={`${styles.formInput} ${formstyle.todoInput} todoInput`}
          placeholder="Add new todo"
          suffix={
            <div className={formstyle.todoIconStyle}>
              <span>
                <input
                  type="date"
                  value={
                    todoData?.dueDate
                      ? moment(todoData?.dueDate).format("YYYY-MM-DD")
                      : ""
                  }
                  onChange={(event) =>
                    dispatch(
                      setTodoData({
                        ...todoData,
                        dueDate: event.target.value,
                      })
                    )
                  }
                  className={formstyle.todoFormDate}
                />
              </span>
              <Popover
                open={todoData?.modalOpen}
                content={content}
                title="Priority"
                trigger="click"
              >
                <span
                  onClick={() =>
                    dispatch(
                      setTodoData({
                        ...todoData,
                        modalOpen: !todoData?.modalOpen,
                      })
                    )
                  }
                  className={
                    todoData?.flag
                      ? "priorityColor" + todoData?.flag
                      : "priorityColorLow"
                  }
                >
                  {projectIcons.flagIcon}
                </span>
              </Popover>
              <span
                onClick={() => {
                  if (todoData?.title) {
                    dispatch(setAllTodoData(todoData));
                  }
                }}
              >
                {todoIcons.correct}
              </span>
              <span onClick={() => dispatch(setTodoData({ type: "remove" }))}>
                {todoData?.title ? todoIcons.close : null}
              </span>
            </div>
          }
        />

        {/* </Form.Item> */}
      </div>
    </div>
  );
};

export default CreateCard;
