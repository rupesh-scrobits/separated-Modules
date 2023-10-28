import {
  Button,
  Checkbox,
  notification,
  Popconfirm,
  Popover,
  Select,
  Skeleton,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import styles from "../../../styles/components-style/ProposalMaker.module.css";
import jsPDF from "jspdf";
import { useDispatch } from "react-redux";
import {
  DragOutlined,
  SnippetsFilled,
  FileTextFilled,
} from "@ant-design/icons";
import AddTagModal from "./AddTagModal";
import {
  addLineBreaks,
  clearEmailDetailsState,
  createProposal,
  deleteMetaTag,
  saveDataAndSendMail,
  setIsNewMetaTag,
  setPagesOfProposal,
  setProposalEdit,
  setProposalId,
  setReArrangedTags,
  updateModalStates,
} from "../../../redux/features/ProposalMakerSlice";
import { useSelector } from "react-redux";
import { handleTagsSelect } from "../../../redux/features/ProposalMakerSlice";
import { Link, useParams } from "react-router-dom";
import AddTemplatePopup from "./AddDraftOrTemplatePopup";
import SendMailPopup from "./SendMailPopup";
import { proposalMaker } from "../../../utilities/icons/Icons";
import { proposalTemplates } from "../../../DummyData/dummyData";

const ProposalMaker = (props) => {
  const [api, contextHolder] = notification.useNotification();
  const [metaTagsHeader, setMetaTagsHeader] = useState();
  const [totalPageHeight, setTotalPageHeight] = useState();
  const { proposalId } = useParams();
  const [downloadFileLoader, setDownloadFileLoader] = useState(false);

  /*********************Drag and Drop States********************/
  const [arrangeState, setArrangeState] = useState(false);
  const reportTemplateRef = useRef(null);
  const dragItem = useRef();
  const dragOverItem = useRef();

  /*********************Modal/Popover States********************/
  const [openPopover, setOpenPopover] = useState(false);

  /*************************Redux States************************/
  const dispatch = useDispatch();
  const {
    proposalGenericTemplate,
    proposalTemplateLoader,
    staticProposalToCompare,
    emailDetails,
    modalStates,
    pages,
  } = useSelector((state) => {
    return state.feature.ProposalMaker;
  });

  /********************Drag/Drop Functions**********************/
  const dragStart = (position) => {
    dragItem.current = position;
    // dragItem.current = null;
  };

  const dragEnter = (position) => {
    dragOverItem.current = position;
    // dragOverItem.current = null;
  };

  const drop = () => {
    const items = [...proposalGenericTemplate?.proposalJSON];
    const dragItemContent = items[dragItem.current];
    items.splice(dragItem.current, 1);
    items.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    dispatch(setReArrangedTags({ items }));
    // setIsDragStarted(-1);
  };

  /*************Select/De-Select MetaTags Handler***************/
  const handleSelectTags = (checkState, tag) => {
    dispatch(handleTagsSelect({ checkState, tag }));
  };

  /*****************Print Proposal Functions********************/

  function blobToFile(theBlob, fileName) {
    return new File([theBlob], fileName, {
      lastModified: new Date().getTime(),
      type: theBlob.type,
    });
  }

  const handleGeneratePdf = async () => {
    setDownloadFileLoader(true);
    const doc = new jsPDF({
      format: "a2",
      unit: "px",
      orientation: "p",
    });
    doc.setFont("helvetica");
    doc.html(reportTemplateRef.current, {
      callback: (doc) => {
        window.open(doc.output("bloburl"), "_blank");
        setDownloadFileLoader(false);
      },
    });
  };

  const handleGeneratePdfForMail = async () => {
    const doc = new jsPDF({
      format: "a2",
      unit: "px",
      orientation: "p",
    });

    let file;
    // Adding the fonts.
    doc.setFont("Helvetica", "sans-serif");
    await doc.html(reportTemplateRef.current, {
      callback: (doc) => {
        file = doc.output("blob");
        const finalFile = {
          proposalPdf: blobToFile(file, "proposal"),
        };
        dispatch(
          saveDataAndSendMail({
            emailDetails,
            file: finalFile,
            proposalData: proposalGenericTemplate,
          })
        );
      },
    });

    dispatch(clearEmailDetailsState());
  };

  /*****************Modal/Popover Functions*********************/
  const showModal = (data, id) => {
    dispatch(setProposalEdit(data));
    dispatch(updateModalStates({ isEditModalOpen: id }));
    dispatch(setIsNewMetaTag(false));
  };

  const handleOpenChange = (newOpen) => {
    setOpenPopover(newOpen);
  };

  const handleCancel = () => {
    dispatch(updateModalStates({ isEditModalOpen: -1 }));
  };

  const handleTemplateNameModalCancel = () => {
    dispatch(updateModalStates({ openTemplateNameModal: false }));
  };

  const handleEmailSharePopup = () => {
    dispatch(updateModalStates({ openEmailSendModal: true }));
  };

  // ************line break****************
  const lineBreakIncHandler = (id, lineBreaks) => {
    dispatch(
      addLineBreaks({
        id: id,
        lineBreaks: lineBreaks + 1,
      })
    );
    pagesHandler();
  };

  const lineBreakDecHandler = (id, lineBreaks) => {
    if (lineBreaks > 0) {
      dispatch(
        addLineBreaks({
          id: id,
          lineBreaks: lineBreaks - 1,
        })
      );
    }
    pagesHandler();
  };

  // ****************************************

  const handleEmailCancel = () => {
    dispatch(updateModalStates({ openEmailSendModal: false }));
  };

  /*****************MetaTags CRUD Operations********************/

  const handleAddTag = () => {
    dispatch(updateModalStates({ isEditModalOpen: true }));
    dispatch(setIsNewMetaTag(true));
    dispatch(setProposalEdit({ title: "", description: "" }));
  };

  const deleteTag = (data) => {
    dispatch(deleteMetaTag({ data }));
  };

  const handleArrange = (state) => {
    setArrangeState(state);
  };

  const saveAs = (type, id, data) => {
    if (type === "template") {
      if (
        JSON.stringify(staticProposalToCompare) ===
        JSON.stringify(proposalGenericTemplate)
      ) {
        // dispatch(
        //   updateProposalById({
        //     id,
        //     data: {
        //       ...data,
        //       proposalJSON: data?.proposalJSON?.map((data, index) => {
        //         return {
        //           ...data,
        //           id: index,
        //           description:
        //             data?.description +
        //             Array(data?.lineBreaks)
        //               .fill("<br/>")
        //               .toString()
        //               .replaceAll(",", ""),
        //         };
        //       }),
        //     },
        //   })
        // );
        dispatch(
          createProposal({
            data,
            // dataToUpdate: {
            //   isDraft: 0,
            //   templateName: data?.templateName,
            // },
          })
        );
      }
    } else if (type === "draft") {
      if (
        JSON.stringify(staticProposalToCompare) ===
        JSON.stringify(proposalGenericTemplate)
      ) {
        dispatch(
          createProposal({
            data,
            // dataToUpdate: {
            //   isDraft: 1,
            //   templateName: null,
            // },
          })
        );
      }
    }
  };

  const handleTemplateSelect = (id) => {
    dispatch(setProposalId(id));
  };

  const pagesHandler = () => {
    if (metaTagsHeader + totalPageHeight > pages.nextHeightBreakPoint) {
      dispatch(
        setPagesOfProposal({
          nextHeightBreakPoint: pages.nextHeightBreakPoint + 1250,
        })
      );
      dispatch(
        setPagesOfProposal({
          pageArray: [...pages.pageArray, "page"],
        })
      );
    } else if (metaTagsHeader + totalPageHeight < pages.nextHeightBreakPoint) {
      dispatch(
        setPagesOfProposal({
          nextHeightBreakPoint: pages.nextHeightBreakPoint - 1250,
        })
      );
      let arr = [...pages.pageArray];
      arr.splice(arr.length - 1, 1);
      dispatch(
        setPagesOfProposal({
          pageArray: arr,
        })
      );
    } else if (metaTagsHeader + totalPageHeight < 1250) {
      dispatch(
        setPagesOfProposal({
          nextHeightBreakPoint: 1250,
        })
      );
      dispatch(
        setPagesOfProposal({
          pageArray: ["page1"],
        })
      );
    }
  };

  useEffect(() => {
    if (window.location.href?.includes("new")) {
      dispatch(setProposalId(10));
    } else {
      dispatch(setProposalId(proposalId));
    }
  }, []);

  useEffect(() => {
    const pageHeight =
      proposalGenericTemplate?.proposalJSON
        ?.filter((record) => {
          return record?.isActive;
        })
        ?.map((data, index) => {
          return document?.getElementById(index)?.offsetHeight;
        })
        ?.reduce((a, b) => a + b, 0) + 120;

    const headerHeight =
      document?.getElementById("metaTagsHeader")?.offsetHeight +
      document?.getElementById("metaTagDivider")?.offsetHeight;
    setMetaTagsHeader(headerHeight);
    setTotalPageHeight(pageHeight);
    pagesHandler();
  }, [proposalGenericTemplate]);

  return (
    <div className={styles.homepageWrapper}>
      {contextHolder}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Link to="/proposalmaker/allproposals">
          <Button>All proposal</Button>
        </Link>
      </div>
      <div className={styles.homepageMetaAndPreview}>
        <div className={styles.homepageMetaTags}>
          <div className={styles.homepageMetaTagsTitle}>
            <div className={styles.selectFromTemplate}>
              <label htmlFor="templates">Select template</label>
              <Select
                id="templates"
                style={{
                  width: 270,
                }}
                defaultActiveFirstOption
                options={[
                  ...proposalTemplates?.map((template) => {
                    return {
                      value: template?.id,
                      label: template?.templateName,
                    };
                  }),
                ]}
                onChange={(value) => {
                  handleTemplateSelect(value);
                }}
              />
            </div>
            <div className={styles.homepageMetaTagsActions}>
              <button className={styles.AddTag} onClick={handleAddTag}>
                {proposalMaker.addIcon}
                Add Tag
              </button>
              <button
                onClick={() => {
                  handleArrange(!arrangeState);
                }}
                className={
                  !arrangeState
                    ? styles.ArrangeTag
                    : `${styles.ArrangeTag} ${styles.SelectOn}`
                }
              >
                <DragOutlined
                  style={{ paddingRight: "7px", fontSize: "17px" }}
                />
                Arrange
              </button>
            </div>
            <h3>Select Tags for Proposal</h3>
          </div>
          <div
            className={
              arrangeState
                ? styles.homepageSelectSectionActive
                : styles.homepageSelectSection
            }
          >
            {proposalTemplateLoader ? (
              <div
                direction="vertical"
                size={"large"}
                style={{ margin: "2% 0%", width: "100%" }}
              >
                <Skeleton.Input
                  style={{ margin: "5% 0%" }}
                  active={true}
                  size={"large"}
                ></Skeleton.Input>
                <Skeleton.Input
                  style={{ margin: "5% 0%" }}
                  active={true}
                  size={"large"}
                ></Skeleton.Input>
                <Skeleton.Input
                  style={{ margin: "5% 0%" }}
                  active={true}
                  size={"large"}
                ></Skeleton.Input>
                <Skeleton.Input
                  style={{ margin: "5% 0%" }}
                  active={true}
                  size={"large"}
                ></Skeleton.Input>
                <Skeleton.Input
                  style={{ margin: "5% 0%" }}
                  active={true}
                  size={"large"}
                ></Skeleton.Input>
                <Skeleton.Input
                  style={{ margin: "5% 0%" }}
                  active={true}
                  size={"large"}
                ></Skeleton.Input>
                <Skeleton.Input
                  style={{ margin: "5% 0%" }}
                  active={true}
                  size={"large"}
                ></Skeleton.Input>
                <Skeleton.Input
                  style={{ margin: "5% 0%" }}
                  active={true}
                  size={"large"}
                ></Skeleton.Input>
                <Skeleton.Input
                  style={{ margin: "5% 0%" }}
                  active={true}
                  size={"large"}
                ></Skeleton.Input>
              </div>
            ) : (
              proposalGenericTemplate?.proposalJSON?.map((data, index) => {
                return (
                  <div>
                    <div
                      className={
                        data?.isActive
                          ? styles.homepageSelectSectionGroupActive
                          : styles.homepageSelectSectionGroup
                      }
                      onDragStart={() => dragStart(index)}
                      onDragEnter={() => dragEnter(index)}
                      onDragEnd={drop}
                      // onDragOver={(e) => e.preventDefault()}
                      key={index}
                      draggable={arrangeState}
                      id="drag"
                    >
                      {/* *********arrange component********** */}

                      <div
                        className={
                          arrangeState
                            ? styles.selectionGroupCheckboxLabel
                            : `${styles.selectionGroupCheckboxLabel} ${styles.preventSelect}`
                        }
                        onClick={() => {
                          if (data?.isActive) {
                            handleSelectTags(false, data);
                          } else {
                            handleSelectTags(true, data);
                          }
                        }}
                      >
                        <Checkbox
                          key={index}
                          onChange={(e) => {
                            handleSelectTags(e.target.checked, data);
                          }}
                          checked={data?.isActive}
                        />
                        <label htmlFor={data?.title}>{data?.title}</label>
                      </div>
                      <div className={styles.selectionGroupEdit}>
                        <div
                          style={{
                            paddingRight: "10px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          onClick={() => {
                            showModal(data, data?.id);
                          }}
                        >
                          {proposalMaker.edit}
                        </div>
                        <Popconfirm
                          title={"Sure to delete?"}
                          onConfirm={() => {
                            deleteTag(data);
                          }}
                        >
                          <div
                            style={{
                              paddingRight: "10px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {proposalMaker.delete}
                          </div>
                        </Popconfirm>
                      </div>
                    </div>
                    {/* ***********line break************** */}
                    <div className={styles.lineBreak}>
                      <div styles={styles.lb}>No. of line breaks</div>

                      <div className={styles.moveCounter}>
                        <div className={styles.counter}>{data?.lineBreaks}</div>
                        <div
                          className={styles.ArrowUp}
                          onClick={() =>
                            lineBreakIncHandler(data?.id, data?.lineBreaks)
                          }
                        >
                          {proposalMaker.arrowDown}
                        </div>
                        <div
                          className={styles.ArrowDown}
                          onClick={() =>
                            lineBreakDecHandler(data?.id, data?.lineBreaks)
                          }
                        >
                          {proposalMaker.arrowUp}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className={styles.homepageFilePreview}>
          <div className={styles.downloadShareButtons}>
            <h3>Proposal Preview</h3>
            <div className={styles.buttonsSection}>
              {/* ******share button******** */}

              <div
                onClick={() => {
                  handleEmailSharePopup();
                }}
                title="Share"
                loading={downloadFileLoader}
                className={styles.proposalShareButton}
              >
                {proposalMaker.share}
              </div>

              {/* *******save button********* */}
              <Popover
                overlayInnerStyle={{
                  borderRadius: "10px",
                  width: "200px",
                }}
                content={
                  <div className={styles.savePopoverContent}>
                    <Button
                      type="primary"
                      shape="round"
                      icon={<SnippetsFilled />}
                      onClick={() => {
                        dispatch(
                          updateModalStates({
                            openTemplateNameModal: "draft",
                          })
                        );
                      }}
                    >
                      Save as draft
                    </Button>
                    <Button
                      type="primary"
                      shape="round"
                      icon={<FileTextFilled />}
                      onClick={() => {
                        dispatch(
                          updateModalStates({
                            openTemplateNameModal: "template",
                          })
                        );
                      }}
                    >
                      Save as template
                    </Button>
                  </div>
                }
                trigger="hover"
                open={openPopover}
                onOpenChange={handleOpenChange}
                placement={"left"}
              >
                <div className={styles.saveButton}>{proposalMaker.save}</div>
              </Popover>

              {/* ********download button********* */}
              <div
                onClick={() => {
                  handleGeneratePdf();
                }}
                title="Download"
                loading={downloadFileLoader}
                className={styles.proposalDownloadButton}
              >
                {proposalMaker.download}
              </div>
            </div>
          </div>
          <div
            className={styles.homepageFilePreviewSection}
            style={{ height: "1250px" }}
          >
            <div
              className={styles.proposalsPreviewHeader}
              id={"metaTagsHeader"}
              ref={reportTemplateRef}
            >
              <div className={styles.headerImageDiv}>
                <img src="/assets/SDF_Logo_Transparent.png" />
              </div>
              <div className={styles.previewHeaderAddress}>
                <p>
                  Address: 162A, Anand 5, Pande Layout, Near Khamla Square,
                  Nagpur - 440025
                </p>
                <p>Email: avinash.nikash@sadigital.in, ak@sadigital.in</p>
              </div>
            </div>
            <div
              className={styles.proposalsPreviewDivider}
              id={"metaTagDivider"}
            ></div>
            {proposalGenericTemplate?.proposalJSON
              ?.filter((data) => {
                return data?.isActive;
              })
              ?.map((data, index) => {
                return (
                  <div className={styles.previewTag} id={index}>
                    <h2>{data?.title}</h2>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data?.description,
                      }}
                    ></div>
                    {Array(data?.lineBreaks)
                      .fill(0)
                      .map((data) => {
                        return <br />;
                      })}
                  </div>
                );
              })}
          </div>
          {metaTagsHeader + totalPageHeight < 1250 ? (
            <></>
          ) : (
            pages?.pageArray?.map((data, index) => {
              return (
                <div
                  className={styles.homepageFilePreviewSection}
                  style={{ height: "1250px", marginTop: "2%" }}
                ></div>
              );
            })
          )}
        </div>
      </div>

      <AddTagModal
        isEditModalOpen={modalStates?.isEditModalOpen !== -1}
        handleCancel={handleCancel}
      />
      <AddTemplatePopup
        openTemplateNameModal={modalStates?.openTemplateNameModal}
        handleCancel={handleTemplateNameModalCancel}
        saveAs={saveAs}
      />
      <SendMailPopup
        openEmailSendModal={modalStates?.openEmailSendModal}
        handleCancel={handleEmailCancel}
        sendMail={handleGeneratePdfForMail}
      />
    </div>
  );
};

export default ProposalMaker;
