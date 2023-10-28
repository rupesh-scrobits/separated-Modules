import { Form } from "antd";
import { EditableCellProps } from "../../../types/makerTypes";

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  inputComponent,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputComponent}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;
