import { Form } from 'antd';
import React, {
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import tableStyles from '../../styles/components-style/LeadsTable.module.css';
const EditableContext = React.createContext(null);

export const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export const EditableCellAll = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  handleChange,
  inputComponent,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex]
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave();
    } catch (errInfo) {
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`
          }
        ]}
      >
        {inputComponent({
          ref: inputRef,
          onPressEnter: save,
          onBlur: save,
          onChange: e => handleChange(e, { ...record })
        })}
      </Form.Item>
    ) : (
      <div
        className={tableStyles.editableCellValueWrap}
        style={{
          paddingRight: 24
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
