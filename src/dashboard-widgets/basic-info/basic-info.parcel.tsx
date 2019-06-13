import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import dayjs from "dayjs";

function BasicInfoParcel(props: BasicInfoParcelProps) {
  const [patient, setPatient] = React.useState(null);

  React.useEffect(() => {
    const queryParams = `
      custom:(uuid,display,
      identifiers:(identifier,uuid,preferred,location:(uuid,name),
      identifierType:(uuid,name,format,formatDescription,validator)),
      person:(uuid,display,gender,birthdate,dead,age,deathDate,birthdateEstimated,
      causeOfDeath,preferredName:(uuid,preferred,givenName,middleName,familyName),
      attributes,preferredAddress:(uuid,preferred,address1,address2,cityVillage,longitude,
      stateProvince,latitude,country,postalCode,countyDistrict,address3,address4,address5
      ,address6)))
    `.replace(/\s/g, "");

    fetch(`/openmrs/ws/rest/v1/patient/${props.patientUuid}?v=${queryParams}`)
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        } else {
          throw Error(
            `Cannot fetch patient ${props.patientUuid} - server responded with '${resp.status}'`
          );
        }
      })
      .then(patient => {
        setPatient(patient);
      });
  }, []);

  return <>{patient ? renderPatient() : renderLoader()}</>;

  function renderLoader() {
    return <div>Loading...</div>;
  }

  function renderPatient() {
    const birthday = patient.person.birthdate
      ? dayjs(patient.person.birthdate).format("YYYY-MM-DD")
      : "(No birthday";
    return (
      <div>
        {patient.person.display || "(No name)"} -{" "}
        {patient.person.dead ? "Deceased" : "Not deceased"} - {birthday} -{" "}
        {renderIdentifiers()}
      </div>
    );
  }

  function renderIdentifiers() {
    return patient.identifiers
      .map(
        identifier =>
          `${identifier.identifierType.name}: ${identifier.identifier}`
      )
      .join(" - ");
  }
}

type BasicInfoParcelProps = {
  patientUuid: string;
};

export default singleSpaReact({
  React,
  ReactDOM,
  rootComponent: BasicInfoParcel,
  suppressComponentDidCatchWarning: true
});
