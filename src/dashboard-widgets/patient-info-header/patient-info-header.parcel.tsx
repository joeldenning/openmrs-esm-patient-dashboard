import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import dayjs from "dayjs";
import { css } from "@emotion/core";

function PatientInfoHeaderParcel(props: PatientInfoHeaderParcelProps) {
  const [patient, setPatient] = React.useState(null);
  const [showContactInfo, setShowContactInfo] = React.useState(false);
  const [editAddress, setAddress] = React.useState(false);

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
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw Error(
            `Cannot fetch patient ${props.patientUuid} - server responded with '${res.status}'`
          );
        }
      })
      .then(patient => {
        setPatient(patient);
      });
  }, []);

  return patient ? renderPatient() : renderLoader();

  function renderLoader() {
    return <div>Loading...</div>;
  }

  function renderPatient() {
    const birthday = patient.person.birthdate
      ? dayjs(patient.person.birthdate).format("YYYY-MM-DD")
      : "No birthday";
    return (
      <div
        css={css`
          width: 100%;
          display: inline-block;
        `}
      >
        <h4
          className="mx-3"
          css={css`
            display: inline-block;
          `}
        >
          {patient.person.display || "(No name)"}
        </h4>
        <p
          className="px-1"
          css={css`
            display: inline-block;
          `}
        >
          {patient.person.gender === "M" ? "Male" : "Female"} |{" "}
        </p>
        <p
          className="px-1"
          css={css`
            display: inline-block;
          `}
        >
          {patient.person.age} year(s) |{" "}
        </p>
        <p
          className="px-1"
          css={css`
            display: inline-block;
          `}
        >
          BirthDate: {birthday} |{" "}
        </p>
        <p
          className="px-1"
          css={css`
            display: inline-block;
          `}
        >
          {patient.person.dead ? "Deceased" : "Not deceased"} |{" "}
        </p>
        <p
          className="px-1"
          css={css`
            display: inline-block;
          `}
        >
          {renderIdentifiers()}
        </p>
        {renderActions()}
        {showContactInfo ? renderContactInfo() : null}
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

  function renderActions() {
    return (
      <div
        css={css`
          display: inline-block;
          float: right;
          background: inherit;
        `}
      >
        <button
          type="button"
          onClick={handleOnclickEditPatientInfo}
          className="outlined mx-1"
        >
          <i className="fa fa-pen"></i>
        </button>

        <button
          type="button"
          onClick={handleOnclickContactInfo}
          className="outlined mx-1"
        >
          <i className="fa fa-angle-down"></i>
        </button>
      </div>
    );
  }

  function renderContactInfo() {
    return (
      <div
        css={css`
          border: 2px solid #cbffc9;
          width: 100%;
          padding: 0px 10px;
          background-color: #cbffc9;
          display: inline-block;
        `}
      >
        <p
          className="px-1"
          css={css`
            display: inline-block;
          `}
        >
          Address: {patient.person.preferredAddress.address1} | city:{" "}
        </p>
        <p
          className="px-1"
          css={css`
            display: inline-block;
          `}
        >
          {patient.person.preferredAddress.cityVillage} | State:{" "}
        </p>
        <p
          className="px-1"
          css={css`
            display: inline-block;
          `}
        >
          {patient.person.preferredAddress.stateProvince} | country:{" "}
        </p>
        <p
          className="px-1"
          css={css`
            display: inline-block;
          `}
        >
          {patient.person.preferredAddress.country}{" "}
        </p>
        <button
          css={css`
            display: inline-block;
          `}
          type="button"
          onClick={handleOnclickEditAddress}
          className="filled mx-1"
        >
          <i className="fa fa-pen"></i>
        </button>
      </div>
    );
  }

  function handleOnclickEditPatientInfo(event) {
    const redirect_url = `https://openmrs-spa.org/openmrs/registrationapp/editSection.page?patientId=${props.patientUuid}&sectionId=demographics&appId=referenceapplication.registrationapp.registerPatient&returnUrl=/openmrs/coreapps/clinicianfacing/patient.page?patientId=${props.patientUuid}&`;
    event.preventDefault();
    window.location.href = redirect_url;
  }

  function handleOnclickContactInfo(event) {
    event.preventDefault();
    showContactInfo ? setShowContactInfo(false) : setShowContactInfo(true);
    editAddress ? setAddress(false) : setAddress(true);
  }

  function handleOnclickEditAddress(event) {
    const redirect_pat_url = `https://openmrs-spa.org/openmrs/spa/patient-dashboard/${props.patientUuid}/contact-information`;
    event.preventDefault();
    window.location.href = redirect_pat_url;
  }
}

type PatientInfoHeaderParcelProps = {
  patientUuid: string;
};

type PatientInfoProps = {
  patientUuid: string;
  givenName: string;
  familyName: string;
  middleName: string;
  gender: string;
  birthdate: string;
};

export default singleSpaReact({
  React,
  ReactDOM,
  rootComponent: PatientInfoHeaderParcel,
  suppressComponentDidCatchWarning: true
});
