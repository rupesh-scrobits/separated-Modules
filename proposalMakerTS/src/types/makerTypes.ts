export interface ProposalTag {
  isActive: boolean;
  lineBreaks: number;
  id: number;
  title: string;
  description: string;
}

export interface RowData {
  id: number;
  name: string;
  email: string;
}

export interface FilterProposal {
  id?: number;
  isDraft?: number;
  proposalName?: string;
  sentTo?: null;
  templateName?: null | string;
  updatedDate?: string;
  createdDate?: string;
  createdBy?: RowData;
}

export interface ProposalTableColumn {
  title?: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  fixed?: string | boolean;
  render?: (rowData: string | RowData | ActionsData) => React.ReactNode;
}

export interface ProposalMakerState {
  emailSendLoader: boolean;
  savingDataLoader: boolean;
  allProposalsLoader: boolean;
  proposalTemplateLoader: boolean;
  isNewMetaTag: boolean;
  allProposals: FilterProposal[];
  proposalTemplates: any[];
  proposalGenericTemplate: {
    id?: number;
    proposalName?: string;
    templateName?: string;
    proposalJSON: ProposalTag[];
  };
  staticProposalToCompare: any;
  proposalEdit: any;
  network: any;
  emailDetails: {
    email: string;
    subject: string;
    body: string;
  };
  modalStates: {
    isEditModalOpen: number;
    openTemplateNameModal: boolean;
    openEmailSendModal: boolean;
  };
  filterSelected: string;

  pages: {
    pageArray: number[];
    nextHeightBreakPoint: number;
    nOfPages: number;
  };
}

export interface AddTagModalProps {
  isEditModalOpen: boolean;
  handleCancel: () => void;
}

export interface AddTemplatePopupProps {
  openTemplateNameModal: boolean | string;
  saveAs: (type: string, id: number, data: ProposalData) => void;
  handleCancel: () => void;
}

export interface SendMailPopupProps {
  sendMail: () => void;
  openEmailSendModal: boolean;
  handleCancel: () => void;
}

export interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: string;
  record: any;
  index: number;
  children: React.ReactNode;
  inputComponent: React.ReactNode;
}

export interface TableColumnProps {
  openActionsPopover: number;
  setOpenActionsPopover: React.Dispatch<React.SetStateAction<number>>;
  proposalType: string | FilterProposal;
}



export interface ActionsData {
  id: number;
  proposalName: string;
  templateName: null;
  createdDate: string;
  updatedDate: string;
  sentTo: null;
  isDraft: 0;
  createdBy: RowData;
}

export interface ProposalData {
  templateName: null;
  proposalJSON: ProposalTag[];
  proposalName: string;
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  lineBreaks: number;
}

export interface UpdateProposal {
  isDraft: number;
  templateName: null;
  proposalJSON?: ProposalTag[];
}

export interface SendMail {
  email: string;
  subject: string;
  body: string;
}

export interface CreateAndUpdateProposal {
  proposalJSON: ProposalTag[];
  proposalName: string;
  templateName: null | string;
}

// export interface Tags {
//   id: number;
//   title: string;
//   isActive: boolean;
//   lineBreaks: number;
//   description: string;
// }

export interface HandleTagSelect {
  checkState: boolean;
  tag: ProposalTag;
}

export interface ReArrangedTags {
  items: ProposalTag[];
}
