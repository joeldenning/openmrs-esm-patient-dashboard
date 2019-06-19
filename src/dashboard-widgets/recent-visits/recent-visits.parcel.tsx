import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import dayjs from "dayjs";
import css from "@emotion/css";

function RecentVisitsParcel(props: RecentVisitsProps) {
  const [recentVisit, setRecentVisits] = React.useState(null);

  React.useEffect(() => {
    const queryParams = `custom:(uuid,startDatetime,stopDatetime,encounters:(uuid,encounterType:(uuid,display)))`;

    fetch(
      `/openmrs/ws/rest/v1/visit?patient=${props.patientUuid}&v=${queryParams}&limit=3`
    )
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        } else {
          throw Error(
            `Cannot fetch visits ${props.patientUuid} - server responded with '${resp.status}'`
          );
        }
      })
      .then(recentVisit => {
        setRecentVisits(recentVisit);
      });
  }, []);

  return recentVisit ? renderRecentVisits() : renderLoader();

  function renderLoader() {
    return <div>Loading...</div>;
  }

  function renderRecentVisits() {
    return (
      <div className="test">
        <h3>Recent Visits</h3>
        <table
          css={css`
            border-spacing: 0;
            padding: 5px 10px;
            width: 100%;
            border: 1px solid #dddddd;
          `}
        >
          <tbody>
            {recentVisit.results.map(visit => renderVisitEncounters(visit))}
          </tbody>
        </table>
      </div>
    );
  }

  function renderVisitEncounters(visit) {
    return (
      <tr
        css={css`
          border: 1px solid #dddddd;
        `}
      >
        <td>
          <a href="/">{dayjs(visit.startDatetime).format("YYYY:MM:DD")}</a>
        </td>
        <td>
          <div
            css={css`
              border: 2px solid green;
              font-size: 10px;
              margin-left: 50%;
              padding: 5px;
              position: relative;
            `}
          >
            {visit.encounters
              .map(encounter => {
                return encounter.encounterType.display;
              })
              .join(", ")}
          </div>
        </td>
      </tr>
    );
  }
}

type RecentVisitsProps = {
  patientUuid: string;
};

export default singleSpaReact({
  React,
  ReactDOM,
  rootComponent: RecentVisitsParcel,
  suppressComponentDidCatchWarning: true
});
