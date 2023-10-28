import React, { useEffect, useState } from "react";
import { Form, Modal, Table, Button } from "antd";
import tableStyles from "../../../styles/components-style/LeadsTable.module.css";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  getAllProposals,
  setFilterSelected,
} from "../../../redux/features/ProposalMakerSlice";
import useScreenSize from "../../../utilities/commonFunctions/ScreenSize";
import TableColumns from "./TableColumns";
import EditableCell from "./EditableCellTable";
import { FilterProposal, ProposalTableColumn } from "../../../types/makerTypes";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { ColumnsType } from "antd/es/table";

const ProposalsTable: React.FC = () => {
  const screenSize = useScreenSize();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [openActionsPopover, setOpenActionsPopover] = useState(-1);
  const [pageSize, setPageSize] = useState({
    current: 1,
    pageSize: 6,
  });

  const { allProposals, filterSelected } = useAppSelector(
    (state) => state.proposalMaker
  );

  const handleTypeSelect = (val: string) => {
    dispatch(setFilterSelected({ filter: val }));
    setPageSize({ current: 1, pageSize: pageSize.pageSize });
  };

  const cancel = (page: number, pageSize: number) => {
    setPageSize({ current: page, pageSize });
  };



  const onShowSizeChange = (current: number, pageSize: number) => {
    setPageSize({ current, pageSize });
  };

  const filteredData = (filter: string) => {
    let finalData;

    if (filter === "all") {
      finalData = allProposals?.filter((proposal: FilterProposal) => {
        return !proposal?.templateName && !proposal?.isDraft;
      });
    } else if (filter === "template") {
      finalData = allProposals?.filter((proposal: FilterProposal) => {
        return proposal?.templateName;
      });
    } else if (filter === "draft") {
      finalData = allProposals?.filter((proposal: FilterProposal) => {
        return proposal?.isDraft;
      });
    }

    return finalData;
  };

  useEffect(() => {
    dispatch(getAllProposals({ from: 0, count: 10000 }));
  }, []);

  return (
    <div className={tableStyles.leadsTableWrapper}>
      <div className={tableStyles.filterTableDataSelect}>
        <div className={tableStyles.btnns}>
          <Button
            value="all"
            className={
              filterSelected === "all"
                ? tableStyles.subBtnFocused
                : tableStyles.subBtn
            }
            onClick={() => handleTypeSelect("all")}
          >
            All Proposals
          </Button>
          <Button
            value="template"
            className={
              filterSelected === "template"
                ? tableStyles.subBtnFocused
                : tableStyles.subBtn
            }
            onClick={() => handleTypeSelect("template")}
          >
            Templates
          </Button>
          <Button
            value="draft"
            className={
              filterSelected === "draft"
                ? tableStyles.subBtnFocused
                : tableStyles.subBtn
            }
            onClick={() => handleTypeSelect("draft")}
          >
            Drafts
          </Button>
        </div>

        <div className={tableStyles.btn2}>
          <Link to="/proposalmaker/proposaleditor">
            <button className={tableStyles.newTempBtn}>
              <PlusOutlined /> New Proposal
            </button>
          </Link>
        </div>
      </div>
      <Form form={form} component={false}>
        <Table
          bordered
          showHeader={true}
          // title={false}
          // footer={false}
          // expandable={false}
          // rowSelection={false}
          sticky={true}
          tableLayout="fixed"
          scroll={{ x: 1200 }}
          dataSource={filteredData(filterSelected)}
          columns={TableColumns({
            openActionsPopover,
            setOpenActionsPopover,
            proposalType: filterSelected
          })}
          pagination={{
            pageSize: pageSize.pageSize,
            // position: ["none", "bottomCenter"],
            position: ["bottomCenter"],
            onChange: cancel,
            showSizeChanger: true,
            current: pageSize.current,
            showTotal: (total: number, range: [number, number]) => {
              if (screenSize <= 768) {
                return null;
              }
              return `${range[0]}-${range[1]} of ${total} items`;
            },
            onShowSizeChange: onShowSizeChange,
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
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          rowClassName={tableStyles.editableRow}
        />
      </Form>
      <Modal
        title="Modal 1000px width"
        centered
        visible={viewModalOpen}
        onOk={() => setViewModalOpen(false)}
        onCancel={() => setViewModalOpen(false)}
        width={1000}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
    </div>
  );
};

export default ProposalsTable;
