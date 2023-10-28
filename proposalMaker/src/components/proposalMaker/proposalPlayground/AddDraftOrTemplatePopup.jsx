import { Input, Modal } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { genericProposalEdit } from "../../../redux/features/ProposalMakerSlice";
import styles from "../../../styles/components-style/ModalStyles.module.css";
import { proposalTemplates } from "../../../DummyData/dummyData";

const AddTemplatePopup = ({ openTemplateNameModal, saveAs, handleCancel }) => {
  const dispatch = useDispatch();
  const { proposalGenericTemplate, savingDataLoader } = useSelector((state) => {
    return state.feature.ProposalMaker;
  });

  const handleChange = (e) => {
    dispatch(genericProposalEdit({ [e.target.name]: e.target.value }));
  };

  return (
    <div>
      <Modal
        title={"Enter name for " + openTemplateNameModal}
        open={openTemplateNameModal}
        confirmLoading={savingDataLoader}
        onCancel={handleCancel}
        onOk={async () => {
          saveAs(
            openTemplateNameModal,
            proposalTemplates.id,
            proposalTemplates
          );
        }}
        width={500}
      >
        <Input
          placeholder="Enter Name"
          value={
            openTemplateNameModal === "draft"
              ? proposalGenericTemplate?.proposalName
              : proposalGenericTemplate?.templateName
          }
          className={styles.modalInput}
          name={
            openTemplateNameModal === "template"
              ? "templateName"
              : "proposalName"
          }
          onChange={handleChange}
        />
      </Modal>
    </div>
  );
};

export default AddTemplatePopup;
