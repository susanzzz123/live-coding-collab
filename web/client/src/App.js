import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  Alert, Button, Container, Row, Col, Modal, Form,
} from 'react-bootstrap';
import NavBar from './components/NavBar';
import socket from './Socket';

function App() {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [changeName, setChangeName] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    socket.on('dup_username', () => {
      setChangeName(true);
    });

    socket.on('joined', () => {
      setChangeName(false);
      // setShowEditor(true);
    });

    socket.on('nav_to_room', (roomId) => {
      navigate(`/room?id=${roomId}`);
    });
  }, []);

  const handleCloseCreate = () => setShowCreate(false);
  const handleCloseJoin = () => setShowJoin(false);
  const handleCreate = () => {
    const roomId = uuid4();
    socket.emit('create', name, roomId);
  };
  const handleJoin = () => {
    socket.emit('join', name, id);
  };

  return (
    <div>
      <NavBar />
      {
        changeName && (
          <Alert key="danger" variant="danger">
            Username has been taken
          </Alert>
        )
      }

      <div>
        <Container class="mt-5" fluid="md">
          <Row>
            <Col>
              <Button variant="outline-success" size="lg" onClick={() => setShowCreate(true)}>
                Create Room
              </Button>
            </Col>
            <Col>
              <Button variant="outline-success" size="lg" onClick={() => setShowJoin(true)}>
                Join Room
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Modal show={showCreate} onHide={handleCloseCreate}>
        <Modal.Header closeButton>
          <Modal.Title>Create Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="name"
                placeholder="name:"
                autoFocus
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => handleCreate()} disabled={!name}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showJoin} onHide={handleCloseJoin}>
        <Modal.Header closeButton>
          <Modal.Title>Join Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="name"
                placeholder="name:"
                autoFocus
                onChange={(e) => setName(e.target.value)}
              />

              <Form.Label>Room Id:</Form.Label>
              <Form.Control
                type="id"
                placeholder="id:"
                autoFocus
                onChange={(e) => setId(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => handleJoin()} disabled={!id || !name}>
            Join
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
