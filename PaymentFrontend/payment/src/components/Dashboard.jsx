import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Card,
  Row,
  Col,
  Spinner,
  Container,
  Button,
} from "react-bootstrap";
import Sidebar from "./Sidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../endpoint/apiUrl";

function Dashboard() {
  const [userData, setUserData] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  const exportToCSV = () => {
    const csvRows = [
      ["Date", "Amount", "Currency", "Status", "Method"],
      ...transactions.map((txn) => [
        formatDate(txn.created_at),
        txn.amount,
        txn.currency,
        txn.status,
        txn.method,
      ]),
    ];
    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "transactions.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Transaction Report", 14, 10);
    autoTable(doc, {
      head: [["Date", "Amount", "Currency", "Status", "Method"]],
      body: transactions.map((txn) => [
        formatDate(txn.created_at),
        txn.amount,
        txn.currency,
        txn.status,
        txn.method,
      ]),
    });
    doc.save("transactions.pdf");
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const userRes = await axios.get(`${BaseUrl}/userprofile/`, config);
        setUserData(userRes.data);

        const txnRes = await axios.get(`${BaseUrl}/transactions/`, config);
        setTransactions(txnRes.data);
        const paid = txnRes.data
          .filter((txn) => txn.status === "success")
          .reduce((sum, txn) => sum + Number(txn.amount), 0);

        const pending = txnRes.data
          .filter((txn) => txn.status !== "success")
          .reduce((sum, txn) => sum + Number(txn.amount), 0);

        setTotalPaid(paid);
        setTotalPending(pending);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
   
    };
    return new Date(date).toLocaleString("en-IN", options);
  };

  return (
    <>
      <Sidebar userData={userData} />
      <div
        className="container"
        style={{
          display: "flex",
          overflowX: "auto",
          flexWrap: "nowrap",
          width: "100%",
        }}
      >
        <div className="dashboard-content">
          <Container>
            <Row className="mb-4">
              <Col md={4}>
                <Card bg="info" text="white">
                  <Card.Body>
                    <Card.Title>Total Transactions</Card.Title>
                    <Card.Text>{transactions.length}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card bg="success" text="white">
                  <Card.Body>
                    <Card.Title>Last Payment Date</Card.Title>
                    <Card.Text>
                      {transactions.length > 0
                        ? formatDate(transactions[0]?.created_at)
                        : "N/A"}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card bg="warning" text="white">
                  <Card.Body>
                    <Card.Title>Wallet Balance</Card.Title>
                    <Card.Text>₹1000 (Mock)</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card bg="success" text="white">
                  <Card.Body>
                    <Card.Title>Total Paid</Card.Title>
                    <Card.Text>₹{totalPaid}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card bg="danger" text="white">
                  <Card.Body>
                    <Card.Title>Pending Amount</Card.Title>
                    <Card.Text>₹{totalPending}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <h4 className="mb-3">Recent Transactions</h4>

            <div className="mb-3 d-flex flex-wrap gap-2 justify-content-center">
              {transactions.length > 0 ? (
                <>
                  <Button variant="warning" onClick={exportToCSV}>
                    ⬇️ Export CSV
                  </Button>
                  <Button variant="danger" onClick={exportToPDF}>
                    📄 Export PDF
                  </Button>
                </>
              ) : (
                <div className="alert alert-secondary mb-0 w-100 text-center">
                  📭 No data to export.
                </div>
              )}
            </div>

            {loading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "200px" }}
              >
                <Spinner animation="border" variant="primary" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="alert alert-info text-center" role="alert">
                🚫 No transactions found.
              </div>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Status</th>
                    <th>Method</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.id}>
                      <td>{formatDate(txn.created_at)}</td>
                      <td>{txn.amount}</td>
                      <td>{txn.currency}</td>
                      <td>
                        {txn.status === "success" ? (
                          <span className="text-success">✅ Success</span>
                        ) : (
                          <>
                            <span className="text-warning">⏳ Pending</span>
                            <br />
                            <Button
                              size="sm"
                              variant="outline-primary"
                              className="mt-1"
                              onClick={() =>
                                navigate(
                                  `/processpayment?payment_id=${txn.id}&method=${txn.method}`,
                                  {
                                    state: {
                                      convertedAmount: txn.amount,
                                      userData: userData,
                                    },
                                  }
                                )
                              }
                            >
                              🔁 Retry
                            </Button>
                          </>
                        )}
                      </td>
                      <td>{txn.method.toUpperCase()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Container>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
