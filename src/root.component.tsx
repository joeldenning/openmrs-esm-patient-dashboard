import React from "react";
import DashboardWidgets from "./dashboard-widgets/dashboard-widgets";
import { BrowserRouter, Route } from "react-router-dom";

export default function Root(props: RootProps) {
  return (
    <BrowserRouter basename="/openmrs/spa">
      <Route
        path="/patient-dashboard/:patientUuid"
        component={DashboardWidgets}
      />
    </BrowserRouter>
  );
}

type RootProps = {};
