import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface FormData {
  emisNumber: string;
  proprietorPhoneNumber: string;
  certificateType: string;
}

interface Attribute {
  attribute: string;
  value: string;
}

interface DataValue {
  dataElement: string;
  value: string;
}

interface Event {
  dataValues: DataValue[];
}

interface Enrollment {
  events: Event[];
}

interface TrackedEntityInstance {
  attributes: Attribute[];
  enrollments?: Enrollment[];
  orgUnit: string;
  orgUnitName?: string;
}

const CertificateForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    emisNumber: "",
    proprietorPhoneNumber: "",
    certificateType: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // console.log("Form Data Submitted:", formData);

      const response = await fetch(
        `https://dev.emisuganda.org/emisdev/api/trackedEntityInstances.json?ouMode=ALL&program=eLZQCpspO6P&filter=JpPViCvWOvc:EQ:${formData.emisNumber}&filter=YeKTwVOJgL0:EQ:${formData.proprietorPhoneNumber}&fields=*`,
        {
          method: "GET",
          headers: {
            Authorization: "Basic " + btoa("hisp.albert:Emis@2022"),
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("API Response Status:", response.status);
      const result = await response.json();
      // console.log("API Response Data:", result);

      if (
        result.trackedEntityInstances &&
        result.trackedEntityInstances.length > 0
      ) {
        const matchingInstance: TrackedEntityInstance =
          result.trackedEntityInstances[0];
        // console.log("Matching Instance Found:", matchingInstance);

        let matchingEvent: Event | null = null;

        if (matchingInstance.enrollments) {
          for (const enrollment of matchingInstance.enrollments) {
            for (const event of enrollment.events) {
              const operationStatusElement = event.dataValues.find(
                (dataValue: DataValue) =>
                  dataValue.dataElement === "cFrbSNRAw0r" &&
                  dataValue.value === "School Closed"
              );

              if (operationStatusElement) {
                Swal.fire({
                  icon: "error",
                  title: "School is Closed",
                  text: "Sorry, this school has been closed!",
                });
                setLoading(false);
                return;
              }

              const licenseStatusEvent = event.dataValues.find(
                (dataValue: DataValue) =>
                  dataValue.dataElement === "cEcMw6JqX0e" &&
                  dataValue.value === formData.certificateType
              );

              if (licenseStatusEvent) {
                matchingEvent = event;
                break;
              }
            }
            if (matchingEvent) break;
          }

          if (matchingEvent) {
            // console.log("Matching Event Found:", matchingEvent);
            matchingEvent.dataValues.forEach((dataValue: DataValue) => {
              matchingInstance.attributes.push({
                attribute: dataValue.dataElement,
                value: dataValue.value,
              });
            });

            const orgUnitResponse = await fetch(
              `https://dev.emisuganda.org/emisdev/api/organisationUnits/${matchingInstance.orgUnit}.json`,
              {
                method: "GET",
                headers: {
                  Authorization: "Basic " + btoa("hisp.albert:Emis@2022"),
                  "Content-Type": "application/json",
                },
              }
            );
            const orgUnitResult = await orgUnitResponse.json();
            matchingInstance.orgUnitName = orgUnitResult.displayName;

            // console.log(
            //   "Organization Unit Name:",
            //   matchingInstance.orgUnitName
            // );

            if (formData.certificateType === "Registration") {
              navigate("/registration-results", { state: matchingInstance });
            } else {
              navigate("/license-results", { state: matchingInstance });
            }
          } else {
            // console.log(
            //   "No Matching Certificate or License Type for the selected option."
            // );
            Swal.fire({
              icon: "warning",
              title: "No Match Found",
              text: "No matching Certificate or License information found for this School.",
            });
            setLoading(false);
            return;
          }

          // console.log("Flattened Attributes:", matchingInstance.attributes);
        } else {
          // console.log("No enrollments found for this instance.");
          Swal.fire({
            icon: "warning",
            title: "No Enrollments Found",
            text: "No enrollments found for this instance.",
          });
        }
      } else {
        // console.log("No matching records found for the provided data.");
        Swal.fire({
          icon: "warning",
          title: "No Matching Records",
          text: "No matching records found.",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "School is Closed",
        text: "Sorry your School is closed, Contact Support",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <text className="text-2xl text-red-500 font-bold pb-4">
        Completed your application?{" "}
      </text>
      <text className="text-xl text-green-600 font-bold pb-8">
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
              <option value="First time Licence">License</option>
              <option value="Renewal Licence">License Renewal</option>
              <option value="Registration">Registration</option>
              {/* <option value="Registration Renewal">Registration Renewal</option> */}
            </select>
          </div>

          <div className="button-group">
            <button type="submit" className="generate-btn" disabled={loading}>
              {loading ? "Searching..." : "Generate Certificate"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                setFormData({
                  emisNumber: "",
                  proprietorPhoneNumber: "",
                  certificateType: "",
                })
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <a
        href="https://website.hispuganda.org"
        className="text-xl text-blue-600 font-bold pt-8"
        target="_blank"
        rel="noopener noreferrer"
      >
        Designed by HISP Uganda
      </a>
    </>
  );
};

export default CertificateForm;
