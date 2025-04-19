import React, { useState } from "react";
import { Modal, Button, Form, Alert, Nav } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import { BaseUrl } from "../endpoint/apiUrl";

const KYCUpload = ({ userData }) => {
  const [showModal, setShowModal] = useState(false);
  const [kycDocument, setKycDocument] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [detailsConfirmed, setDetailsConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleDocumentChange = (event) => {
    setKycDocument(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!termsAccepted) {
      setErrorMessage("You must accept the terms and conditions.");
      return;
    }

    if (!detailsConfirmed) {
      setErrorMessage("Please confirm your details before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("kyc_document", kycDocument);
    formData.append("terms_accepted", termsAccepted);
    formData.append("details_confirmed", detailsConfirmed);
    const token = localStorage.getItem("access_token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const response = await axios.post(
        `${BaseUrl}/kyc/upload/`,
        formData,
        config,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.status,
        timer: 2000,
        showConfirmButton: false,
      });

      setSuccessMessage(response.data.status);
      setErrorMessage("");
      setShowModal(false);

      window.location.reload();
    } catch (error) {
      setErrorMessage(error.response?.data?.status || "Something went wrong.");
      setSuccessMessage("");
    }
  };

  return (
    <div>
      <Button
        variant="info"
        className="mb-5 text-start text-white btn btn-lg "
        onClick={() => {
          if (userData?.is_kyc_verified) {
            Swal.fire({
              icon: "info",
              title: "KYC Already Verified",
              text: "You have already uploaded and verified your KYC.",
            });
          } else {
            setShowModal(true);
          }
        }}
      >
        📤 Upload KYC
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload KYC Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFile">
              <Form.Label>Upload Document</Form.Label>
              <Form.Control
                type="file"
                onChange={handleDocumentChange}
                required
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Check
                type="checkbox"
                label="I accept the terms and conditions"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Check
                type="checkbox"
                label="I confirm my details are correct"
                checked={detailsConfirmed}
                onChange={(e) => setDetailsConfirmed(e.target.checked)}
              />
            </Form.Group>

            <Button
              type="submit"
              className="mt-3"
              variant="primary"
              disabled={!termsAccepted || !detailsConfirmed}
            >
              Submit KYC
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default KYCUpload;
