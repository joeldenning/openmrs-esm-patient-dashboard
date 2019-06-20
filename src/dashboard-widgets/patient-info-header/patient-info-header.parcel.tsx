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
      : "(No birthday";
    return (
      <div
        css={css`
          width: 100%;
          display: inline-block;
        `}
      >
        <h3
          css={css`
            display: inline-block;
          `}
        >
          {patient.person.display || "(No name)"} ,{" "}
        </h3>
        <h5
          css={css`
            display: inline-block;
          `}
        >
          {patient.person.gender === "M" ? "Male" : "Female"} |
        </h5>
        <p
          css={css`
            display: inline-block;
          `}
        >
          {patient.person.age} year(s) | (BirthDate: {birthday}) |{" "}
        </p>
        <p
          css={css`
            display: inline-block;
          `}
        >
          {patient.person.dead ? "Deceased" : "Not deceased"} |{" "}
        </p>
        <p
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
          css={css`
            border: none;
            background-color: inherit;
            font-size: 14px;
            cursor: pointer;
            display: inline-block;
            color: dodgerblue;
          `}
        >
          edit
        </button>
        <button
          type="button"
          onClick={handleOnclickContactInfo}
          css={css`
            border: none;
            background-color: inherit;
            font-size: 14px;
            cursor: pointer;
            display: inline-block;
            color: dodgerblue;
          `}
        >
          show contact info
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
        Address: {patient.person.preferredAddress.address1} | city:{" "}
        {patient.person.preferredAddress.cityVillage} | State:{" "}
        {patient.person.preferredAddress.stateProvince} | country:{" "}
        {patient.person.preferredAddress.country} |
        <button
          type="button"
          onClick={handleOnclickEditAddress}
          css={css`
            border: none;
            background-color: inherit;
            font-size: 14px;
            cursor: pointer;
            display: inline-block;
            color: dodgerblue;
          `}
        >
          edit
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
    const redirect_pat_url = `https://openmrs-spa.org/openmrs/registrationapp/editSection.page?patientId=${props.patientUuid}&sectionId=contactInfo&appId=referenceapplication.registrationapp.registerPatient&returnUrl=/openmrs/coreapps/clinicianfacing/patient.page?patientId=${props.patientUuid}&`;
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
