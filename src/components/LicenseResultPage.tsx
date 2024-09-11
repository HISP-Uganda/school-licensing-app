import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import QRCode from "qrcode";

// Define types for the organization unit hierarchy
interface OrgUnitAncestor {
  id: string;
  name: string;
  level: number;
}

interface OrgUnitResponse {
  id: string;
  name: string;
  level: number;
  ancestors: OrgUnitAncestor[];
}

const LicenseResultPage: React.FC = () => {
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [subcountyDistrict, setSubcountyDistrict] =
    useState<string>("Region/District");
  const [orgUnitHierarchy, setOrgUnitHierarchy] = useState<string>("");

  const data = location.state as {
    trackedEntityInstance: string;
    orgUnit: string;
    orgUnitName: string;
    attributes: Array<{
      attribute: string;
      value: string;
    }>;
    certificateType: string;
  };

  const licensingStatus = data.attributes.find(
    (attr) => attr.attribute === "cEcMw6JqX0e"
  )?.value;

  let licenseType = "NO MATCH FOUND";
  if (licensingStatus === "First time Licence") {
    licenseType = "FIRST TIME LICENSE FOR";
  } else if (licensingStatus === "Renewal Licence") {
    licenseType = "RENEWAL OF LICENSE FOR";
  }

  const poBox =
    data.attributes.find((attr) => attr.attribute === "l6MSFpPO2G1")?.value ||
    "[Your Box Number]";

  const attributeNames: { [key: string]: string } = {
    cEcMw6JqX0e: "Licensing Status",
    l6MSFpPO2G1: "PO Box",
    JlVjlEGmfEr: "School Type",
    JpPViCvWOvc: "EMIS Number",
    YeKTwVOJgL0: "Propriator Phone Number",
    XAtFq2ntI9j: "School Name",
    dyuWCSKcCye: "Principal Name",
    Bxv1gEF5cby: "Date of Licensing",
    ISwoTh3bcdY: "School Gender Type",
    cFrbSNRAw0r: "Licensing Status Type",
    v4RdUEG7vbF: "School Status",
    a0DhoB9wNK4: "License Number",
  };

  const getReadableAttributes = () => {
    return data.attributes
      .map((attr) => {
        const name = attributeNames[attr.attribute] || attr.attribute;
        return `${name}: ${attr.value}`;
      })
      .join("\n");
  };

  useEffect(() => {
    const fetchOrgUnitHierarchy = async () => {
      try {
        if (data.orgUnit) {
          console.log("Fetching hierarchy for orgUnit:", data.orgUnit);
          const response = await fetch(
            `https://dev.emisuganda.org/emisdev/api/organisationUnits/${data.orgUnit}.json?fields=id,name,level,ancestors[id,name,level]`,
            {
              headers: {
                Authorization: `Basic ${btoa("hisp.albert:Emis@2022")}`,
              },
            }
          );
          const rawResponseText = await response.text();
          const result: OrgUnitResponse = JSON.parse(rawResponseText);
          console.log("Parsed Org Unit Response:", result);

          const district = result.ancestors.find(
            (ancestor) => ancestor.level === 3
          )?.name;
          const subcounty = result.ancestors.find(
            (ancestor) => ancestor.level === 5
          )?.name;

          setSubcountyDistrict(`${subcounty || ""}/${district || ""}`);

          const hierarchy =
            result.ancestors
              .map((ancestor: OrgUnitAncestor) => ancestor.name)
              .join(" / ") + ` / ${result.name}`;
          setOrgUnitHierarchy(hierarchy);
        } else {
          console.error("orgUnit is undefined or not found in data.");
          setSubcountyDistrict("Region/District");
          setOrgUnitHierarchy("Region/District");
        }
      } catch (error) {
        console.error("Failed to fetch org unit hierarchy:", error);
        setSubcountyDistrict("Region/District");
        setOrgUnitHierarchy("Region/District");
      }
    };

    fetchOrgUnitHierarchy();
  }, [data.orgUnit]);

  const paragraphs = [
    "This is to acknowledge receipt of your application forms submitted in connection with the above subject.",
    `Permission is hereby granted to you to operate the above school on license for another period of one year from ${new Date().toLocaleDateString()} to ${new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    ).toLocaleDateString()}, as you wait to process registration in accordance with section 34 (b)(i) of Education (Pre-Primary, Primary and Post Primary) Act 2008.`,
    "After a period of one year, you are advised to contact your District Education Officer to supply you with the official application forms for Registration, which will be duly filled and submitted to this office for the same.",
    "From now onwards, you should arrange for the Ministry of Education and Sports Officials to visit and inspect your school to make necessary recommendations for registration.",
  ];

  const wrapText = (
    context: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(" ");
    let line = "";

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
    return y + lineHeight;
  };

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const scale = 3;
        canvasRef.current.width = 600 * scale;
        canvasRef.current.height = 850 * scale;
        ctx.scale(scale, scale);

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        const watermark = new Image();
        watermark.src = "/arms.png";
        watermark.onload = () => {
          ctx.globalAlpha = 0.05;
          ctx.drawImage(watermark, 30, 100, 540, 600);
          ctx.globalAlpha = 1;

          ctx.font = "14px Arial";
          ctx.fillStyle = "#000";
          ctx.fillText("Telegram: 'EDUCATION'", 20, 30);
          ctx.fillText("G/Line: 234451", 20, 50);
          ctx.fillText("Fax: 234920", 20, 70);

          const logo = new Image();
          logo.src = "/arms.png";
          logo.onload = () => {
            ctx.drawImage(logo, 275, 15, 50, 50);
          };

          ctx.textAlign = "right";
          ctx.fillText("Ministry of Education and Sports", 580, 30);
          ctx.fillText("Embassy House", 580, 50);
          ctx.fillText("P.O. Box 7063", 580, 70);
          ctx.fillText("Kampala, Uganda", 580, 90);
          ctx.fillText("Website: www.education.go.ug", 580, 110);

          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(20, 120);
          ctx.lineTo(580, 120);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(20, 125);
          ctx.lineTo(580, 125);
          ctx.stroke();

          ctx.textAlign = "left";
          ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 20, 150);
          ctx.fillText(`Ref: ME/P/${data.trackedEntityInstance}`, 20, 165);

          ctx.fillText("The Proprietor (s),", 20, 200);
          ctx.fillText(data.orgUnitName, 20, 215);
          ctx.fillText(`P.O. Box ${poBox}`, 20, 230);
          ctx.fillText(subcountyDistrict || "Region/District", 20, 260);

          ctx.font = "bold 14px Arial";
          const headingText = `RE: ${licenseType} ${data.orgUnitName.toUpperCase()} - ${
            data.attributes
              .find((attr) => attr.attribute === "JlVjlEGmfEr")
              ?.value.toUpperCase() || "DISTRICT"
          }`;
          wrapText(ctx, headingText, 20, 290, 560, 20);

          ctx.font = "12px Arial";
          let yPosition = 320;
          paragraphs.forEach((paragraph) => {
            yPosition = wrapText(ctx, paragraph, 20, yPosition, 560, 20);
            yPosition += 20;
          });

          ctx.fillText("Yours faithfully,", 20, yPosition + 20);
          ctx.fillText("Dr. Cleophus Mugenyi", 20, yPosition + 40);
          ctx.fillText("For: PERMANENT SECRETARY", 20, yPosition + 60);

          const signature = new Image();
          signature.src = "/signature.png";
          signature.onload = () => {
            ctx.drawImage(signature, 20, yPosition + 70, 80, 30);
          };

          const qrData = `${
            data.orgUnitName
          }\n${getReadableAttributes()}\nSchool Location: ${orgUnitHierarchy}`;

          QRCode.toDataURL(
            qrData,
            { errorCorrectionLevel: "H", width: 400, margin: 2 },
            (err, url) => {
              if (err) console.error(err);
              if (url) {
                const qrImage = new Image();
                qrImage.src = url;
                qrImage.onload = () => {
                  ctx.drawImage(qrImage, 400, yPosition + 20, 150, 160);
                };
              }
            }
          );
        };
      }
    }
  }, [data, subcountyDistrict, orgUnitHierarchy]);

  const generatePDF = () => {
    const doc = new jsPDF("portrait");
    if (canvasRef.current) {
      const canvasImg = canvasRef.current.toDataURL("image/png", 1.0);
      doc.addImage(canvasImg, "PNG", 0, 0, 210, 297);
    }
    doc.save(`${data.certificateType}-License-Letter.pdf`);
  };

  return (
    <div className="results-overlay" onClick={() => window.history.back()}>
      <div
        className="results-content"
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          maxWidth: "600px",
          margin: "0 auto",
          fontSize: "12px",
          lineHeight: "1.8",
          color: "#000",
          textAlign: "left",
          position: "relative",
        }}
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={850}
          style={{
            width: "100%",
            height: "auto",
          }}
        />

        <button
          onClick={generatePDF}
          style={{
            display: "block",
            margin: "20px auto",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1.1em",
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default LicenseResultPage;
