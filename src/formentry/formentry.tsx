import React from "react";

import Parcel from "single-spa-react/parcel";

export default function Formentry(props: FormEntryProps) {
  const formEntryParcel = () => System.import("@hackathon/formentry-widget");
  return (
    <div>
      {" "}
      <Parcel config={formEntryParcel} />
    </div>
  );
}

type FormEntryProps = {};
