import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PROJECT_URLS, TODO_URLS } from "../../../services/URLConstants";
import http from "../../../services/httpService";
import { boardDetails, projectDetails } from "../../../components/dummyData";


const projectSlice = createSlice({
  name: "projectSlice",
  initialState: {
    attachments: [],
    projectNetwork: {},
    allProjects: [],
    projectDetails: projectDetails, // project details
    projectBoard: boardDetails, // project board
    projectFilters: [],
    search: "",
    cardSearch: "",
    todoData: {},
    allTodoData: [],

    createProjectData: {},
    selectedCardDetails: {},

    // page Size handling states
    pageSize: 10,
    pageNumber: 1,
    pageStart: 0,

    //assign to
    assignProject: [],

    // attachment
    projectAttachment: {},
    cardAttachment: {},

    // upload image
    uploadImageFile: {},
    uploadedAttachmentFiles: [],
    allUploadedAttachmentFiles: [],

    // upload doc
    uploadFile: {},

    attachmentModal: false,
    todoModal: false,
    deleteAttachmentModal: false,
    deleteTodoModal: false,

    deleteTodoLoader: false,
    deleteAttachmentLoader: false,

    deleteTodoId: null,
    deleteAttachmentId: null,

    // drawer states
    openCreateProjectDrawer: false,
    openCreateCardDrawer: false,
    cardDetailsModal: false,

    // loaders states
    createProjectLoader: false,
    getProjectsLoader: false,
    deleteProjectLoader: false,
    getProjectDetailsLoader: false,
    getProjectBoardLoader: false,
    filtersHeight: 0,

    createProjectCardLoader: false,
    deleteProjectCardLoader: false,
    updateCardMembersLoader: false,
    uploadDocLoader: false,
  },
  reducers: {
    //create project card
    createProjectCard: (state, action) => {
      const { cardData, projectId } = action.payload;
      state.projectBoard = state.projectBoard.map((board) => {
        if (board.status === cardData.status) {
          if (!Array.isArray(board.cards)) {
            board.cards = [];
          }
          board.cards.push(cardData);
        }

        return board;
      });
    },

    //update project card
    updateProjectCard: (state, action) => {
      const { cardData, cardId } = action.payload; // Extract cardData and cardId from the action payload

      state.projectBoard = state.projectBoard.map((board) => {
        if (Array.isArray(board.cards)) {
          board.cards = board.cards.map((card) => {
            if (card.id === cardId) {
              return {
                ...card,
                ...cardData,
              };
            }
            return card;
          });
        }
        return board;
      });
    },

    // Delete project card
    deleteProjectCard: (state, action) => {
      const { cardId } = action.payload;

      state.projectBoard = state.projectBoard.map((board) => {
        if (Array.isArray(board.cards)) {
          const index = board.cards.findIndex((card) => card.id === cardId);
          if (index !== -1) {
            board.cards.splice(index, 1);
          }
        }
        return board;
      });
    },

    updateCardMembers: (state, action) => {
      const { data, cardId } = action.payload;

      state.projectBoard = state.projectBoard.map((board) => {
        if (Array.isArray(board.cards)) {
          board.cards = board.cards.map((card) => {
            if (card.id === cardId) {
              return {
                ...card,
                members: data.members,
              };
            }
            return card;
          });
        }
        return board;
      });

      // Other state updates if needed
    },
    // create project attachment
    createProjectAttachment: (state, action) => {
      const { attachmentData, projectId } = action.payload;

      state.projectDetails = state.projectDetails.map((project) => {
        if (project.id === projectId) {
          project.attachment.push(attachmentData);
        }
        return project;
      });
    },

    // delete project attachment
    deleteProjectAttachment: (state, action) => {
      const { attachmentId } = action.payload;

      state.projectDetails = state.projectDetails.map((project) => {
        if (Array.isArray(project.attachment)) {
          project.attachment = project.attachment.filter(
            (attachment) => attachment.id !== attachmentId
          );
        }
        return project;
      });

      state.deleteAttachmentLoader = false;
      state.deleteAttachmentModal = false;
    },

    //create card attachment
    createCardAttachment: (state, action) => {
      const { attachmentData, cardId } = action.payload;

      // Find the card in the projectBoard with the matching cardId
      state.projectBoard = state.projectBoard.map((board) => {
        if (board.cards) {
          board.cards = board.cards.map((card) => {
            if (card.id === cardId) {
              // Check if the card has an 'attachments' array; if not, initialize it
              if (!Array.isArray(card.attachments)) {
                card.attachments = [];
              }
              // Add the new attachment data to the 'attachments' array
              card.attachments.push(attachmentData);
            }
            return card;
          });
        }
        return board;
      });

      // Other state updates if needed
    },

    // Assuming you have an action called deleteProjectAttachment
    deleteCardAttachment: (state, action) => {
      const { attachmentId } = action.payload;

      state.projectBoard = state.projectBoard.map((board) => {
        if (board.cards) {
          board.cards = board.cards.map((card) => {
            if (card.attachments) {
              // Use filter to remove the attachment with the specified attachmentId
              card.attachments = card.attachments.filter(
                (attachment) => attachment.id !== attachmentId
              );
            }
            return card;
          });
        }
        return board;
      });
      state.deleteAttachmentLoader = false;
      state.deleteAttachmentModal = false;
    },

    //create todo
    createTodo: (state, action) => {
      const { id, title, dueDate, priority } = action.payload;

      const newTodo = {
        id,
        title,
        dueDate,
        priority,
      };

      state.projectBoard = state.projectBoard.map((board) => {
        if (board.cards) {
          board.cards = board.cards.map((card) => {
            if (card.id === id) {
              if (!Array.isArray(card.todos)) {
                card.todos = [];
              }
              card.todos.push(newTodo);
            }
            return card;
          });
        }
        return board;
      });
    },

    // -----------------
    updateVendor: (state, action) => {
      const { data, vendorId } = action.payload;

      // Update the projectDetails to modify the vendor data
      state.projectDetails = state.projectDetails.map((project) => {
        project.members.map((member) => {
          if (member.id === vendorId) {
            // Update the vendor's data with the new data
            return {
              ...member,
              ...data,
            };
          }
          return member;
        });

        return project;
      });

      // Other state updates if needed
    },

    updateVendorRating: (state, action) => {
      const { vendorId, rating } = action.payload;
      const vendorToUpdate = state.allVendors.find(
        (vendor) => vendor.id === vendorId
      );
      if (vendorToUpdate) {
        vendorToUpdate.rating = rating;
      }
    },

    // setting the pagination states
    setPageSize: (state, action) => {
      const { pageSize, pageStart, pageNumber } = action.payload;
      return {
        ...state,
        pageSize: pageSize,
        pageStart: pageStart,
        pageNumber: pageNumber,
      };
    },

    clearProjectNetwork: (state, action) => {
      state.projectNetwork = {};
    },

    setProjectSort: (state, action) => {
      const { data } = action.payload;
      state.allProjects.result = data;
    },

    setTodoData: (state, action) => {
      const { dueDate, flag, priority, title, type, modalOpen } =
        action.payload;
      if (type === "remove") {
        state.todoData = {
          modalOpen: modalOpen,
          dueDate: "",
          flag: "",
          priority: "",
          title: "",
        };
      } else {
        (state.todoData.modalOpen = modalOpen),
          (state.todoData.dueDate = dueDate
            ? new Date(dueDate).toISOString()
            : "");
        state.todoData.flag = flag ? flag : "Low";
        state.todoData.priority = priority ? priority : 1;
        state.todoData.title = title;
      }
    },

    setAllTodoData: (state, action) => {
      if (action.payload?.type === "remove") {
        if (
          action.payload?.index >= 0 &&
          action.payload?.index < state.allTodoData.length
        ) {
          state.allTodoData.splice(action.payload?.index, 1);
        }
      } else if (action.payload?.type === "removeAll") {
        state.allTodoData = [];
      } else {
        state.allTodoData.push(action.payload);
        state.todoData = {
          dueDate: "",
          flag: "",
          priority: null,
          title: "",
        };
      }
    },

    setSearch: (state, action) => {
      const { data } = action.payload;
      state.search = data;
    },

    setCardSearch: (state, action) => {
      const { data } = action.payload;
      state.cardSearch = data;
    },

    setProjectFilter: (state, action) => {
      const { data } = action.payload;

      state.projectFilters = [...data];
    },

    setFilterVariables: (state, action) => {
      const { data, type } = action.payload;

      state[type] = data;
    },

    setOpenCreateProjectDrawer: (state, action) => {
      const { value } = action.payload;
      state.openCreateProjectDrawer = value;
    },

    setOpenCreateCardDrawer: (state, action) => {
      const { value } = action.payload;
      state.openCreateCardDrawer = value;
    },

    setOpenCardDetailsModal: (state, action) => {
      const { value } = action.payload;
      state.cardDetailsModal = value;
    },

    //todo
    setTodoModal: (state, action) => {
      const { value } = action.payload;
      state.todoModal = value;
    },

    setDeleteTodoModal: (state, action) => {
      const { value, todoId } = action.payload;
      state.deleteTodoModal = value;
      state.deleteTodoId = todoId;
    },

    //attachment
    setAttachmentModal: (state, action) => {
      const { value } = action.payload;
      state.attachmentModal = value;
    },

    setDeleteAttachmentModal: (state, action) => {
      const { value, attachmentId } = action.payload;
      state.deleteAttachmentModal = value;
      state.deleteAttachmentId = attachmentId;
    },

    setProjectFiltersHeight: (state, action) => {
      const { height } = action.payload;
      return {
        ...state,
        filtersHeight: height,
      };
    },

    setProjectBoard: (state, action) => {
      const { value } = action.payload;
      state.projectBoard = value;
    },
    setSelectedCardDetails: (state, action) => {
      const { data } = action.payload;
      state.selectedCardDetails = data;
    },

    setSelectedCardUpdateDetails: (state, action) => {
      state.selectedCardDetails = action.payload;
    },

    UploadImageLoader: (state, action) => {
      state.createProjectLoader = action?.payload;
    },

    //Create and Delete Attachments
    createRemoveProjectAttachment: (state, action) => {
      if (action?.payload?.type === "add") {
        const newAttachment = action.payload.attachments;
        state.attachments.push(newAttachment);
      } else if (action.payload?.type === "removeAll") {
        state.attachments = [];
      } else {
        const attachmentToRemove = action.payload;
        state.attachments = state.attachments.filter(
          (_, index) => index !== attachmentToRemove
        );
      }
    },

    //image update
    setUploadImageFile: (state, action) => {
      state.uploadImageFile = action.payload;
    },

    //attachment update
    setUploadedAttachmentFiles: (state, action) => {
      state.uploadedAttachmentFiles = action.payload;
    },

    setAllUploadedAttachmentFiles: (state, action) => {
      state.allUploadedAttachmentFiles = action.payload;
    },

    // project update
    setUpdateProject: (state, action) => {
      state.projectDetails[0] = action.payload;
    },

    setUpdateCreateProject: (state, action) => {
      const { data } = action.payload;
      state.createProjectData = data;
    },

    //assign to
    setAssignProject: (state, action) => {
      state.assignProject = action.payload;
    },
  },
  extraReducers: {},
});

export const {
  setPageSize,
  setFilterVariables,
  setProjectFilter,
  setProjectSort,
  setOpenCreateProjectDrawer,
  setOpenCreateCardDrawer,
  setProjectFiltersHeight,
  setOpenCardDetailsModal,
  setSelectedCardDetails,
  setSelectedCardUpdateDetails,
  setProjectBoard,
  setTodoData,
  setAllTodoData,
  setUpdateProject,
  setUploadImageFile,
  setUploadedAttachmentFiles,
  setAllUploadedAttachmentFiles,
  createRemoveProjectAttachment,
  setAttachmentModal,
  setDeleteAttachmentModal,
  setTodoModal,
  setDeleteTodoModal,
  setUpdateCreateProject,
  UploadImageLoader,
  clearProjectNetwork,
  setAssignProject,
  setSearch,
  setCardSearch,
  //from here extra-reducer convert to reducer
  createProjectCard,
  updateProjectCard,
  deleteProjectCard,
  updateCardMembers,
  createProjectAttachment,
  deleteProjectAttachment,
  createCardAttachment,
  deleteCardAttachment,
  createTodo,
  updateVendor,
  updateVendorRating,
} = projectSlice.actions;

export default projectSlice.reducer;
