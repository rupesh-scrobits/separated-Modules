import React from "react";
import { Input, Popconfirm, Popover, Button } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  deleteProposal,
  // emptyProposalTemplate,
} from "../../../redux/features/ProposalMakerSlice";
import { tableIcons } from "../../../utilities/icons/Icons";
import useScreenSize from "../../../utilities/commonFunctions/ScreenSize";
import tableStyles from "../../../styles/components-style/LeadsTable.module.css";
import {
  ActionsData,
  ProposalTableColumn,
  RowData,
  TableColumnProps,
} from "../../../types/makerTypes";
import { useAppDispatch } from "../../../redux/store";
import { ColumnGroupType, ColumnsType } from "antd/es/table";

function TableColumns({
  openActionsPopover,
  setOpenActionsPopover,
  proposalType,
}: {
  openActionsPopover: number;
  setOpenActionsPopover: React.Dispatch<React.SetStateAction<number>>;
  proposalType: string;
}) {
  const screenSize = useScreenSize();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const columns: ColumnsType<ProposalTableColumn> = [
    proposalType === "template"
      ? {
          title: "Template Name",
          dataIndex: "templateName",
          key: "templateName",
          width: 150,
        }
      : {
          title: "Proposal Name",
          dataIndex: "proposalName",
          key: "proposalName",
          width: 150,
          render: (text) => <p>{text}</p>,
        },
    {
      title: "Created by",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 150,
      render: (rowData: RowData) => <p>{rowData.email}</p>,
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",

      width: 150,

      render: (rowData: string) => (
        <span>{moment(rowData).format("DD MMM YYYY")}</span>
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 100,
      render: (record: ActionsData) => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Popover
              placement="left"
              title={"Actions"}
              open={openActionsPopover === record?.id}
              overlayStyle={{
                width: "150px",
                borderRadius: "4px !important",
              }}
              content={
                <div className={tableStyles.tableActionButtonsStyle}>
                  <Button
                    onClick={() => {
                      navigate(
                        "/proposalmaker/" + record?.id + "/proposaleditor"
                      );
                      // dispatch(emptyProposalTemplate());
                    }}
                    icon={tableIcons.view}
                  >
                    View
                  </Button>
                  <Popconfirm
                    title="Confirm Delete?"
                    onConfirm={() =>
                      dispatch(deleteProposal({ id: record.id }))
                    }
                    overlayStyle={{ width: 200 }}
                    overlayInnerStyle={{ padding: "5%" }}
                  >
                    <Button icon={tableIcons.delete}>Delete</Button>
                  </Popconfirm>
                </div>
              }
            >
              <div
                style={{
                  height: "25px",
                  width: "25px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  openActionsPopover === -1
                    ? setOpenActionsPopover(record?.id)
                    : setOpenActionsPopover(-1);
                }}
              >
                {tableIcons.actionsIcon}
              </div>
            </Popover>
          </div>
        );
      },
    },
  ];

  return columns;
}

export default TableColumns;
