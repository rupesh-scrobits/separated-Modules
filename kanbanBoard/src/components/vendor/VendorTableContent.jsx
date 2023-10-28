import React, { useEffect, useState } from "react";
import { Button, Form, Rate, Table, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  setPageSize,
  setSelectedRow,
  setVendorFiltersHeight,
  setVendorSort,
  setVendordataToUpdate,
} from "../../redux/features/projectSlices/VendorSlice";
import { EditableCellAll, EditableRow } from "./VendorManagementCell";
import { VendorTableColumns } from "./VendorTableColumnConstant";
import modalStyles from "../../styles/components-style/ModalStyles.module.css";
import DeleteConfirmModal from "./modals/DeleteConfirmModal";
import { dashboardIcons, tableIcons } from "../../utilities/icons/Icons";
import { setOpenDeleteModal } from "../../redux/features/projectSlices/VendorSlice";


const columns1 = [
  {
    title: "Vendor Name",
    render: (rowData) => {
      return <>{rowData.firstName + " " + rowData.lastName}</>;
    },
    width: 30,
    // fixed: 'left'
  },
  {
    title: "Contact Details",
    render: (rowData) => {
      return (
        <div>
          <span>{rowData?.email === null ? "NA" : rowData?.email}</span>
          <br />
          <span>{rowData.mobile === null ? "NA" : rowData?.mobile}</span>
        </div>
      );
    },
    width: 40,
  },
  {
    title: "Location",
    render: (rowData) => {
      return <div>{rowData?.location === null ? "NA" : rowData?.location}</div>;
    },
    width: 20,
    inputComponent: ({ ...props }) => {
      return <Input id="name" {...props} />;
    },
  },
  {
    title: "No. Of Talents",
    render: (rowData) => {
      return (
        <div>{rowData?.noOfTalents === null ? "NA" : rowData?.noOfTalents}</div>
      );
    },
    width: 20,
    inputComponent: ({ ...props }) => {
      return <Input id="name" {...props} />;
    },
  },
  {
    title: "Rating",

    render: (rowData) => {
      return (
        <div>
          <span>{rowData?.rating === null ? "NA" : rowData?.rating}</span>
          <Rate allowHalf value={3.5} />
        </div>
      );
    },
    width: 40,
  },
  {
    title: "Previously Worked On",
    render: (rowData) => {
      return (
        <div>
          {/* {rowData?.previouslyWorkedOn === null
            ? 'NA'
            : rowData?.previouslyWorkedOn} */}
        </div>
      );
    },
    width: 60,
    inputComponent: ({ ...props }) => {
      return <Input id="name" {...props} />;
    },
  },
  {
    title: "Ongoing Projects",
    render: (rowData) => {
      return (
        <div>
          {/* {rowData?.ongoingProjects === null
            ? 'NA'
            : rowData?.ongoingProjects} */}
        </div>
      );
    },
    width: 60,
  },
];

const components = {
  body: {
    row: EditableRow,
    cell: EditableCellAll,
  },
};

const VendorTableContent = ({ columnField, from }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectionType, setSelectionType] = useState();
  const [editingKey, setEditingKey] = useState("");
  const [openActionsPopover, setOpenActionsPopover] = useState(-1);
  const isEditing = (record) => record.key === editingKey;
  const [api, contextHolder] = notification.useNotification();

  const {
    allVendors,
    getVendorLoader,
    selectRow,
    vendorUpdateObj,
    pageSize,
    search,
  } = useSelector((state) => state.feature.VendorSlice);
  

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      dispatch(setSelectedRow({ data: selectedRows }));
      if (from !== "createCard") {
        if (selectedRows.length === 0) {
          notification.destroy();
        } else {
          notification.destroy();
          openNotification("bottom", selectedRowKeys);
        }
      }
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };

  const openNotification = (placement, rowKeys) => {
    api.info({
      className: "rowSelectionPopup rowSelectionPopupVendor",
      placement,
      onClose: () => {
        dispatch(setRowSelectionStatus({ status: false }));
      },
      duration: 0,
      closeIcon: <>{dashboardIcons.close}</>,
      icon: <></>,
      description: (
        <>
          <div className={modalStyles.rowSelectionModal}>
            <Button
              className={modalStyles.rowSelectionModalBtns}
              icon={tableIcons.delete}
              // loading={deleteConfirmLoader}
              onClick={() => moveToTrash(rowKeys)}
            >
              Move To Trash
            </Button>
          </div>
        </>
      ),
    });
  };

  const moveToTrash = (record) => {
    dispatch(setOpenDeleteModal({ value: true }));
  };

  // there is need to parse some fields before sending to the server
  const parseOrNot = (e) => {
    if (
      e.target.id === "noOfTalents" ||
      e.target.id === "rating" ||
      e.target.id === "category" ||
      e.target.id === "sourceOfVendor" ||
      e.target.id === "level"
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleChange = (e, row) => {
    const newData = [...allVendors?.result];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];

    newData.splice(index, 1, {
      ...item,
      [e.target.id]: parseOrNot(e) ? parseInt(e.target.value) : e.target.value,
    });

    dispatch(setVendorSort({ data: newData }));
    dispatch(
      setVendordataToUpdate({
        update: {
          rowId: row.id,
          data: {
            [e.target.id]: parseOrNot(e)
              ? parseInt(e.target.value)
              : e.target.value,
          },
        },
      })
    );
  };

  const handleSave = () => {
    dispatch(
      updateVendor({
        data: vendorUpdateObj.data,
        vendorId: vendorUpdateObj.rowId,
      })
    );
  };

  const getFilteredData = () => {
    return allVendors?.result
      ?.map((data) => {
        return { ...data, key: data.id };
      })
      .filter((record) => {
        if (
          record?.firstName?.toLowerCase()?.includes(search?.toLowerCase()) ||
          record?.lastName?.toLowerCase()?.includes(search?.toLowerCase())
        ) {
          return record;
        }
      });
  };

  const vendorColumns = VendorTableColumns({
    openActionsPopover,
    setOpenActionsPopover,
  }).map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        title: col.title,
        dataIndex: col.dataIndex,
        editing: isEditing(record),
        inputComponent: col.inputComponent,
        handleSave,
        handleChange,
      }),
    };
  });

  const tablePageChange = (currentPage, pageSize) => {
    const from = (currentPage - 1) * pageSize;
    dispatch(setPageSize({ pageSize }));
    // dispatch(getVendor({ from: from, count: pageSize }));
  };

  useEffect(() => {
    dispatch(
      setVendorFiltersHeight({
        height: document?.getElementById("allContactsFilters")?.offsetHeight,
      })
    );
  }, []);

  return (
    <div style={{ padding: "10px 20px" }}>
      {contextHolder}
      <Form form={form} component={false}>
        <Table
          rowSelection={
            rowSelection
              ? {
                  type: selectionType,
                  ...rowSelection,
                  selectedRowKeys: selectRow?.map((x) => x?.id),
                }
              : null
          }
          columns={columnField === false ? columns1 : vendorColumns}
          dataSource={getFilteredData()}
          loading={getVendorLoader}
          scroll={{
            x: 2200,
            y: 400,
          }}
          pagination={{
            total: allVendors?.count,
            showTotal: (total, range) => `Total ${total} items`,
            position: ["none", "bottomCenter"],
            onChange: tablePageChange,
            showSizeChanger: true,
            pageSize: pageSize,
            pageSizeOptions: [
              "3",
              "10",
              "20",
              "30",
              "40",
              "50",
              "60",
              "70",
              "80",
              "90",
              "100",
            ],
          }}
          components={components}
        />
      </Form>
      {/* <DeleteConfirmModal from={"allVendors"} /> */}
    </div>
  );
};

export default VendorTableContent;
