import React, { useState } from "react";
import { Avatar, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from "../../styles/components-style/VendorDrawer.module.css";
import { useSelector } from "react-redux";
import { dashboardIcons } from "../../utilities/icons/Icons";
import { useDispatch } from "react-redux";
import { setSelectedRow } from "../../redux/features/projectSlices/VendorSlice";
import VendorTableContent from "../vendor/VendorTableContent";

const AssignProject = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const { selectRow } = useSelector((state) => state.feature.VendorSlice);


  const showModal = () => {
    setOpen(true);
  };

  const onclose = () => {
    setOpen(false);
  };

  const field = false;

  const handleAssign = () => {
    setOpen(false);
  };

  const closeAssign = () => {
    dispatch(setSelectedRow("removeAll"));
  };

  return (
    <>
      <div>
        <div>
          {selectRow && selectRow.length > 0 && (
            <Avatar.Group
              className={`${styles.avatarGroupContainer} avatar-group-container`}
              size="medium"
              maxCount={4}
              maxPopoverPlacement="right"
            >
              {selectRow.map((item, index) => {
                const firstNameInitial = item?.firstName[0]?.toUpperCase();
                const lastNameInitial = item?.lastName[0]?.toUpperCase();
                const initials = firstNameInitial + lastNameInitial;

                return (
                  <Avatar
                    key={index}
                    style={{ backgroundColor: "#" + item?.color }}
                  >
                    {initials}
                  </Avatar>
                );
              })}
            </Avatar.Group>
          )}

          {selectRow && selectRow.length > 0 && (
            <div className={styles.memberContent}>
              <h3 className={styles.memberTexth3}>
                Assigned Vendor
                <span onClick={closeAssign}>{dashboardIcons.close}</span>
              </h3>
              {selectRow.map((item, index) => {
                const firstNameInitial = item.firstName[0]?.toUpperCase();
                const lastNameInitial = item.lastName[0]?.toUpperCase();
                const initials = firstNameInitial + lastNameInitial;

                return (
                  <div key={index} className={styles.memberDetails}>
                    <p className={styles.memberAvatarName}>
                      <Avatar
                        style={{
                          backgroundColor: "#" + item?.color,
                          color: "#fff",
                        }}
                      >
                        {initials}
                      </Avatar>
                      {item.firstName} {item.lastName}
                    </p>
                    <span>{item.title}</span>
                    <span>{item.location}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <p onClick={showModal} className={styles.assignText}>
          <span>{<PlusOutlined />} </span>
          Assign To
        </p>
      </div>
      <Modal
        wrapClassName="AssignVendor"
        open={open}
        onCancel={onclose}
        centered
        footer={
          <button className={styles.footerModal} onClick={handleAssign}>
            Assign
          </button>
        }
        width={1250}
      >
        <div>
          <VendorTableContent columnField={field} from={"createCard"} />
        </div>
      </Modal>
    </>
  );
};

export default AssignProject;
