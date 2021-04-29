import React, { Component } from 'react';
import { Container, Row, Image, Col, ProgressBar, Button } from "react-bootstrap";
import ReactPlayer from 'react-player'

import "../styles/main.css";

import placeholder from "../assets/ihhs.png";
import gradpic from "../assets/gradpic.jpg";
import stadium from "../assets/staduim.jpeg";

import DonationCard from "../componets/DonationCard";
import InConstruction from "../componets/InConstruction";
import { BxShareAltIcon, BxChatIcon } from "../assets/icons";

const videoRatioWidth = 0.578;
const videoRatioHeight = 0.65;

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moneyGoal: 5500,
            moneyFundraised: 2307,
            totalDonations: 130,
            currentTotalViewers: 537,
        }

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {
        return (
            <Container className="home-container" >
                <InConstruction/>
                <Row>
                    <Col lg={8} style={{marginTop: "30px"}}>
                        <Image src={placeholder} fluid />
                        {/*<ReactPlayer url="https://www.facebook.com/newshour/videos/367296917967310" 
                            playing="true" 
                            width={`100`} 
                            height={`10`}  
                            controls /> */}
                    </Col>
                    <Col lg={4} style={{marginTop: "30px"}}> 
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
                                <h3 className="share-button-text">Facebook</h3>
                            </Button>
                            <Button className="share-button" variant="outline-dark">
                                <BxShareAltIcon/>
                                <h3 className="share-button-text">Share</h3>
                            </Button>
                        </Row>
                    </Col>
                </Row>
                <Row style={{marginTop: 20}}>
                    <hr style={{color: '#d4d4d4', backgroundColor: '#d4d4d4', height: 0.5, borderColor : '#d4d4d4', width: "100%"}} />
                </Row>
                <Row style={{marginTop: 20}}>
                    <Col lg={8}>
                        <h3 className="about-us-header">About Us</h3>
                        <p className="about-us-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </Col>
                    <Col lg={4}> 
                        <Image src={stadium} style={{borderRadius: "20px", width: "100%"}} fluid />
                    </Col>
                </Row>
                <Row style={{marginTop: 20}}>
                    <hr style={{color: '#d4d4d4', backgroundColor: '#d4d4d4', height: 0.5, borderColor : '#d4d4d4', width: "100%"}} />
                </Row>
                {/*<Row style={{marginTop: 20}}>
                    <hr style={{color: '#d4d4d4', backgroundColor: '#d4d4d4', height: 0.5, borderColor : '#d4d4d4', width: "100%"}} />
                </Row>*/}
                <Row style={{marginTop: 20}} className="justify-content-center">
                    <h5 className="footer-text">2021 © Josh Blayone. Developed by Josh Blayone</h5>
                </Row>
            </Container>
        )
    }
}