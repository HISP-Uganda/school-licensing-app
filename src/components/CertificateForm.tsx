import React, { useState } from "react";

interface CertificateFormProps {
  onSubmit: (formData: FormData) => void;
}

interface FormData {
  emisNumber: string;
  proprietorPhoneNumber: string;
  certificateType: string;
  licenseType: string;
}

const CertificateForm: React.FC<CertificateFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    emisNumber: "",
    proprietorPhoneNumber: "",
    certificateType: "",
    licenseType: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <text className="text-xl text-red-700	pb-2 font-bold">
        Completed your application?
      </text>
      <text className="text-xl text-green-600	pb-10 font-bold">
        Get your Registration or license certificate now.
      </text>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="emisNumber">
              EMIS Number<span className="required">*</span>
            </label>
            <input
              type="text"
              id="emisNumber"
              name="emisNumber"
              value={formData.emisNumber}
              onChange={handleChange}
              placeholder="Enter EMIS Number"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="proprietorPhoneNumber">
              Proprietor Phone Number<span className="required">*</span>
            </label>
            <input
              type="tel"
              id="proprietorPhoneNumber"
              name="proprietorPhoneNumber"
              value={formData.proprietorPhoneNumber}
              onChange={handleChange}
              placeholder="Enter Phone Number"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="certificateType">Certificate Type</label>
            <select
              id="certificateType"
              name="certificateType"
              value={formData.certificateType}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Certificate Type
              </option>
              <option value="license">License</option>
              <option value="registration">Registration Certificate</option>
            </select>
          </div>
          {formData.certificateType === "license" && (
            <div className="form-group">
              <label htmlFor="licenseType">License Type</label>
              <select
                id="licenseType"
                name="licenseType"
                value={formData.licenseType}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select License Type
                </option>
                <option value="renewal">License Renewal</option>
                <option value="first-time">First Time License</option>
              </select>
            </div>
          )}
          <div className="button-group">
            <button type="submit" className="generate-btn">
              Generate Certificate
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                setFormData({
                  emisNumber: "",
                  proprietorPhoneNumber: "",
                  certificateType: "",
                  licenseType: "",
                })
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <div className="text-xl pt-20 pl-20 font-bold">
        <a
          href="https://hispuganda.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Designed by HISP Uganda
        </a>
      </div>
    </>
  );
};

export default CertificateForm;
