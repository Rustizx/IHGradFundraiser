import React, { Component } from 'react';
import { Container, Row, Col, Button, InputGroup, FormControl, Spinner } from 'react-bootstrap';

import { loadStripe } from "@stripe/stripe-js";

import '../styles/donation.css';

const stripePromise = loadStripe(process.env.REACT_APP_PUBLIC_API_TEST);

const heightRatio = 0.32578125;
const heightDefault = 1440;

function onlyDigits(s) {
    for (let i = s.length - 1; i >= 0; i--) {
      const d = s.charCodeAt(i);
      if (d < 48 || d > 57) return false
    }
    return true
}

export default class DonateCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            width: 0, 
            height: 0,
            amount: "20",
        };

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        if(window.innerWidth > 1000){
            this.setState({ width: window.innerWidth, height: window.innerHeight });
        } else {
            this.setState({ width: heightDefault, height: window.innerHeight });
        }
    }

    changeMoney = (amount) => {
        this.setState({ amount: String(amount) });   
    }


    handleChange = (event) => {
        if(onlyDigits(event.target.value)){
            this.setState({ amount: event.target.value });
        }
    }

    handleClick = async () => {
        this.setState({isLoading: true});
        const stripe = await stripePromise;
        const response = await fetch("/create-checkout-session", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ amount: this.state.amount })
        });
        const session = await response.json();
        // When the customer clicks on the button, redirect them to Checkout.
        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        });
        if (result.error) {
          // If `redirectToCheckout` fails due to a browser or network
          // error, display the localized error message to your customer
          // using `result.error.message`.
        }
        this.setState({isLoading: false});
      };
    

    render() {
        return (
            <Container className="donation-container" style={{height: this.state.width*heightRatio}}>
                <p className="donation-title">Make a Donation</p>
                <hr style={{color: '#1871f8', backgroundColor: '#1871f8', height: 0.5, borderColor : '#1871f8', width: "100px", marginLeft: "5%"}} />
                <p className="donation-subtext">Select an amount.</p>
                <Row>
                    <Col>
                        <Button className="donation-button" variant="outline-dark" onClick={() => this.changeMoney(10)}>
                            <h3 className="donation-button-text">$10</h3>
                        </Button>
                    </Col>
                    <Col>
                        <Button className="donation-button" variant="outline-dark" onClick={() => this.changeMoney(15)}>
                            <h3 className="donation-button-text">$15</h3>
                        </Button>
                    </Col>
                </Row>
                <Row style={{ marginTop: "5%"}}>
                    <Col>
                        <Button className="donation-button" variant="outline-dark" onClick={() => this.changeMoney(20)}>
                            <h3 className="donation-button-text">$20</h3>
                        </Button>
                    </Col>
                    <Col>
                        <Button className="donation-button" variant="outline-dark" onClick={() => this.changeMoney(25)}>
                            <h3 className="donation-button-text">$25</h3>
                        </Button>
                    </Col>
                </Row>
                <Row style={{marginTop: '5%'}}>
                    <Col>
                        <Button className="donation-button" variant="outline-dark" onClick={() => this.changeMoney(50)}> 
                            <h3 className="donation-button-text">$50</h3>
                        </Button>
                    </Col>
                    <Col>
                        <Button className="donation-button" variant="outline-dark" onClick={() => this.changeMoney(100)}>
                            <h3 className="donation-button-text">$100</h3>
                        </Button>
                    </Col>
                </Row>
                <Row style={{marginTop: '5%'}}>
                    <Col style={{justifyContent: 'center'}}>
                        <div style={{marginLeft: '9%', marginRight: '9%'}}>
                            <InputGroup className="mb-3 center">
                                <InputGroup.Prepend>
                                <InputGroup.Text>$</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl aria-label="Amount (to the nearest dollar)" type="text" value={this.state.amount} onChange={this.handleChange}/>
                                <InputGroup.Append>
                                <InputGroup.Text>.00</InputGroup.Text>
                                </InputGroup.Append>
                            </InputGroup>
                        </div>
                    </Col>
                </Row>
                <Row style={{margin: '6%', marginTop: '10px'}}>
                    <Col>
                        {this.state.isLoading
                        ?   <Spinner style={{alignSelf: "center"}} animation="border"/>
                        :   <Button className="donation-button" variant="outline-dark" onClick={this.handleClick}>
                                <h3 className="donation-button-pay">{`Donate $${this.state.amount}`}</h3>
                            </Button>
                        }
                    </Col>
                </Row>
            </Container>
        )
    }
}