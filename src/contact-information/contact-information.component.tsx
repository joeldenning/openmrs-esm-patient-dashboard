import React from "react";
import { css } from "@emotion/core";
import Parcel from "single-spa-react/parcel";

const contactInformationParcel = () =>
  System.import("@hackathon/patient-address-widget");

export default function ContactInformation(props) {
  return (
    <div
      css={css`
        margin: 70px auto 0 auto;
        width: 900px;
      `}
    >
      {
        <Parcel
          config={contactInformationParcel}
          patientUuid={props.match.params.patientUuid}
        />
      }
    </div>
  );
}
