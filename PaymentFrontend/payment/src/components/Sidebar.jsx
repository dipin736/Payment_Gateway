import React, { useState, useEffect } from "react";
import { Button, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import KYCUpload from "./Kycupload";
import { FaBars } from "react-icons/fa";
import Swal from "sweetalert2"; 


const Sidebar = ({ userData }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
    Swal.fire({
      icon: "success",
      title: "Success",
      timer: 2000,
      showConfirmButton: false, 
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Hamburger Icon - only on mobile/tablet */}
      {isMobile && (
        <div
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: "15px",
            left: "15px",
            zIndex: 1100,
            fontSize: "24px",
            color: "black",
          }}
        >
          <FaBars />
        </div>
      )}

      {/* Sidebar */}
      <div
        style={{
          height: "100vh",
          backgroundColor: "#343a40",
          color: "white",
          padding: isSidebarOpen ? "1.5rem 1rem" : "0",
          position: "fixed",
          top: 0,
          left: 0,
          overflowY: "auto",
          transition: "all 0.3s ease-in-out",
          overflow: "hidden",
          zIndex: 1000,
        }}
      >
        {isSidebarOpen && (
          <>
            <h5 className="mb-3">👋 Hi, {userData?.username}</h5>
            <p className="mb-4">
              KYC Status:{" "}
              {userData?.is_kyc_verified ? "✅ Verified" : "❌ Not Uploaded"}
            </p>

            <Nav defaultActiveKey="/dashboard" className="flex-column">
              <Nav.Link
                href="/dashboard"
                style={{ ...linkStyle, marginBottom: "1rem" }}
              >
                🏠 Dashboard
              </Nav.Link>

              {/* Make a Payment Button */}
              <Button
                variant="success"
                className="mb-3 text-start"
                onClick={() => {
                  if (!userData?.is_kyc_verified) {
                    Swal.fire({
                      icon: "warning",
                      title: "KYC Required",
                      text: "Please upload your KYC before making a payment.",
                    });
                  } else {
                    window.location.href = "/initialpayment";
                  }
                }}
              >
                ➕ Make a Payment
              </Button>

              {/* Upload KYC Button */}
              <KYCUpload
                   variant="success"
                className="mb-3 text-start"
                showModal={showModal}
                style={{ ...linkStyle, color: 'white' }}
                userData={userData}
                setShowModal={setShowModal}
              />
             
              <Nav.Link href="#" style={{ ...linkStyle, marginBottom: "1rem" }}>
                📄 Transaction History
              </Nav.Link>

              <Nav.Link href="#" style={{ ...linkStyle, marginBottom: "1rem" }}>
                📊 Generate Report
              </Nav.Link>

              {/* Logout Button */}
              <Button
                variant="danger"
                className="mt-4 text-start"
                onClick={handleLogout}
              >
                🚪 Logout
              </Button>
            </Nav>
          </>
        )}
      </div>
    </>
  );
};

const linkStyle = {
  color: "white",
  marginBottom: "10px",
  fontWeight: "500",
};

export default Sidebar;
