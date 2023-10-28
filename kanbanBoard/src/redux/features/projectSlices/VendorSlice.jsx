import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  COURSES_URLS,
  USER_URLS,
  VENDOR_URLS,
} from "../../../services/URLConstants";
import http from "../../../services/httpService";
import { allVendors } from "../../../components/dummyData";


const vendorSlice = createSlice({
  name: "vendorSlice",
  initialState: {
    vendorNetwork: "",
    allVendors: allVendors, ////// used for kaban board
    userInfo: [],
    vendorFilters: {},
    search: "",
    openCreateVendorDrawer: false,
    createVendorData: {},
    getVendorLoader: false,
    createVendorLoader: false,
    deleteVendorLoader: false,
    filtersHeight: 0,
    vendorUpdateObj: {},
    selectedRowKeys: [],

    //assign project
    selectRow: [], ///////used in kanban board

    // page Size handling states
    pageSize: 10,
    pageNumber: 1,
    pageStart: 0,

    // assign course drawer
    assignCourseDrawer: false,
    assignCourseState: {
      userName: [],
      courseName: "",
      userId: [],
    },
    assignCourseLoader: false,

    // delete modal
    openDeleteModal: false,
    recordToDelete: null,
  },
  reducers: {
    // project update
    setUpdateUser: (state, action) => {
      state.userInfo = action.payload;
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

    //used -------------------

    updateVendorRating: (state, action) => {
      const { vendorId, rating } = action.payload;
      const vendorToUpdate = state.allVendors.find(
        (vendor) => vendor.id === vendorId
      );
      if (vendorToUpdate) {
        vendorToUpdate.rating = rating;
      }
    },

    setSelectedRow: (state, action) => {
      const { data } = action.payload;
      if (data === "removeAll") {
        state.selectRow = [];
      } else {
        state.selectRow = data;
      }
    },

    setSearch: (state, action) => {
      const { data } = action.payload;
      state.search = data;
    },

    setVendorSort: (state, action) => {
      const { data } = action.payload;
      state.allVendors.result = data;
    },

    setVendorFilter: (state, action) => {
      const { data } = action.payload;

      state.vendorFilters = [...data];
    },

    setFilterVariables: (state, action) => {
      const { data, type } = action.payload;

      state.vendorFilters[type] = data;
    },

    setOpenCreateVendorDrawer: (state, action) => {
      const { value } = action.payload;
      state.openCreateVendorDrawer = value;
    },

    setVendorFiltersHeight: (state, action) => {
      const { height } = action.payload;
      state.filtersHeight = height;
    },

    // clear the states of network used for notification
    clearVendorNetwork: (state, action) => {
      state.vendorNetwork = {};
    },

    setVendordataToUpdate: (state, action) => {
      const { update } = action.payload;
      state.vendorUpdateObj = update;
    },

    // assign course to user drawer handler
    setOpenAssignCourse: (state, action) => {
      const { open } = action.payload;
      state.assignCourseDrawer = open;
    },

    // setting state for post request of assign course
    setAssignCourse: (state, action) => {
      const { assignCourse } = action.payload;
      state.assignCourseState = {
        ...state.assignCourseState,
        ...assignCourse,
      };
    },

    // setting state change in username
    setUsernameChange: (state, action) => {
      state.usernameChange = action.payload;
    },

    // clear state of assignCourse
    clearAssignCourseState: (state, action) => {
      state.assignCourseState = {
        userName: [],
        courseName: "",
        userId: "",
      };
    },

    // open delete modal
    setOpenDeleteModal: (state, action) => {
      const { value } = action.payload;
      state.openDeleteModal = value;
    },

    // delete record
    setRecordToDelete: (state, action) => {
      const { record } = action.payload;
      state.recordToDelete = record;
    },
  },
  extraReducers: {},
});

export const {
  setUpdateUser,
  setPageSize,
  setFilterVariables,
  setVendorFilter,
  setVendorSort,
  setOpenCreateVendorDrawer,
  setVendorFiltersHeight,
  clearVendorNetwork,
  setVendordataToUpdate,
  setSelectedRow,
  setSearch,
  setOpenAssignCourse,
  updateVendorRating,
  setAssignCourse,
  setUsernameChange,
  clearAssignCourseState,
  setOpenDeleteModal,
  setRecordToDelete,
} = vendorSlice.actions;

export default vendorSlice.reducer;
