import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "../../services/httpService";
import { PROPOSAL_URLS } from "../../services/URLConstants";
import { allProposals, proposalTemplates } from "../../DummyData/dummyData";

const storedData = localStorage.getItem("proposalsData");

export function getFormData(data) {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  return formData;
}

export const updateProposalById = createAsyncThunk(
  "proposals/updateProposalById",
  async ({ id, data }) => {
    const url = PROPOSAL_URLS.proposalById + "/" + id;
    return (await http.patch(url, data)).data;
  }
);

export const sendMail = createAsyncThunk(
  "proposals/sendMail",
  async ({ proposalId, data }) => {
    const url = PROPOSAL_URLS.createProposal + "/" + proposalId + "/send";
    return (await http.post(url, data)).data;
  }
);

export const uploadFile = createAsyncThunk(
  "proposals/uploadFile",
  async ({ data, proposalId }) => {
    const url = PROPOSAL_URLS.createProposal + "/" + proposalId + "/save";
    return (await http.postForm(url, getFormData(data))).data;
  }
);

export const saveDataAndSendMail =
  ({ emailDetails, file, proposalData }) =>
  async (dispatch) => {
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

const proposalMaker = createSlice({
  name: "proposalMaker",
  initialState: {
    emailSendLoader: false,
    savingDataLoader: false,
    allProposalsLoader: false,
    proposalTemplateLoader: false,
    isNewMetaTag: false,
    // allProposals: storedData ? JSON.parse(storedData) : allProposals,
    allProposals: allProposals,
    proposalTemplates: proposalTemplates,
    proposalGenericTemplate: {
      proposalJSON: [],
    },
    selectedProposalId: {},
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

    // states for pages
    pages: {
      pageArray: [],
      nextHeightBreakPoint: 1250,
      nOfPages: 1,
    },
  },
  reducers: {
    createProposal: (state, action) => {
      const { data } = action.payload;
      const updatedProposals = [...state.allProposals, data];
      state.allProposals.push(updatedProposals)
    },
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

    handleTagsSelect: (state, action) => {
      const { checkState, tag } = action.payload;
      return {
        ...state,
        proposalGenericTemplate: {
          ...state?.proposalGenericTemplate,
          proposalJSON: state?.proposalGenericTemplate?.proposalJSON?.map(
            (metaTag) => {
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

    setIsNewMetaTag: (state, action) => {
      return {
        ...state,
        isNewMetaTag: action.payload,
      };
    },

    handleEditAddTag: (state, action) => {
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
              (metaTag) => {
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

    deleteMetaTag: (state, action) => {
      const { data } = action.payload;
      return {
        ...state,
        proposalGenericTemplate: {
          ...state.proposalGenericTemplate,
          proposalJSON: state.proposalGenericTemplate.proposalJSON?.filter(
            (tag) => {
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

    emptyProposalTemplate: (state, action) => {
      return {
        ...state,
        proposalGenericTemplate: {},
      };
    },

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
            (record) => {
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

    clearNetworkState: (state, action) => {
      return {
        ...state,
        network: {},
      };
    },

    clearEmailDetailsState: (state, action) => {
      return {
        ...state,
        emailDetails: {},
      };
    },

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

    //set proposal id
    setProposalId: (state, action) => {
      state.selectedProposalId = action.payload;
      const selectedTemplate = proposalTemplates.find(
        (template) => template.id === action.payload
      );
      state.proposalGenericTemplate = {
        ...selectedTemplate,
        proposalJSON: selectedTemplate?.proposalJson?.map((record) => ({
          ...record,
        })),
      };
    },

    deleteProposalId: (state, action) => {
      const idToDelete = action.payload.id;
      state.allProposals = state.allProposals?.filter((proposal) => {
        return proposal?.id !== idToDelete;
      });
      localStorage.setItem("proposalsData", JSON.stringify(state.allProposals));
    },

    updateProposal: (state, action) => {
      const { id, data } = action.payload;
    },
  },

  extraReducers: {},
});

export const {
  setPagesOfProposal,
  setProposalId,
  handleTagsSelect,
  handleEditAddTag,
  setIsNewMetaTag,
  deleteMetaTag,
  setReArrangedTags,
  setProposalEdit,
  emptyProposalTemplate,
  filterTemplates,
  genericProposalEdit,
  handleEmailDetailsChange,
  clearNetworkState,
  clearEmailDetailsState,
  updateModalStates,
  setFilterSelected,
  addLineBreaks,
  deleteProposalId,
  createProposal,
} = proposalMaker.actions;
export default proposalMaker.reducer;
