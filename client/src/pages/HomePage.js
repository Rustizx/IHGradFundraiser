import React, { Component } from 'react';
import { Container, Row, Image, Col, ProgressBar, Button } from "react-bootstrap";

import "../styles/main.css";

import placeholder from "../assets/ihhs.png";
import DonationCard from "../componets/DonationCard";
import InConstruction from "../componets/InConstruction";
import { BxShareAltIcon, BxChatIcon } from "../assets/icons";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moneyGoal: 5500,
            moneyFundraised: 2307,
            totalDonations: 130,
            currentTotalViewers: 537,

        }
    }

    render() {
        return (
            <Container className="home-container">
                <InConstruction/>
                <Row>
                    <Col md={8} style={{marginTop: "30px"}}>
                        <Image src={placeholder} fluid />
                    </Col>
                    <Col md={4} style={{marginTop: "30px"}}> 
                        <DonationCard />
                    </Col>
                </Row>
                <Row style={{marginTop: 30}}>
                    <ProgressBar style={{width: "100%", borderRadius: 20}} max={this.state.moneyGoal} now={this.state.moneyFundraised} /> {/*label={`$${this.state.moneyFundraised}`}*/}
                </Row>
                <Row style={{marginTop: 15}}>
                    <Col md={2}>
                        <h3 className="home-donationbar-header">{`$${this.state.moneyFundraised}`}</h3>
                        <p className="home-donationbar-text">{`Raised out of $${this.state.moneyGoal}`}</p>
                    </Col>
                    <Col md={2}>
                        <h3 className="home-donationbar-header">{`$${this.state.moneyGoal-this.state.moneyFundraised}`}</h3>
                        <p className="home-donationbar-text">Needed to Complete Goal</p>
                    </Col>
                    <Col md={2}>
                        <h3 className="home-donationbar-header">{`${this.state.totalDonations}`}</h3>
                        <p className="home-donationbar-text">Donations</p>
                    </Col>
                    <Col md={2}>
                        <h3 className="home-donationbar-header">{`${this.state.currentTotalViewers}`}</h3>
                        <p className="home-donationbar-text">Total Viewers</p>
                    </Col>
                    <Col sm={4}>
                        <Row className="justify-content-center">
                            <Button className="share-button" variant="outline-dark">
                                <BxChatIcon/>
                                <h3 className="share-button-text">View Chat</h3>
                            </Button>
                            <Button className="share-button" variant="outline-dark">
                                <BxShareAltIcon/>
                                <h3 className="share-button-text">Share</h3>
                            </Button>
                        </Row>
                    </Col>
                </Row>
            </Container>
        )
    }
}