// Import jsPDF library
import { jsPDF } from "jspdf";

// Function to generate the certificate
function generateCertificate(): void {
  // Create a new PDF document
  const doc = new jsPDF();

  // Set font and size
  doc.setFont("times", "normal");
  doc.setFontSize(12);

  // Add borders or lines as needed
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.rect(10, 10, 190, 270); // outer border

  // Add the Ministry of Education and Sports logo or text
  doc.setFontSize(16);
  doc.text("MINISTRY OF EDUCATION AND SPORTS", 45, 30);

  // Add the certificate title
  doc.setFontSize(14);
  doc.setFont("helvetica", "italic");
  doc.text(
    "Registration Certificate for Private Educational Institution",
    25,
    50
  );

  // Add school details
  doc.setFontSize(12);
  doc.text("Serial No. 2595", 150, 65);
  doc.text("This is to certify that", 80, 80);
  doc.setFont("times", "bold");
  doc.text("DA-TALINS PRIMARY SCHOOL", 60, 95);
  doc.setFont("times", "normal");
  doc.text(
    "is Registered and classified as per the Education Act, as hereunder:",
    35,
    110
  );
  doc.text("Registration No.: PRS - 123456", 35, 125);
  doc.text("Date of Registration: 26th April 2023", 35, 140);
  doc.text("School Classification: PRIMARY", 35, 155);
  doc.text("Location: Oyam District", 35, 170);

  // Add signature section
  doc.text("_____________________________", 35, 220);
  doc.text("Permanent Secretary", 70, 230);

  // Save the document
  doc.save("RegistrationCertificate.pdf");
}

// Call the function to generate the certificate
generateCertificate();
