import { Button, Input, Popover, Rate } from 'antd';
import React, { useEffect, useState } from 'react';
import { tableIcons } from '../../utilities/icons/Icons';
import styles from '../../styles/components-style/ContactDetails.module.css';
import tableStyles from '../../styles/components-style/LeadsTable.module.css';
import {
  skillsOptions,
  categoryOptions,
  levelOptions,
  leadSourceOptions
} from '../../utilities/commonFunctions/tableOptions';
import { useDispatch } from 'react-redux';
import {
  setOpenDeleteModal,
  setRecordToDelete
} from '../../redux/features/projectSlices/VendorSlice';
import citiesData from 'all-countries-and-cities-json';

const findLabel = (array, value) => {
  return array.find(record => record.value === parseInt(value))
    .label;
};

export const VendorTableColumns = ({
  openActionsPopover,
  setOpenActionsPopover
}) => {
  const dispatch = useDispatch();
  const [cityOptions, setCityOptions] = useState([]);

  const moveToTrash = rowData => {
    dispatch(setOpenDeleteModal({ value: true }));
    setOpenActionsPopover(-1);
    dispatch(setRecordToDelete({ record: rowData }));
  };

  useEffect(() => {
    const fetchCities = async () => {
      const indianCities = citiesData?.India;
      const formattedCityOptions = indianCities.map(
        (city, index) => ({
          key: index, // Use a unique key, like the index in this case
          label: city,
          value: city
        })
      );
      setCityOptions(formattedCityOptions);
    };

    fetchCities();
  }, []);

  return [
    {
      title: 'Vendor Name',
      width: 150,
      fixed: 'left',
      render: rowData => {
        return <>{rowData.firstName + ' ' + rowData.lastName}</>;
      }
    },
    {
      title: 'Contact Details',
      width: 280,
      render: rowData => {
        return (
          <div>
            <span>{rowData?.email ? rowData?.email : 'NA'}</span>
            <br />
            <span>{rowData.mobile ? rowData?.mobile : 'NA'}</span>
          </div>
        );
      }
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: 100,
      editable: true,
      render: title => {
        return <>{title ? title : 'NA'}</>;
      },
      inputComponent: ({ ...props }) => {
        return <Input id="title" {...props} />;
      }
    },
    {
      title: 'Skills',
      dataIndex: 'skillset',
      render: skillset => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {skillset?.length > 0
              ? skillset?.length > 3
                ? skillset
                    ?.slice(0, 2)
                    .map(skill => <span> {skill.name + ', '}</span>)
                : skillset?.map(skill => (
                    <span> {skill.name + ', '}</span>
                  ))
              : 'NA'}
            <span className={tableStyles.leadsTableTaskLength}>
              {skillset?.length > 2 &&
                `+${skillset?.length - 2} more`}
            </span>
          </div>
        );
      },
      width: 180,
      inputComponent: ({ ...props }) => {
        return (
          <div className={styles.contactFieldsInput}>
            <select {...props} defaultValue={''} id="skillset">
              <option value={''} disabled>
                Select Skill
              </option>
              {skillsOptions?.map(data => {
                return (
                  <option value={parseInt(data?.value)}>
                    <p className={styles.contactFieldsInputp}>
                      {data?.label}
                    </p>
                  </option>
                );
              })}
            </select>
          </div>
        );
      }
    },
    {
      title: 'Location',
      dataIndex: 'location',
      width: 150,
      editable: true,
      render: location => {
        return <div>{location ? location : 'NA'}</div>;
      },
      inputComponent: ({ ...props }) => {
        return (
          <div className={styles.contactFieldsInput}>
            <select {...props} defaultValue={''} id="location">
              <option value={''} disabled>
                Select Location
              </option>
              {cityOptions?.map(data => {
                return (
                  <option value={data?.value}>
                    <p className={styles.contactFieldsInputp}>
                      {data?.label}
                    </p>
                  </option>
                );
              })}
            </select>
          </div>
        );
      }
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      width: 150,
      editable: true,
      render: designation => {
        return <div>{designation ? designation : 'NA'}</div>;
      },
      inputComponent: ({ ...props }) => {
        return <Input id="designation" {...props} />;
      }
    },
    {
      title: 'Expertise',
      dataIndex: 'expertise',
      render: expertise => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {expertise?.length > 0
              ? expertise?.length > 3
                ? expertise
                    ?.slice(0, 2)
                    .map(skill => <span> {skill.name + ', '}</span>)
                : expertise?.map(skill => (
                    <span> {skill.name + ', '}</span>
                  ))
              : 'NA'}
            <span className={tableStyles.leadsTableTaskLength}>
              {expertise?.length > 2 &&
                `+${expertise?.length - 2} more`}
            </span>
          </div>
        );
      },
      width: 180,
      inputComponent: ({ ...props }) => {
        return (
          <div className={styles.contactFieldsInput}>
            <select {...props} defaultValue={''} id="expertise">
              <option value={''} disabled>
                Select Skill
              </option>
              {skillsOptions?.map(data => {
                return (
                  <option value={parseInt(data?.value)}>
                    <p className={styles.contactFieldsInputp}>
                      {data?.label}
                    </p>
                  </option>
                );
              })}
            </select>
          </div>
        );
      }
    },
    {
      title: 'No. of Talents',
      dataIndex: 'noOfTalents',
      width: 130,
      editable: true,
      render: talents => {
        return <div>{talents ? talents : 'NA'}</div>;
      },
      inputComponent: ({ ...props }) => {
        return <Input id="noOfTalents" {...props} />;
      }
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      width: 200,
      render: rating => {
        return (
          <div className={styles.ratingStyle}>
            <span>{rating ? rating : 0}</span>
            <Rate allowHalf value={rating ? rating : 0} />
          </div>
        );
      }
    },
    // {
    //   title: 'Previously Worked On',
    //   width: 180,
    //   editable: true,
    //   render: rowData => {
    //     return (
    //       <div>
    //         NA
    //         {rowData?.previouslyWorkedOn
    //           ? rowData?.previouslyWorkedOn
    //           : 'NA'}
    //       </div>
    //     );
    //   },
    //   inputComponent: ({ ...props }) => {
    //     return <Input id="previousProjects" {...props} />;
    //   }
    // },
    {
      title: 'Category',
      editable: true,
      width: 150,
      render: rowData => {
        return (
          <div>
            {rowData?.category
              ? findLabel(categoryOptions, rowData?.category)
              : 'NA'}
          </div>
        );
      },
      inputComponent: ({ ...props }) => {
        return (
          <div className={styles.contactFieldsInput}>
            <select {...props} defaultValue={''} id="category">
              <option value={''} disabled>
                Select Category
              </option>
              {categoryOptions?.map(data => {
                return (
                  <option value={parseInt(data?.value)}>
                    <p className={styles.contactFieldsInputp}>
                      {data?.label}
                    </p>
                  </option>
                );
              })}
            </select>
          </div>
        );
      }
    },
    {
      title: 'Source Of Vendor',
      dataIndex: 'sourceOfVendor',
      width: 150,
      editable: true,
      render: sourceOfVendor => {
        return (
          <div>
            {sourceOfVendor
              ? findLabel(leadSourceOptions, sourceOfVendor)
              : 'NA'}
          </div>
        );
      },
      inputComponent: ({ ...props }) => {
        return (
          <div className={styles.contactFieldsInput}>
            <select {...props} defaultValue={''} id="sourceOfVendor">
              <option value={''} disabled>
                Select
              </option>
              {leadSourceOptions?.map(data => {
                return (
                  <option value={parseInt(data?.value)}>
                    <p className={styles.contactFieldsInputp}>
                      {data?.label}
                    </p>
                  </option>
                );
              })}
            </select>
          </div>
        );
      }
    },
    {
      title: 'Level',
      dataIndex: 'level',
      editable: true,
      width: 100,
      render: level => {
        return (
          <div>{level ? findLabel(levelOptions, level) : 'NA'}</div>
        );
      },
      inputComponent: ({ ...props }) => {
        return (
          <div className={styles.contactFieldsInput}>
            <select {...props} defaultValue={''} id="level">
              <option value={''} disabled>
                Select
              </option>
              {levelOptions?.map(data => {
                return (
                  <option value={parseInt(data?.value)}>
                    <p className={styles.contactFieldsInputp}>
                      {data?.label}
                    </p>
                  </option>
                );
              })}
            </select>
          </div>
        );
      }
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      width: 120,
      editable: true,
      render: designation => {
        return <div>{designation ? designation : 'NA'}</div>;
      },
      inputComponent: ({ ...props }) => {
        return <Input id="designation" {...props} />;
      }
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      width: 150,
      editable: true,
      render: reference => {
        return <div>{reference ? reference : 'NA'}</div>;
      },
      inputComponent: ({ ...props }) => {
        return <Input id="reference" {...props} />;
      }
    },
    {
      title: 'Interests',
      dataIndex: 'interests',
      width: 100,
      editable: true,
      render: interests => {
        return <div>{interests ? interests : 'NA'}</div>;
      },
      inputComponent: ({ ...props }) => {
        return <Input id="interests" {...props} />;
      }
    },
    {
      title: 'Comm. Expectations',
      dataIndex: 'commericialExpections',
      width: 200,
      editable: true,
      render: commericialExpections => {
        return (
          <div>
            {commericialExpections ? commericialExpections : 'NA'}
          </div>
        );
      },
      inputComponent: ({ ...props }) => {
        return <Input id="commericialExpections" {...props} />;
      }
    },
    {
      title: 'Ongoing Projects',
      width: 150,
      render: rowData => {
        return (
          <div>
            {rowData?.ongoingProjects
              ? rowData?.ongoingProjects?.length
              : '00'}
          </div>
        );
      }
    },
    {
      title: 'Past Projects with Us',
      width: 170,
      render: rowData => {
        return (
          <div>
            {rowData?.previouslyWorkedOn
              ? rowData?.previouslyWorkedOn?.length
              : '00'}
          </div>
        );
      }
    },
    {
      title: 'Action',
      fixed: 'right',
      width: 100,
      render: (_, record) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Popover
              placement="left"
              open={openActionsPopover === record?.id}
              overlayStyle={{
                width: '205px',
                borderRadius: '4px !important'
              }}
              content={
                <div className={tableStyles.tableActionButtonsStyle}>
                  <Button
                    icon={tableIcons.delete}
                    onClick={() => {
                      moveToTrash(record);
                    }}
                  >
                    Move To Trash
                  </Button>
                </div>
              }
            >
              <div
                style={{
                  height: '25px',
                  width: '25px',
                  cursor: 'pointer'
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
      }
    }
  ];
};
