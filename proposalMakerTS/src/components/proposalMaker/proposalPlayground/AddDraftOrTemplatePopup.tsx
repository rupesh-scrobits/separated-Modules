import React from "react";
import { Input, Modal } from "antd";
import { genericProposalEdit } from "../../../redux/features/ProposalMakerSlice";
import styles from "../../../styles/components-style/ModalStyles.module.css";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../redux/store";
import { AddTemplatePopupProps } from "../../../types/makerTypes";

const AddTemplatePopup: React.FC<AddTemplatePopupProps> = ({
  openTemplateNameModal,
  saveAs,
  handleCancel,
}) => {
  const dispatch = useAppDispatch();
  const { proposalGenericTemplate, savingDataLoader } = useAppSelector(
    (state) => state.proposalMaker
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(genericProposalEdit({ [e.target.name]: e.target.value }));
  };

  return (
    <div>
      <Modal
        title={"Enter name for " + openTemplateNameModal}
        visible={!!openTemplateNameModal}
        confirmLoading={savingDataLoader}
        onCancel={handleCancel}
        onOk={async () => {
          saveAs(
            openTemplateNameModal,
            proposalGenericTemplate.id,
            proposalGenericTemplate
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
