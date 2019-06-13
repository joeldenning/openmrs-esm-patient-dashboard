import React from "react";
import DashboardWidgets from "./dashboard-widgets/dashboard-widgets";

export default function Root(props: RootProps) {
  return <DashboardWidgets />;
}

type RootProps = {};
