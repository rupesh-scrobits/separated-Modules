import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const Demo = () => {
  return (
    <div>
      <Link to="/proposalmaker/allproposals">
        <Button>All proposal</Button>
      </Link>
    </div>
  );
};

export default Demo;
