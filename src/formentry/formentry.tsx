import React from "react";

import Parcel from "single-spa-react/parcel";
import * as qs from "query-string";

export default function Formentry(props: FormEntryProps) {
  const queryParams = qs.parse(props.location.search);
  const formEntryParcel = () => System.import("@hackathon/formentry-widget");
  return (
    <div>
      {" "}
      <Parcel
        config={formEntryParcel}
        patientUuid={props.match.params.patientUuid}
        formUuid={props.match.params.formUuid}
        encounterTypeUuid={queryParams.encounterTypeUuid}
      />
    </div>
  );
}

type FormEntryProps = {
  location: {
    search: string;
  };
  match: {
    params: {
      patientUuid: string;
      formUuid: string;
    };
  };
};
