import React from "react";
import { css } from "@emotion/core";
import Parcel from "single-spa-react/parcel";

const patientDashboardParcels = [
    () => import("./basic-info/basic-info.parcel").then(m => m.default),
    () => import("./recent-visits/recent-visits.parcel").then(m => m.default),
    () => import("../formentry/forms-parcel").then(m => m.default),
    () => System.import("@hackathon/relationships-widget"),
    () => System.import("@hackathon/patient-weight-graph"),
    () => System.import("@openmrs/latest-obs-widget"),
    () => System.import("@hackathon/diagnosis-widget")

];

export default function DashboardWidgets(props: DashboardWidgetsProps) {
    return (
        <div
            css={css`
        margin: 76px auto 0 auto;
        width: 500px;
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
    );
}

type DashboardWidgetsProps = {
    match: {
        params: {
            patientUuid: string;
        };
    };
};
