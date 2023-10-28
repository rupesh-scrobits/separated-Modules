import { Input, Modal } from 'antd';
import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import styles from '../../../styles/components-style/ModalStyles.module.css';
import { useSelector } from 'react-redux';
import {
  handleEditAddTag,
  setProposalEdit
} from '../../../redux/features/ProposalMakerSlice';
import { useDispatch } from 'react-redux';
import { getRandomKey } from '../../../utilities/commonFunctions/commonComponents';

const AddTagModal = ({ isEditModalOpen, handleCancel }) => {
  const dispatch = useDispatch();
  const editorRef = useRef();
  const { proposalEdit,savingDataLoader } = useSelector(state => {
    return state.feature.ProposalMaker;
  });

  const handleEditorChange = () => {
    if (editorRef) {
      dispatch(
        setProposalEdit({
          ...proposalEdit,
          description: editorRef.current.getContent()
        })
      );
    }
  };



  // *************undo redo************** 

  function hasUndo() {
    const hasUndoMessageBox = document.getElementById('undo-message-box')
    // 1
    const hasUndo = tinymce.activeEditor.undoManager.hasUndo()
    hasUndoMessageBox.innerText = hasUndo
}

function hasRedo() {
    const hasRedoMessageBox = document.getElementById('redo-message-box')
    // 2
    const hasRedo = tinymce.activeEditor.undoManager.hasRedo()
    hasRedoMessageBox.innerText = hasRedo
}


//******************************

  const handleChange = e => {
    dispatch(
      setProposalEdit({
        ...proposalEdit,
        title: e.target.value
      })
    );
  };

  return (
    <div>
      <Modal
        title="Edit Tags"
        open={isEditModalOpen}
        onOk={() => {
          dispatch(
            handleEditAddTag({
              data: proposalEdit,
              id: proposalEdit?.id ? proposalEdit?.id : getRandomKey()
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
          value={proposalEdit?.title}
          className={styles.modalInput}
          onChange={handleChange}
        />
        <Editor
          apiKey="w9gimue80rrzpo68utosnbh26d7qtpkgba0tvwzs13qhukon"
          // initialValue={data}
          onInit={(event, editor) => (editorRef.current = editor)}
          init={{

            height: 300,
            // undoManager: undo(),
            menubar: 'edit',
            plugins: [
              'image',
              'code',
              'lists',
              'autolink',
              'link',
              'charmap',
              // "print",
              'preview',
              'anchor',
              'help',
              'searchreplace',
              'visualblocks',
              'code',
              'insertdatetime',
              'media',
              'table',
              "paste",
              'wordcount'
            ],
            // menubar: 'edit',
            toolbar:
              'undo redo | formatselect | bold italic | \
                alignleft aligncenter alignright | \
                bullist numlist outdent indent | help | image | underline | code | fontselect',
            // selector: "textarea", // change this value according to your HTML
            font_formats: `'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats'`
          }}
          onChange={handleEditorChange}
          initialValue={proposalEdit?.description}
        />
      </Modal>
    </div>
  );
};

export default AddTagModal;
