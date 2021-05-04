import React, {Component} from 'react';
import { Form, Col, Row, Container, Spinner, Button, Modal } from 'react-bootstrap';
//import { toast } from 'react-toastify';
import { SimpleCard } from '../componets/DonationCardSection';

import "../styles/finalize.css";

const ErrorScreen = (props) => {
    return (
        <div>
            <p>Error</p>
            <p>{props.errortype}</p>
        </div>
    )
}

export default class FinalizePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            error: false,
            errortype: "",
            name: "",
            tempName: "",
            amount: "0",
            message: "",
            isHidden: false,
            submit: false,
            checkout_session_id: "",
        }

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleHiddenChange = this.handleHiddenChange.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({checkout_session_id: this.props.match.params.token })
        const fetchPromise = fetch("/checkout-info", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: this.props.match.params.token })
          });
  
          fetchPromise
            .then(response => response.json())
            .then(res => {
                if(!res.error){
                    this.setState({ amount: String(res.amount) })
                } else {
                    this.setState({ error: true, errortype: res.error })
                }
            })
            .catch(err => console.log(err))
            .finally(() => {
                this.setState({ isLoading: false });
            })
    }

    addDonation() {
        const fetchPromise = fetch("/donation-add", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                checkout_session_id: this.state.checkout_session_id,
                amount: String(this.state.amount),
                name: this.state.name,
                message: this.state.message,
            })
          });
  
          fetchPromise
            .then(response => response.json())
            .then(res => {
                if(!res.error){
                    this.setState({ amount: String(res.amount) })
                    this.props.history.push('/?message=success');
                } else {
                    this.setState({ error: true, errortype: res.error })
                }
            })
            .catch(err => console.log(err))
            .finally(() => {
                this.setState({ isLoading: false });
            })
    }

    handleNameChange = (event) => {
        this.setState({ name: event.target.value });
    }

    handleMessageChange = (event) => {
        this.setState({ message: event.target.value });
    }

    handleHiddenChange = () => {
        if(this.state.isHidden){
            this.setState({ isHidden: false, name: this.state.tempName });
        } else {
            this.setState({ isHidden: true, tempName: this.state.name, name: "Anonymous" });
        }
    }

    handleSubmit = () => {
        if(this.state.name === ""){
            this.setState({ name: "Anonymous"})
        }
        this.setState({ submit: true })
    }

    FormScreen = () => {
        const { isLoading, isHidden } = this.state;
        const { amount, name, message } = this.state;

        if(!isLoading) {
            return (
                <Row className="justify-content-center">
                    <Col lg={5} style={{marginTop: "20px"}}>
                        <Row className="justify-content-center">
                            <h3 className="form-header">Donation Message</h3>
                        </Row>
                        <Form style={{marginTop: "30px"}}>
                            <Form.Group as={Row} controlId="formName">
                                <Form.Label column sm={3}>
                                    <Row>
                                        Name
                                    </Row>
                                </Form.Label>
                                <Col sm={9}>
                                    {isHidden 
                                        ?   <Form.Control 
                                                type="text" 
                                                value={"Anonymous"}
                                                disabled
                                            />
                                        :   <Form.Control 
                                                type="text" 
                                                value={name}
                                                onChange={this.handleNameChange}
                                            />
                                    }
                                </Col>
                            </Form.Group>
    
                            <Form.Group as={Row} controlId="formAmount">
                                <Form.Label column sm={3}>
                                    <Row>
                                        Amount
                                    </Row>
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control 
                                        type="text" 
                                        value={`$${amount}.00`}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
    
                            <Form.Group as={Row} controlId="formMessage">
                                <Form.Label column sm={3}>
                                    <Row>
                                        Message
                                    </Row>
                                    <Row>
                                        {`( ${(this.state.message).length} / 200 chars )`}
                                    </Row>
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={3}
                                        value={message}
                                        onChange={this.handleMessageChange}
                                    />
                                </Col>
                            </Form.Group>
    
                            <Form.Group>
                                <Form.Check 
                                    type="switch"
                                    id="isHidden"
                                    label="Hide Name"
                                    value={this.state.isHidden}
                                    onChange={this.handleHiddenChange}
                                />
                            </Form.Group>
                            <Button onClick={this.handleSubmit}>Submit</Button>
                        </Form>
                    </Col>
                </Row>
            )
        } else {
            return (
                <div>
                    <Spinner animation="border"/>
                </div>
            )
        }
    }

    render() {

        return (
            <>
                <Container className="finalize-container">
                    {this.state.error
                        ? <ErrorScreen errortype={this.state.errortype} />
                        : <this.FormScreen />
                    }
                </Container>
                <Modal
                    show={this.state.submit}
                    onHide={() => {this.setState({ submit: false, }); console.log('Hidden')}}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Donation Preview</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <SimpleCard donation={ { name: this.state.name, amount: this.state.amount, message: this.state.message} } />
                        <p style={{marginTop: "25px"}}>Above is a preview of what the donation will look like on the website.</p>
                        <p style={{marginTop: "20px"}}>Bad language and comments will not be tolerated and will be removed. The donation will then show up as Anonymous.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {this.setState({ submit: false, })}}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => {this.setState({ submit: false, }); this.addDonation()}}>Confirm</Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}