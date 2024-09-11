import React from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const data = location.state as {
    trackedEntityInstance: string;
    orgUnitName: string;
    attributes: Array<{
      attribute: string;
      value: string;
    }>;
    certificateType: string;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`${data.certificateType} Certificate`, 10, 10);
    doc.text(`Organization Unit: ${data.orgUnitName}`, 10, 20);
    data.attributes.forEach((attr, index) => {
      doc.text(`${attr.attribute}: ${attr.value}`, 10, 30 + index * 10);
    });
    doc.save(`${data.certificateType}-Certificate.pdf`);
  };

  return (
    <div className="results-overlay">
      <div className="results-content">
        <h1>{data.certificateType} Certificate</h1>
        <p>
          <strong>Organization Unit:</strong> {data.orgUnitName}
        </p>
        <ul>
          {data.attributes.map((attr, index) => (
            <li key={index}>
              {attr.attribute}: {attr.value}
            </li>
          ))}
        </ul>
        <button
          onClick={generatePDF}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;
