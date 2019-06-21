import React from "react";
import DashboardWidgets from "./dashboard-widgets/dashboard-widgets";
import { BrowserRouter, Route } from "react-router-dom";

import Formentry from "./formentry/formentry";
import ContactInformation from "./contact-information/contact-information.component";

export default function Root(props: RootProps) {
  return (
    <BrowserRouter basename="/openmrs/spa">
      <Route
        path="/patient-dashboard/:patientUuid"
        component={DashboardWidgets}
        exact={true}
      ></Route>
      <Route
        path="/patient-dashboard/:patientUuid/formentry/:formUuid"
        component={Formentry}
      />
      <Route
        path="/patient-dashboard/:patientUuid/contact-information"
        component={ContactInformation}
      />
    </BrowserRouter>
  );
}

type RootProps = {};
