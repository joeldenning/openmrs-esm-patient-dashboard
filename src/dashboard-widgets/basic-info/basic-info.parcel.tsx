import React from 'react'
import ReactDOM from 'react-dom'
import singleSpaReact from 'single-spa-react'

function BasicInfoParcel(props: BasicInfoParcelProps) {
  return (
    <div>
      Basic info about patient
    </div>
  )
}

type BasicInfoParcelProps = {
}

export default singleSpaReact({
  React,
  ReactDOM,
  rootComponent: BasicInfoParcel,
  suppressComponentDidCatchWarning: true,
})