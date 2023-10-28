import { Input, Modal } from "antd";
import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import styles from "../../../styles/components-style/ModalStyles.module.css";
import { useDispatch } from "react-redux";
import {
  handleEditAddTag,
  setProposalEdit,
} from "../../../redux/features/ProposalMakerSlice";
import { getRandomKey } from "../../../utilities/commonFunctions/commonComponents";
import { AddTagModalProps } from "../../../types/makerTypes";
import {  useAppSelector } from "../../../redux/store";

const AddTagModal: React.FC<AddTagModalProps> = ({
  isEditModalOpen,
  handleCancel,
}) => {
  const dispatch = useDispatch();
  const editorRef = useRef<any | unknown>();
  const { proposalEdit, savingDataLoader } = useAppSelector(
    (state) => state.proposalMaker
  );

  const handleEditorChange = () => {
    if (editorRef.current) {
      dispatch(
        setProposalEdit({
          ...proposalEdit,
          description: editorRef.current.getContent(),
        })
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setProposalEdit({
        ...proposalEdit,
        title: e.target.value,
      })
    );
  };

  return (
    <div>
      <Modal
        title="Edit Tags"
        visible={isEditModalOpen} // Changed 'open' to 'visible'
        onOk={() => {
          dispatch(
            handleEditAddTag({
              data: proposalEdit,
              id: proposalEdit?.id ? proposalEdit?.id : getRandomKey(),
            })
          );
          handleCancel();
        }}
        onCancel={handleCancel}
        width={900}
        confirmLoading={savingDataLoader}
      >
        <Input
          placeholder="Enter Title"
          value={proposalEdit?.title || ""}
          className={styles.modalInput}
          onChange={handleChange}
        />
        <Editor
          apiKey="w9gimue80rrzpo68utosnbh26d7qtpkgba0tvwzs13qhukon"
          onInit={(event, editor) => (editorRef.current = editor)}
          init={{
            height: 300,
            menubar: "edit",
            plugins: [
              "image",
              "code",
              "lists",
              "autolink",
              "link",
              "charmap",
              "preview",
              "anchor",
              "help",
              "searchreplace",
              "visualblocks",
              "code",
              "insertdatetime",
              "media",
              "table",
              "paste",
              "wordcount",
            ],
            toolbar:
              "undo redo | formatselect | bold italic | \
                alignleft aligncenter alignright | \
                bullist numlist outdent indent | help | image | underline | code | fontselect",
            font_formats: `'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats'`,
          }}
          onChange={handleEditorChange}
          initialValue={proposalEdit?.description || ""}
        />
      </Modal>
    </div>
  );
};

export default AddTagModal;
