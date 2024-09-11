import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CertificateForm from "./components/CertificateForm";
import LicenseResultPage from "./components/LicenseResultPage";
import RegistrationResultPage from "./components/RegistrationResultPage";
import "./styles/App.css";

const App: React.FC = () => {
  return (
    <Router>
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
                This portal provides a convenient way for schools to retriev
                their Licencies certificates and Registration cetificates. It
                helps schoold easily access their certificates in a streamlined
                way.
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
              <p>Phone: 0417 893 600 (General)</p>
              <p>Phone: 0800-377-771 (Toll Free)</p>
              <p>Email: permasec@education.go.ug</p>
            </div>
            <div className="statistics-heading">
              <text className="text-2xl font-bold">Statistics</text>
            </div>
            <div className="statistics">
              <div className="stat">
                <span>120</span>
                <h3>Licensed Schools</h3>
              </div>
              <div className="stat">
                <span>250</span>
                <h3>Registered Schools</h3>
              </div>
            </div>
          </div>
          <div className="right-section">
            <Routes>
              <Route path="/" element={<CertificateForm />} />
              <Route path="/license-results" element={<LicenseResultPage />} />
              <Route
                path="/registration-results"
                element={<RegistrationResultPage />}
              />
            </Routes>
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
    </Router>
  );
};

export default App;
