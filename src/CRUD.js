import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function CRUD() {
  const getdata = () => {
    axios
      .get("https://localhost:7288/api/employee")
      .then((result) => {
        setdata(result.data);
      })
      .catch((e) => console.log(e));
  };

  const [data, setdata] = useState([]);
  useEffect(() => {
    getdata();
  }, []);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [IsActive, setIsActive] = useState(0);

  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editIsActive, setEditIsActive] = useState(0);

  // 編輯視窗商業邏輯
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = () => {
    const url = "https://localhost:7288/api/employee";
    const data = { Name: name, Age: age, IsActive: IsActive };
    axios
      .post(url, data)
      .then(() => {
        getdata();
        clear();
        toast.success("Employee has been added!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((e) => console.log(e));
  };

  const clear = () => {
    setAge(" ");
    setName(" ");
    setIsActive(0);
    setEditName(" ");
    setEditAge(" ");
    setEditIsActive(0);
    setEditId(" ");
  };

  const handleEdit = (id) => {
    handleShow();
    axios
      .get(`https://localhost:7288/api/employee/${id}`)
      .then((result) => {
        setEditName(result.data.name);
        setEditAge(result.data.age);
        setEditIsActive(result.data.isActive);
        setEditId(id);
      })
      .catch((e) => console.log(e));
  };
  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this employee?") == true) {
      axios
        .delete(`https://localhost:7288/api/employee/${id}`)
        .then((result) => {
          if (result.status === 200) {
            toast.success("Employee has been delete!", {
              position: toast.POSITION.TOP_RIGHT,
            });
            getdata();
          }
        })
        .catch((e) => toast.error(e));
    }
  };

  const handleUpdate = () => {
    const url = `https://localhost:7288/api/employee/${editId}`;
    const data = {
      id: editId,
      name: editName,
      age: editAge,
      isActive: editIsActive,
    };

    axios
      .put(url, data)
      .then((result) => {
        handleClose();
        getdata();
        clear();
        toast.success("Employee has been updated!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  const handleActiveChange = (e) => {
    if (e.target.checked) {
      setIsActive(1);
    } else {
      setIsActive(0);
    }
  };

  const handleEditActiveChange = (e) => {
    if (e.target.checked) {
      setEditIsActive(1);
    } else {
      setEditIsActive(0);
    }
  };

  return (
    <>
      <br />
      {/* grid */}
      <ToastContainer />
      <Container>
        <Row>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
          </Col>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Age"
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
              }}
            ></input>
          </Col>
          <Col>
            <input
              type="checkbox"
              checked={IsActive === 1 ? true : false}
              onChange={(e) => handleActiveChange(e)}
              value={IsActive}
            />
            <label>IsActive</label>
          </Col>
          <Col>
            <button className="btn btn-primary" onClick={handleSave}>
              Submit
            </button>
          </Col>
        </Row>
      </Container>
      <br />
      {/* 表格 */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Age</th>
            <th>IsActive</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data || data.length > 0
            ? data.map((data, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.name}</td>
                    <td>{data.age}</td>
                    <td>{data.isActive}</td>
                    <td colSpan={2}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(data.id)}
                      >
                        Edit
                      </button>
                      &nbsp;
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(data.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            : "Loding..."}
        </tbody>
      </Table>
      {/* 更新視窗 */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> Modify / Update Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                ></input>
              </Col>
              <Col>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Age"
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value)}
                ></input>
              </Col>
              <Col>
                <input
                  type="checkbox"
                  checked={editIsActive === 1 ? true : false}
                  onChange={(e) => handleEditActiveChange(e)}
                  value={editIsActive}
                />

                <label>IsActive</label>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
