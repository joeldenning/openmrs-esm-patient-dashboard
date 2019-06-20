import React from "react";
import { css } from "@emotion/core";
import Parcel from "single-spa-react/parcel";

const patientInfoParcel = () =>
  import("./patient-info-header/patient-info-header.parcel").then(
    n => n.default
  );

const patientDashboardParcels = [
  () => import("./recent-visits/recent-visits.parcel").then(m => m.default),
  () => import("../formentry/forms-parcel").then(m => m.default),
  () => System.import("@hackathon/relationships-widget"),
  () => System.import("@hackathon/patient-weight-graph"),
  () => System.import("@openmrs/latest-obs-widget"),
  () => System.import("@hackathon/openmrsVitals"),
  () => System.import("@hackathon/diagnosis-widget"),
  () => System.import("@hackathon/patient-address-widget"),
  () => System.import("@hackathon/allergies")
];

export default function DashboardWidgets(props: DashboardWidgetsProps) {
  return (
    <div>
      <div
        className="container-fluid"
        css={css`
          margin: 70px auto 0 auto;
          background-color: #fff;
          padding: 10px 0px 10px 0px;
        `}
      >
        <Parcel
          config={patientInfoParcel}
          patientUuid={props.match.params.patientUuid}
        />
      </div>
      <div
        css={css`
          margin: 70px auto 0 auto;
          width: 900px;
        `}
      >
        {patientDashboardParcels.map((parcel, i) => (
          <div
            css={css`
              background-color: white;
              border-radius: 5px;
              box-shadow: 0 10px 30px -24px #b3b3b3;
              padding: 16px;
              margin-bottom: 16px;
            `}
            key={i}
          >
            <Parcel
              config={parcel}
              patientUuid={props.match.params.patientUuid}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

type DashboardWidgetsProps = {
  match: {
    params: {
      patientUuid: string;
    };
  };
};
