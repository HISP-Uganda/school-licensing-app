import React from "react";

interface CertificateProps {
  formData: {
    emisNumber: string;
    proprietorPhoneNumber: string;
    certificateType: string;
    licenseType: string;
  };
}

const Certificate: React.FC<CertificateProps> = ({ formData }) => {
  return (
    <div className="certificate">
      <h2>Certificate</h2>
      <p>
        EMIS Number: <span>{formData.emisNumber}</span>
      </p>
      <p>
        Proprietor Phone Number: <span>{formData.proprietorPhoneNumber}</span>
      </p>
      <p>
        Type: <span>{formData.certificateType}</span>
      </p>
      {formData.certificateType === "license" && (
        <p>
          License Type: <span>{formData.licenseType}</span>
        </p>
      )}
    </div>
  );
};

export default Certificate;
