import React, { useState, useEffect } from "react";
import CertificateForm from "./components/CertificateForm";
import "./styles/App.css";

interface FormData {
  emisNumber: string;
  proprietorPhoneNumber: string;
  certificateType: string;
}

const App: React.FC = () => {
  const [licensedSchools, setLicensedSchools] = useState(0);
  const [registeredSchools, setRegisteredSchools] = useState(0);

  const handleFormSubmit = (data: FormData) => {
    console.log(data);
  };

  useEffect(() => {
    setTimeout(() => setLicensedSchools(120), 500);
    setTimeout(() => setRegisteredSchools(250), 1000);
  }, []);

  return (
    <div className="app">
      <div className="header">
        <div className="logo-name">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Coat_of_arms_of_Uganda.svg/1200px-Coat_of_arms_of_Uganda.svg.png"
            alt="Logo"
          />
          <text className="text-3xl font-bold">
            Ministry of Education and Sports, Uganda
          </text>
        </div>
      </div>
      <div className="main-content">
        <div className="diagonal-divider"></div>
        <div className="left-section">
          <div className="welcome">
            <text className="text-2xl font-bold">
              Welcome to the School Licensing Portal
            </text>
            <p>
              This portal provides a convenient way for schools to apply for
              licenses and registration certificates. It offers a streamlined
              process that ensures accuracy and efficiency, helping schools get
              licensed and registered without unnecessary delays. You can track
              the progress of your application, update your information, and
              much more.
            </p>
          </div>
          <div className="instructions">
            <text className="text-2xl font-bold">
              How to Generate the certificate
            </text>
            <ol className="list-decimal ml-6">
              <li>Fill in the EMIS Number.</li>
              <li>Enter the Proprietor Phone Number.</li>
              <li>Click on "Generate Certificate" button.</li>
            </ol>
          </div>
          <div className="support">
            <text className="text-2xl font-bold">Support</text>
            <p>If you need help, please contact us:</p>
            <p>Phone: 0417 893 600 (General)</p>{" "}
            <p>Phone: 0800-377-771 (Toll Free)</p>
            <p>Email: permasec@education.go.ug</p>
          </div>
          <div className="statistics-heading">
            <text className="text-2xl font-bold">Statistics</text>
          </div>
          <div className="statistics">
            <div className="stat">
              <span>{licensedSchools}</span>
              <h3>Licensed Schools</h3>
            </div>
            <div className="stat">
              <span>{registeredSchools}</span>
              <h3>Registered Schools</h3>
            </div>
          </div>
        </div>
        <div className="right-section">
          <CertificateForm onSubmit={handleFormSubmit} />
        </div>
      </div>
      <a
        href="https://hispuganda.org"
        target="_blank"
        rel="noopener noreferrer"
        className="designed-by"
      >
        Designed by HISP Uganda
      </a>
      <div className="ribbon-container">
        <div className="ribbon black"></div>
        <div className="ribbon yellow"></div>
        <div className="ribbon red"></div>
      </div>
    </div>
  );
};

export default App;
