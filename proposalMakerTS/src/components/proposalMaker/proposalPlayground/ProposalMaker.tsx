import { useEffect, useRef, useState } from "react";
import { Button, Checkbox, Popconfirm, Popover, Select, Skeleton } from "antd";
import styles from "../../../styles/components-style/ProposalMaker.module.css";
import {
  DragOutlined,
  SnippetsFilled,
  FileTextFilled,
} from "@ant-design/icons";
import {
  addLineBreaks,
  createAndUpdateProposal,
  deleteMetaTag,
  getAllTemplateProposals,
  getProposalById,
  saveDataAndSendMail,
  setIsNewMetaTag,
  setPagesOfProposal,
  setProposalEdit,
  setReArrangedTags,
  updateModalStates,
  updateProposalById,
} from "../../../redux/features/ProposalMakerSlice";
import { handleTagsSelect } from "../../../redux/features/ProposalMakerSlice";
import { Link, useParams } from "react-router-dom";
import AddTagModal from "./AddTagModal";
import SendMailPopup from "./SendMailPopup";
import AddTemplatePopup from "./AddDraftOrTemplatePopup";
import { ProposalData, ProposalTag } from "../../../types/makerTypes";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { proposalMaker } from "../../../utilities/icons/Icons";
import jsPDF from "jspdf";

const ProposalMaker = () => {
  const [metaTagsHeader, setMetaTagsHeader] = useState<number>();
  const [totalPageHeight, setTotalPageHeight] = useState<number>();
  const { proposalId } = useParams() as { proposalId?: number };
  const [downloadFileLoader, setDownloadFileLoader] = useState<boolean>(false);

  /*********************Drag and Drop States********************/
  const [arrangeState, setArrangeState] = useState(false);
  const reportTemplateRef = useRef<HTMLElement | string>(null);
  const dragItem = useRef<number | HTMLElement | null>();
  const dragOverItem = useRef<number | HTMLElement | null>();

  /*********************Modal/Popover States********************/
  const [openPopover, setOpenPopover] = useState(false);

  /*************************Redux States************************/
  const dispatch = useAppDispatch();
  const {
    proposalTemplates,
    proposalGenericTemplate,
    staticProposalToCompare,
    proposalTemplateLoader,
    emailDetails,
    modalStates,
    pages,
  } = useAppSelector((state) => state.proposalMaker);

  /********************Drag/Drop Functions**********************/
  const dragStart = (position: number) => {
    dragItem.current = position;
    // dragItem.current = null;
  };

  const dragEnter = (position: number) => {
    dragOverItem.current = position;
    // dragOverItem.current = null;
  };

  const drop = () => {
    const items = [...proposalGenericTemplate?.proposalJSON];
    const drag = dragItem.current as number;
    const dragOver = dragOverItem.current as number;
    const dragItemContent: ProposalTag = items[drag];
    items.splice(drag, 1);
    items.splice(dragOver, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    dispatch(setReArrangedTags({ items }));
    // setIsDragStarted(-1);
  };

  /*************Select/De-Select MetaTags Handler***************/
  const handleSelectTags = (checkState: boolean, tag: ProposalTag) => {
    dispatch(handleTagsSelect({ checkState, tag }));
  };

  /*****************Print Proposal Functions********************/

  function blobToFile(theBlob: Blob, fileName: string): File {
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
    // Check if reportTemplateRef.current is not null
    if (reportTemplateRef.current) {
      await doc.html(reportTemplateRef.current, {
        callback: (doc) => {
          window.open(doc.output("bloburl"), "_blank");
          setDownloadFileLoader(false);
        },
      });
    } else {
      // Handle the case when reportTemplateRef.current is null
      console.error("reportTemplateRef.current is null");
      setDownloadFileLoader(false);
    }
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
    // Check if reportTemplateRef.current is not null
    if (reportTemplateRef.current) {
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
    } else {
      // Handle the case when reportTemplateRef.current is null
      console.error("reportTemplateRef.current is null");
      // You might want to setDownloadFileLoader(false) here as well
    }

    // dispatch(clearEmailDetailsState());
  };

  /*****************Modal/Popover Functions*********************/
  const showModal = (data: ProposalTag, id: number) => {
    dispatch(setProposalEdit(data));
    dispatch(updateModalStates({ isEditModalOpen: id }));
    dispatch(setIsNewMetaTag(false));
  };

  const handleOpenChange = (newOpen: boolean) => {
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
  const lineBreakIncHandler = (id: number, lineBreaks: number) => {
    dispatch(
      addLineBreaks({
        id: id,
        lineBreaks: lineBreaks + 1,
      })
    );
    pagesHandler();
  };

  const lineBreakDecHandler = (id: number, lineBreaks: number) => {
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

  const deleteTag = (data: ProposalTag) => {
    dispatch(deleteMetaTag({ data }));
  };

  const handleArrange = (state: boolean) => {
    setArrangeState(state);
  };

  const saveAs: (type: string, id: number, data: ProposalData) => void = (
    type,
    id,
    data
  ) => {
    if (type === "template") {
      if (
        JSON.stringify(staticProposalToCompare) ===
        JSON.stringify(proposalGenericTemplate)
      ) {
        dispatch(
          updateProposalById({
            id,
            data: {
              ...data,
              proposalJSON: data?.proposalJSON?.map((data, index) => {
                return {
                  ...data,
                  id: index,
                  description:
                    data?.description +
                    Array(data?.lineBreaks)
                      .fill("<br/>")
                      .toString()
                      .replaceAll(",", ""),
                };
              }),
              isDraft: 0,
            },
          })
        );
      } else {
        dispatch(
          createAndUpdateProposal({
            data,
            dataToUpdate: {
              isDraft: 0,
              templateName: data?.templateName,
            },
          })
        );
      }
    } else if (type === "draft") {
      if (
        JSON.stringify(staticProposalToCompare) ===
        JSON.stringify(proposalGenericTemplate)
      ) {
        dispatch(
          updateProposalById({
            id,
            data: { ...data, isDraft: 1 },
          })
        );
      } else {
        dispatch(
          createAndUpdateProposal({
            data,
            dataToUpdate: {
              isDraft: 1,
              templateName: null,
            },
          })
        );
      }
    }
  };

  const handleTemplateSelect = (id: number) => {
    dispatch(getProposalById(id));
  };

  const pagesHandler = () => {
    if (
      typeof metaTagsHeader === "number" &&
      typeof totalPageHeight === "number"
    ) {
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
      } else if (
        metaTagsHeader + totalPageHeight <
        pages.nextHeightBreakPoint
      ) {
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
    } else {
      console.log(
        "metaTagsHeader or totalPageHeight is not a number (undefined or not a number)"
      );
    }
  };

  useEffect(() => {
    if (window.location.href?.includes("new")) {
      dispatch(getProposalById(10));
    } else {
      if (proposalId !== undefined) {
        dispatch(getProposalById(proposalId));
      } else {
        // Handle the case when proposalId is undefined, e.g., show an error or redirect.
      }
    }
    dispatch(getAllTemplateProposals());
  }, []);

  // useEffect(() => {
  //   const pageHeight =
  //     proposalGenericTemplate?.proposalJSON
  //       ?.filter((record) => {
  //         return record?.isActive;
  //       })
  //       ?.map((_data, index) => {
  //         return document?.getElementById(index)?.offsetHeight;
  //       })
  //       ?.reduce((a, b) => a + b, 0) + 120;

  //   const headerHeight =
  //     document?.getElementById("metaTagsHeader")?.offsetHeight +
  //     document?.getElementById("metaTagDivider")?.offsetHeight;
  //   setMetaTagsHeader(headerHeight);
  //   setTotalPageHeight(pageHeight);
  //   pagesHandler();
  // }, [proposalGenericTemplate]);

  useEffect(() => {
    const proposalJSON = proposalGenericTemplate?.proposalJSON;

    if (proposalJSON) {
      const activeRecords = proposalJSON.filter((record) => record?.isActive);

      const pageHeight =
        activeRecords
          .map((_data, index) => {
            const element = document?.getElementById(index.toString());
            return element?.offsetHeight ?? 0;
          })
          .reduce((a, b) => a + b, 0) + 120;

      const headerElement = document?.getElementById("metaTagsHeader");
      const dividerElement = document?.getElementById("metaTagDivider");

      if (headerElement && dividerElement) {
        const headerHeight = headerElement.offsetHeight;
        const dividerHeight = dividerElement.offsetHeight;

        setMetaTagsHeader(headerHeight);
        setTotalPageHeight(pageHeight);

        pagesHandler();
      }
    }
  }, [proposalGenericTemplate]);

  return (
    <div className={styles.homepageWrapper}>
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
                  ...proposalTemplates?.map(
                    (template: { id: number; templateName: string }) => {
                      return {
                        value: template?.id,
                        label: template?.templateName,
                      };
                    }
                  ),
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
                // direction="vertical"
                // size={"large"}
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
              proposalGenericTemplate?.proposalJSON?.map(
                (data: ProposalTag, index) => {
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
                        <div className={styles.lb}>No. of line breaks</div>

                        <div className={styles.moveCounter}>
                          <div className={styles.counter}>
                            {data?.lineBreaks}
                          </div>
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
                }
              )
            )}
          </div>
        </div>
        <div className={styles.homepageFilePreview}>
          <div className={styles.downloadShareButtons}>
            <h3>Proposal Preview</h3>
            <div className={styles.buttonsSection}>
              {/* ******share button******** */}
              {downloadFileLoader ? (
                <div>Loading...</div>
              ) : (
                <div
                  onClick={() => {
                    handleEmailSharePopup();
                  }}
                  title="Share"
                  className={styles.proposalShareButton}
                >
                  {proposalMaker.share}
                </div>
              )}

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
              {downloadFileLoader ? (
                <div>Loading...</div>
              ) : (
                <div
                  onClick={() => {
                    handleGeneratePdf();
                  }}
                  title="Download"
                  className={styles.proposalDownloadButton}
                >
                  {proposalMaker.download}
                </div>
              )}
            </div>
          </div>
          <div
            className={styles.homepageFilePreviewSection}
            style={{ height: "1250px" }}
          >
            <div
              className={styles.proposalsPreviewHeader}
              id={"metaTagsHeader"}
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
                  <div className={styles.previewTag} key={index}>
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
          {/* {metaTagsHeader + totalPageHeight < 1250 ? (
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
          )} */}
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
