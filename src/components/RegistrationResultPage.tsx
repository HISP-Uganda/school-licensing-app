import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import QRCode from "qrcode";
import jsPDF from "jspdf";

const RegistrationResultPage: React.FC = () => {
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const qrCodeImageRef = useRef<string | null>(null);

  const data = location.state as {
    trackedEntityInstance: string;
    orgUnitName: string;
    attributes: Array<{
      attribute: string;
      value: string;
    }>;
    certificateType: string;
    enrollments?: Array<{
      events: Array<{
        eventDate: string;
      }>;
    }>;
  };

  const dateOfRegistration =
    data.enrollments && data.enrollments.length > 0
      ? new Date(data.enrollments[0].events[0].eventDate).toLocaleDateString()
      : "Unknown Date";

  const schoolName = data.orgUnitName || "Org Unit";

  const registrationNumber = data.attributes.find(
    (attr) => attr.attribute === "G0ctVSaqZb1"
  )?.value;
  const classification = data.attributes.find(
    (attr) => attr.attribute === "v4RdUEG7vbF"
  )?.value;
  const typeOfSchool = data.attributes.find(
    (attr) => attr.attribute === "JlVjlEGmfEr"
  )?.value;
  const schoolGenderType = data.attributes.find(
    (attr) => attr.attribute === "ISwoTh3bcdY"
  )?.value;

  const drawCertificate = (ctx: CanvasRenderingContext2D) => {
    const scaleFactor = 2;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);

    const adjustedPadding = 40;
    const borderColors = ["black", "yellow", "red"];
    const borderWidth = 8;

    borderColors.forEach((color, index) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = borderWidth;
      ctx.strokeRect(
        adjustedPadding + borderWidth * index,
        adjustedPadding + borderWidth * index,
        (ctx.canvas.width - 4 * (adjustedPadding + borderWidth * index)) /
          scaleFactor,
        (ctx.canvas.height - 4 * (adjustedPadding + borderWidth * index)) /
          scaleFactor
      );
    });

    const watermark = new Image();
    watermark.src = "/arms.png";
    watermark.onload = () => {
      ctx.globalAlpha = 0.05;
      ctx.drawImage(
        watermark,
        70,
        70,
        ctx.canvas.width / scaleFactor - 140,
        ctx.canvas.height / scaleFactor - 140
      );
      ctx.globalAlpha = 1;

      // Draw header text
      ctx.font = "30px Arial";
      ctx.fillStyle = "#003366";
      ctx.textAlign = "center";
      ctx.fillText(
        "MINISTRY OF EDUCATION AND SPORTS",
        ctx.canvas.width / (2 * scaleFactor),
        120
      );

      // Center logo under the heading
      const logo = new Image();
      logo.src = "/arms.png"; // Replace with your logo path
      logo.onload = () => {
        const logoSize = 100;
        ctx.drawImage(
          logo,
          (ctx.canvas.width / scaleFactor - logoSize) / 2,
          140,
          logoSize,
          logoSize
        ); // Centered square logo

        ctx.font = "22px Arial";
        ctx.fillStyle = "#000";
        ctx.fillText(
          "The Republic of Uganda",
          ctx.canvas.width / (2 * scaleFactor),
          260
        );

        ctx.font = "italic 24px Arial";
        ctx.fillStyle = "#003366";
        ctx.fillText(
          "Registration Certificate for Private Educational Institution",
          ctx.canvas.width / (2 * scaleFactor),
          300
        );

        ctx.font = "italic 20px Arial";
        ctx.fillStyle = "#000";
        ctx.fillText(
          "This is to authenticate that",
          ctx.canvas.width / (2 * scaleFactor),
          340
        );

        ctx.font = "26px Arial bold";
        ctx.fillStyle = "#000";
        ctx.fillText(schoolName, ctx.canvas.width / (2 * scaleFactor), 380);

        ctx.font = "italic 20px Arial";
        ctx.fillStyle = "#000";
        ctx.fillText(
          "is Registered and classified as per the Education Act, as hereunder:",
          ctx.canvas.width / (2 * scaleFactor),
          420
        );

        const startX = 150;
        const startY = 470;
        const rowHeight = 40;

        ctx.textAlign = "left";
        ctx.font = "bold 20px Arial";
        ctx.fillText("REGISTRATION No.:", startX, startY);
        ctx.fillText("REGISTRATION NAME:", startX, startY + rowHeight);
        ctx.fillText("DATE OF REGISTRATION:", startX, startY + rowHeight * 2);
        ctx.fillText("CLASSIFICATION:", startX, startY + rowHeight * 3);
        ctx.fillText("REMARKS:", startX, startY + rowHeight * 4);

        ctx.font = "20px Arial";
        ctx.fillText(registrationNumber || "PSS/B/292", startX + 300, startY);
        ctx.fillText(schoolName, startX + 300, startY + rowHeight);
        ctx.fillText(dateOfRegistration, startX + 300, startY + rowHeight * 2);
        ctx.fillText(
          classification || "O' & A' LEVEL SECONDARY SCHOOL",
          startX + 300,
          startY + rowHeight * 3
        );
        ctx.fillText(
          `${typeOfSchool || ""}, ${schoolGenderType || ""}`,
          startX + 300,
          startY + rowHeight * 4
        );

        const signature = new Image();
        signature.src = "/signature.png";
        signature.onload = () => {
          ctx.drawImage(signature, 850, 640, 150, 50);
          ctx.font = "20px Arial";
          ctx.fillText("Permanent Secretary", 850, 720);

          if (qrCodeImageRef.current) {
            const qrImage = new Image();
            qrImage.src = qrCodeImageRef.current;
            qrImage.onload = () => {
              ctx.drawImage(
                qrImage,
                ctx.canvas.width / scaleFactor - 200,
                80,
                100,
                100
              );
            };
          }
        };
      };
    };
  };

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        drawCertificate(ctx);
      }

      const qrData = `School: ${schoolName}\nRegistration No.: ${
        registrationNumber || "PSS/B/292"
      }\nDate of Registration: ${dateOfRegistration}\nClassification: ${
        classification || "O' & A' LEVEL SECONDARY SCHOOL"
      }\nRemarks: ${typeOfSchool || ""} ${schoolGenderType || ""}`;
      QRCode.toDataURL(
        qrData,
        { errorCorrectionLevel: "H", width: 150 },
        (error, url) => {
          if (error) {
            console.error(error);
          } else {
            qrCodeImageRef.current = url;
            if (ctx) {
              const img = new Image();
              img.src = url;
              img.onload = () => {
                ctx.drawImage(
                  img,
                  ctx.canvas.width / scaleFactor - 220,
                  60,
                  100,
                  100
                );
              };
            }
          }
        }
      );
    }
  }, [data]);

  const generatePDF = () => {
    const doc = new jsPDF("landscape");
    if (canvasRef.current) {
      const canvasImg = canvasRef.current.toDataURL("image/png", 1.0);
      doc.addImage(canvasImg, "PNG", 0, 0, 297, 210);
      doc.save(`${data.certificateType}-Certificate.pdf`);
    }
  };

  return (
    <div className="results-overlay" onClick={() => window.history.back()}>
      <div
        className="results-content registration-certificate"
        style={{
          maxWidth: "100%",
          margin: "0 auto",
          padding: "20px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
          borderRadius: "10px",
          backgroundColor: "#fff",
          position: "relative",
        }}
      >
        <div
          style={{
            padding: "5px",
            borderRadius: "10px",
            position: "relative",
            backgroundColor: "#ffffff",
          }}
        >
          <canvas
            ref={canvasRef}
            width={1123 * 2}
            height={794 * 2}
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
    </div>
  );
};

export default RegistrationResultPage;
