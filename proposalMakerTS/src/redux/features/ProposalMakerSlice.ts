import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "../../services/httpService";
import { PROPOSAL_URLS } from "../../services/URLConstants";
import {
  CreateAndUpdateProposal,
  HandleTagSelect,
  ProposalMakerState,
  ProposalTag,
  SendMail,
  UpdateProposal,
} from "../../types/makerTypes";

export function getFormData(data: Record<string, any>): FormData {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  return formData;
}

export const getAllProposals = createAsyncThunk(
  "proposals/getAllProposals",
  async ({ from, count }: { from: number; count: number }) => {
    const url = `${PROPOSAL_URLS.getAll}?from=${from}&count=${count}`;
    return (await http.get(url)).data;
  }
);

export const getAllTemplateProposals = createAsyncThunk(
  "proposals/getAlltemplateProposals",
  async () => {
    const url = PROPOSAL_URLS.getProposalTemplate;
    return (await http.get(url)).data;
  }
);

export const getProposalById = createAsyncThunk(
  "proposals/getProposalById",
  async (id: number) => {
    const url = `${PROPOSAL_URLS.proposalById}/${id}`;
    return (await http.get(url)).data;
  }
);

export const updateProposalById = createAsyncThunk(
  "proposals/updateProposalById",
  async ({ id, data }: { id: number; data: UpdateProposal }) => {
    const url = `${PROPOSAL_URLS.proposalById}/${id}`;
    return (await http.patch(url, data)).data;
  }
);

export const deleteProposal = createAsyncThunk(
  "proposals/deleteProposal",
  async ({ id }: { id: number }) => {
    const url = `${PROPOSAL_URLS.proposalById}/${id}`;
    return (await http.delete(url)).data;
  }
);

export const createProposal = createAsyncThunk(
  "proposals/createProposal",
  async ({ data }: { data: any }) => {
    const url = PROPOSAL_URLS.createProposal;
    return (await http.post(url, data)).data;
  }
);

export const sendMail = createAsyncThunk(
  "proposals/sendMail",
  async ({ proposalId, data }: { proposalId: number; data: SendMail }) => {
    const url = `${PROPOSAL_URLS.createProposal}/${proposalId}/send`;
    return (await http.post(url, data)).data;
  }
);

export const uploadFile = createAsyncThunk(
  "proposals/uploadFile",
  async ({
    data,
    proposalId,
  }: {
    data: Record<string, any>;
    proposalId: number;
  }) => {
    const url = `${PROPOSAL_URLS.createProposal}/${proposalId}/save`;
    return (await http.postForm(url, getFormData(data))).data;
  }
);

export const createAndUpdateProposal =
  ({
    data,
    dataToUpdate,
  }: {
    data: CreateAndUpdateProposal;
    dataToUpdate: UpdateProposal;
  }) =>
  async (dispatch: any) => {
    const action = await dispatch(createProposal({ data }));
    return await dispatch(
      updateProposalById({
        id: action?.payload?.id,
        data: { ...dataToUpdate },
      })
    );
  };

export const saveDataAndSendMail =
  ({
    emailDetails,
    file,
    proposalData,
  }: {
    emailDetails: any;
    file: Record<string, any>;
    proposalData: any;
  }) =>
  async (dispatch: any) => {
    const saveProposalAction = await dispatch(
      createProposal({ data: proposalData })
    );
    const data = await dispatch(
      uploadFile({
        data: file,
        proposalId: saveProposalAction?.payload?.id,
      })
    );

    return await dispatch(
      sendMail({
        proposalId: saveProposalAction?.payload?.id,
        data: emailDetails,
      })
    );
  };

const initialState: ProposalMakerState = {
  emailSendLoader: false,
  savingDataLoader: false,
  allProposalsLoader: false,
  proposalTemplateLoader: false,
  isNewMetaTag: false,
  allProposals: [],
  proposalTemplates: [],
  proposalGenericTemplate: {
    proposalJSON: [],
  },
  staticProposalToCompare: {},
  proposalEdit: {},
  network: {},
  emailDetails: {
    email: "",
    subject: "",
    body: "",
  },
  modalStates: {
    isEditModalOpen: -1,
    openTemplateNameModal: false,
    openEmailSendModal: false,
  },
  filterSelected: "all",
  pages: {
    pageArray: [],
    nextHeightBreakPoint: 1250,
    nOfPages: 1,
  },
};

const ProposalMaker = createSlice({
  name: "proposalMaker",
  initialState,
  reducers: {
    // Proposal Page Break Logic States setter
    setPagesOfProposal: (state, action) => {
      const key = Object.keys(action.payload)[0];
      return {
        ...state,
        pages: {
          ...state.pages,
          [key]: action.payload[key],
        },
      };
    },

    /*************************************************Proposal Meta Tag **************************************************/

    handleTagsSelect: (state, action: PayloadAction<HandleTagSelect>) => {
      const { checkState, tag } = action.payload;
      return {
        ...state,
        proposalGenericTemplate: {
          ...state?.proposalGenericTemplate,
          proposalJSON: state?.proposalGenericTemplate?.proposalJSON?.map(
            (metaTag: any) => {
              if (metaTag?.id === tag?.id) {
                return { ...metaTag, isActive: checkState };
              } else {
                return metaTag;
              }
            }
          ),
        },
      };
    },

    setIsNewMetaTag: (
      state,
      // action: PayloadAction<{ pageArray: string[] }>
      action
    ) => {
      return {
        ...state,
        isNewMetaTag: action.payload,
      };
    },

    handleEditAddTag: (
      state,
      action: PayloadAction<{ data: ProposalTag; id: number }>
    ) => {
      const { data, id } = action.payload;
      if (state.isNewMetaTag) {
        return {
          ...state,
          proposalGenericTemplate: {
            ...state.proposalGenericTemplate,
            proposalJSON: [
              ...state.proposalGenericTemplate.proposalJSON,
              { ...data, id: id },
            ],
          },
        };
      } else {
        return {
          ...state,
          proposalGenericTemplate: {
            ...state.proposalGenericTemplate,
            proposalJSON: state.proposalGenericTemplate.proposalJSON?.map(
              (metaTag: any) => {
                if (metaTag?.id === id) {
                  return { ...data };
                } else {
                  return metaTag;
                }
              }
            ),
          },
        };
      }
    },

    deleteMetaTag: (state, action: PayloadAction<{ data: ProposalTag }>) => {
      const { data } = action.payload;
      return {
        ...state,
        proposalGenericTemplate: {
          ...state.proposalGenericTemplate,
          proposalJSON: state.proposalGenericTemplate.proposalJSON?.filter(
            (tag: any) => {
              return data?.id !== tag?.id;
            }
          ),
        },
      };
    },

    setReArrangedTags: (state, action) => {
      const { items } = action.payload;
      return {
        ...state,
        proposalGenericTemplate: {
          ...state.proposalGenericTemplate,
          proposalJSON: [...items],
        },
      };
    },

    setProposalEdit: (state, action) => {
      return {
        ...state,
        proposalEdit: action.payload,
      };
    },

    // emptyProposalTemplate: (state, action) => {
    //   return {
    //     ...state,
    //     proposalGenericTemplate: {},
    //   };
    // },

    genericProposalEdit: (state, action) => {
      const key = Object.keys(action.payload)[0];
      return {
        ...state,
        proposalGenericTemplate: {
          ...state.proposalGenericTemplate,
          [key]: action.payload[key],
        },
      };
    },

    addLineBreaks: (state, action) => {
      const { id, lineBreaks } = action.payload;
      return {
        ...state,
        proposalGenericTemplate: {
          ...state.proposalGenericTemplate,
          proposalJSON: state.proposalGenericTemplate?.proposalJSON?.map(
            (record: number[] | string[] | any) => {
              if (id === record?.id) {
                return {
                  ...record,
                  lineBreaks: lineBreaks,
                };
              } else {
                return record;
              }
            }
          ),
        },
      };
    },

    handleEmailDetailsChange: (state, action) => {
      const key = Object.keys(action.payload)[0];
      return {
        ...state,
        emailDetails: {
          ...state.emailDetails,
          [key]: action.payload[key],
        },
      };
    },

    clearNetworkState: (state) => {
      return {
        ...state,
        network: {},
      };
    },

    // clearEmailDetailsState: (state, action) => {
    //   return {
    //     ...state,
    //     emailDetails: {},
    //   };
    // },

    updateModalStates: (state, action) => {
      const key = Object.keys(action.payload)[0];
      return {
        ...state,
        modalStates: {
          ...state.modalStates,
          [key]: action.payload[key],
        },
      };
    },

    // set selectedfilter
    setFilterSelected: (state, action) => {
      const { filter } = action.payload;
      return {
        ...state,
        filterSelected: filter,
      };
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getAllProposals.pending, (state) => {
      state.allProposalsLoader = true;
    });
    builder.addCase(getAllProposals.fulfilled, (state, action) => {
      state.allProposals = action.payload.result;
      state.allProposalsLoader = false;
    });
    builder.addCase(getAllProposals.rejected, (state) => {
      state.allProposalsLoader = false;
    });

    builder.addCase(getProposalById.pending, (state) => {
      state.proposalTemplateLoader = true;
    });
    builder.addCase(getProposalById.fulfilled, (state, action) => {
      state.proposalTemplateLoader = false;
      state.proposalGenericTemplate = {
        ...action.payload,
        proposalJSON:
          action.payload.proposalJSON?.map((record: string | number | any) => {
            return { ...record };
          }) || [],
      };
      state.staticProposalToCompare = {
        ...action.payload,
        proposalJSON:
          action.payload.proposalJSON?.map((record: string | number | any) => {
            return { ...record };
          }) || [],
      };
    });
    builder.addCase(getProposalById.rejected, (state) => {
      state.proposalTemplateLoader = false;
    });

    builder.addCase(updateProposalById.pending, (state) => {
      state.savingDataLoader = true;
    });
    builder.addCase(updateProposalById.fulfilled, (state, action) => {
      state.savingDataLoader = false;
      state.network = action;
      state.modalStates.openTemplateNameModal = false;
    });
    builder.addCase(updateProposalById.rejected, (state, action) => {
      state.savingDataLoader = false;
      state.network = action;
    });

    builder.addCase(createProposal.pending, (state) => {
      state.savingDataLoader = true;
      state.emailSendLoader = true;
    });
    builder.addCase(createProposal.fulfilled, (state) => {
      state.savingDataLoader = false;
    });
    builder.addCase(createProposal.rejected, (state) => {
      state.savingDataLoader = false;
    });

    builder.addCase(deleteProposal.pending, (state) => {
      state.savingDataLoader = true;
    });
    builder.addCase(deleteProposal.fulfilled, (state, action) => {
      state.savingDataLoader = false;
      state.network = action;
      state.allProposals =
        state.allProposals?.filter((proposal) => {
          return proposal?.id !== action?.meta?.arg?.id;
        }) || [];
    });
    builder.addCase(deleteProposal.rejected, (state, action) => {
      state.savingDataLoader = false;
      state.network = action;
    });

    builder.addCase(sendMail.pending, (state) => {
      state.emailSendLoader = true;
    });
    builder.addCase(sendMail.fulfilled, (state, action) => {
      state.network = action;
      state.emailSendLoader = false;
      state.modalStates.openEmailSendModal = false;
    });
    builder.addCase(sendMail.rejected, (state, action) => {
      state.emailSendLoader = false;
      state.network = action;
    });

    builder.addCase(uploadFile.pending, (state) => {
      state.emailSendLoader = true;
    });
    builder.addCase(uploadFile.fulfilled, () => {
      // Define the behavior when uploadFile is fulfilled
    });
    builder.addCase(uploadFile.rejected, (state, action) => {
      state.emailSendLoader = false;
      state.network = action;
    });

    builder.addCase(getAllTemplateProposals.pending, (state) => {
      state.proposalTemplateLoader = true;
    });
    builder.addCase(getAllTemplateProposals.fulfilled, (state, action) => {
      state.proposalTemplates = action.payload.result;
      state.proposalTemplateLoader = false;
    });
    builder.addCase(getAllTemplateProposals.rejected, (state) => {
      state.proposalTemplateLoader = false;
    });
  },
});

export const {
  setPagesOfProposal,
  handleTagsSelect,
  handleEditAddTag,
  setIsNewMetaTag,
  deleteMetaTag,
  setReArrangedTags,
  setProposalEdit,
  // emptyProposalTemplate,
  // filterTemplates,
  genericProposalEdit,
  handleEmailDetailsChange,
  clearNetworkState,
  // clearEmailDetailsState,
  updateModalStates,
  setFilterSelected,
  addLineBreaks,
} = ProposalMaker.actions;
export default ProposalMaker.reducer;
