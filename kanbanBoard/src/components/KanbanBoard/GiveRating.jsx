import React from "react";
import "../../styles/components-style/Kanban.css";
import { useState } from "react";
import { dashboardIcons } from "../../utilities/icons/Icons";
import { Avatar, Drawer, Rate } from "antd";
import styles from "../../styles/components-style/VendorDrawer.module.css";
import vendorstyle from "../../styles/components-style/VendorRating.module.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateVendor, updateVendorRating } from "../../redux/features/projectSlices/ProjectManagementSlice";

const GiveRating = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { allVendors } = useSelector((state) => state.feature.VendorSlice);
  

  const { projectDetails } = useSelector((state) => {
    return state.feature.ProjectSlice;
  });

  const getVendorDataFromProjectDetails = () => {
    const vendorData = [];

    projectDetails?.forEach((project) => {
      if (project?.members && project?.members?.length > 0) {
        project?.members?.forEach((member) => {
          if (member?.name) {
            const vendor = allVendors?.result?.find(
              (vendor) =>
                vendor?.firstName === member?.name.split(" ")[0] &&
                vendor?.lastName === member?.name.split(" ")[1]
            );
            if (vendor) {
              vendorData.push(vendor);
            }
          }
        });
      }
    });

    return vendorData;
  };

  const vendorData = getVendorDataFromProjectDetails();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleChange = (value, vendorId) => {
    dispatch(
      updateVendor({
        data: { rating: value },
        vendorId: vendorId,
      })
    );
    dispatch(updateVendorRating({ vendorId: vendorId, rating: value }));
  };

  return (
    <>
      <button
        className="giveRating"
        onClick={showDrawer}
        style={{ margin: "0px 20px" }}
      >
        Give Rating
      </button>
      <Drawer
        title="Vendor Rating"
        className={styles.drawerHeader}
        placement="right"
        closable={false}
        open={open}
        width={600}
        extra={
          <>
            <span onClick={onClose} style={{ cursor: "pointer" }}>
              {dashboardIcons.close}
            </span>
          </>
        }
      >
        <div className={vendorstyle.vendorPerformance}>
          <p>Rating Based On</p>
          <div className={vendorstyle.vendorPerformanceBtn}>
            <button className={vendorstyle.vendorBtn}>Quality of work</button>
            <button className={vendorstyle.vendorBtn}>Communication</button>
            <button className={vendorstyle.vendorBtn}>Timely completion</button>
          </div>
        </div>

        {vendorData?.map((vendor, index) => {
          return (
            <div className={vendorstyle.starPerformer}>
              <div className={vendorstyle.starHero}>
                <div className={vendorstyle.starText}>
                  <Avatar
                    style={{
                      background: "#" + vendor?.color,
                    }}
                  >
                    {vendor?.firstName?.charAt(0)?.toUpperCase() +
                      vendor?.lastName?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <p>{vendor?.firstName + " " + vendor?.lastName}</p>
                </div>
                <div>
                  <Rate
                    name="rating"
                    allowHalf
                    className={vendorstyle.starRate}
                    value={vendor?.rating}
                    onChange={(value) => handleChange(value, vendor?.id)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </Drawer>
    </>
  );
};

export default GiveRating;
