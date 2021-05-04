import React, { Component } from 'react';
import { Container, Col, Row } from "react-bootstrap";

import "../styles/donations.css"

export function SimpleCard(props) {
    try{
        return (
            <Container className="simplecard-container">
                <Row>
                    <Col xs={8}>
                        <h3 className="simplecard-title">{props.donation.name}</h3>
                    </Col>
                    <Col xs={4}>
                        <h3 className="simplecard-amount">{`$${props.donation.amount}`}</h3>
                    </Col>
                </Row>
                <p className="simplecard-message">{props.donation.message}</p>
            </Container>
        )
    } catch (error) {
        return (<div></div>)
    }
}

export class DonationCardSection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 0,
        }

        this.pageUp = this.pageUp.bind(this);
        this.pageDown = this.pageDown.bind(this);
    }

    pageUp = () => {
        if(this.state.page < this.props.amountofdonations/9-1){
            this.setState({page: this.state.page+1})
        }
    }

    pageDown = () => {
        if(this.state.page > 0) {
            this.setState({page: this.state.page-1})
        }
    }

    render() {
        return (
            <Container>
                <Row className="justify-content-center">
                    <h3 className="donation-header">Recent Donations</h3>
                </Row>
                <Row className="justify-content-center">
                    <div onClick={this.pageDown}>
                        <span className="far fa-arrow-alt-circle-left icon"/>
                    </div>
                    <p className="donation-text">{`${(this.state.page*9 + 1)} - ${(this.state.page*9) + 9} out of ${this.props.amountofdonations}`}</p>
                    <div onClick={this.pageUp}>
                        <span className="far fa-arrow-alt-circle-right icon"/>
                    </div>
                </Row>
                <Row style={{}}>
                    <Col md={4} style={{marginTop: "10px"}}>
                        <SimpleCard donation={this.props.donations[(this.props.amountofdonations)-1-(this.state.page*9)]} />
                    </Col>
                    <Col md={4} style={{marginTop: "10px"}}>
                        <SimpleCard donation={this.props.donations[(this.props.amountofdonations)-2-(this.state.page*9)]}/>
                    </Col>
                    <Col md={4} style={{marginTop: "10px"}}>
                        <SimpleCard donation={this.props.donations[(this.props.amountofdonations)-3-(this.state.page*9)]}/>
                    </Col>
                </Row>
                <Row style={{marginTop: "2%"}}>
                    <Col md={4} style={{marginTop: "10px"}}>
                        <SimpleCard donation={this.props.donations[(this.props.amountofdonations)-4-(this.state.page*9)]} />
                    </Col>
                    <Col md={4} style={{marginTop: "10px"}}>
                        <SimpleCard donation={this.props.donations[(this.props.amountofdonations)-5-(this.state.page*9)]}/>
                    </Col>
                    <Col md={4} style={{marginTop: "10px"}}>
                        <SimpleCard donation={this.props.donations[(this.props.amountofdonations)-6-(this.state.page*9)]}/>
                    </Col>
                </Row>
                <Row style={{marginTop: "2%"}}>
                    <Col md={4} style={{marginTop: "10px"}}>
                        <SimpleCard donation={this.props.donations[(this.props.amountofdonations)-7-(this.state.page*9)]} />
                    </Col>
                    <Col md={4} style={{marginTop: "10px"}}>
                        <SimpleCard donation={this.props.donations[(this.props.amountofdonations)-8-(this.state.page*9)]}/>
                    </Col>
                    <Col md={4} style={{marginTop: "10px"}}>
                        <SimpleCard donation={this.props.donations[(this.props.amountofdonations)-9-(this.state.page*9)]}/>
                    </Col>
                </Row>
            </Container>
        )
    }
}