import React from "react";
import { Button, Input, Popconfirm, Popover } from "antd";
import tableStyles from "../../../styles/components-style/LeadsTable.module.css";
import { CheckOutlined, CloseOutlined, MoreOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  deleteProposalId,
  emptyProposalTemplate,
} from "../../../redux/features/ProposalMakerSlice";
import { tableIcons } from "../../../utilities/icons/Icons";
import moment from "moment";
import useScreenSize from "../../../utilities/commonFunctions/ScreenSize";

export const TableColumns = ({
  openActionsPopover,
  setOpenActionsPopover,
  proposalType,
}) => {
  const screenSize = useScreenSize();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return [
    proposalType === "template"
      ? {
          editable: true,
          width: 0,
        }
      : {
          title: "Proposal Name",
          dataIndex: "proposalName",
          key: "proposalName",
          width: 150,
          fixed: screenSize <= 768 ? "false" : "left",
          render: (text) => <p>{text}</p>,
          inputComponent: <Input />,
        },
    proposalType === "template"
      ? {
          title: "Template Name",
          dataIndex: "templateName",
          key: "templateName",
          editable: true,
          width: 150,
          inputComponent: <Input />,
        }
      : {
          editable: true,
          width: 0,
        },
    {
      title: "Created by",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 150,
      render: (rowData) => <p>{rowData.email}</p>,
      inputComponent: <Input />,
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      editable: true,
      width: 150,
      inputComponent: <Input />,
      render: (rowData) => <span>{moment(rowData).format("DD MMM YYYY")}</span>,
    },
    {
      title: "Actions",
      key: "action",
      width: 100,
      render: (_, record) => {
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

                      dispatch(emptyProposalTemplate());
                    }}
                    icon={tableIcons.view}
                  >
                    View
                  </Button>
                  <Popconfirm
                    title="Confirm Delete?"
                    onConfirm={() =>
                      dispatch(deleteProposalId({ id: record?.id }))
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
};
