import React, { Component } from 'react';
import { Container, Row, Image, Col, ProgressBar, Button } from "react-bootstrap";
import ReactPlayer from 'react-player'
import { ToastContainer } from 'react-toastify';

import "../styles/main.css";

import placeholder from "../assets/ihhs.png";
import stadium from "../assets/staduim.jpeg";

import DonateCard from "../componets/DonateCard";
import InConstruction from "../componets/InConstruction";
import { DonationCardSection } from "../componets/DonationCardSection"
import { BxShareAltIcon, BxChatIcon } from "../assets/icons";


const Divider = () => {
    return (
        <Row style={{marginTop: 20}}>
            <hr style={{color: '#d4d4d4', backgroundColor: '#d4d4d4', height: 0.5, borderColor : '#d4d4d4', width: "100%"}} />
        </Row>
    )
}

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moneyGoal: 5500,
            moneyFundraised: 0,
            totalDonations: 0,
            currentTotalViewers: 0,
            donations: {},
            amountofdonations: 0,
        }

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        this.getDonationsData();
        this.getMoneyData();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        clearTimeout(this.intervalDonationsID);
        clearTimeout(this.intervalMoneyID);
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    getDonationsData = () => {
        fetch('/donations')
          .then(response => response.json())
          .then(res => {
            this.setState({ donations: res, amountofdonations: res.length });
            this.intervalDonationsID = setTimeout(this.getDonationsData.bind(this), 30000);
        });
    }

    getMoneyData = () => {
        fetch('/amount')
          .then(response => response.json())
          .then(res => {
            if(!res.total){
                this.setState({ moneyFundraised: 0 });
            } else {
                this.setState({ moneyFundraised: res.total });
            }
            this.intervalMoneyID = setTimeout(this.getMoneyData.bind(this), 30000);
        });
    }

    render() {
        return (
            <Container className="home-container" >
                <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                {/*<InConstruction/>*/}
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
                        <DonateCard />
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
                        <h3 className="home-donationbar-header">{`${this.state.amountofdonations}`}</h3>
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
                <Divider/>
                <Row style={{marginTop: 20}}>
                    <Col lg={8}>
                        <h3 className="about-us-header">About Us</h3>
                        <p className="about-us-text">
                        Welcome to the IHHS Grad 2021 fundraising website! <br/><br/>

                        This year, the Grade 12 class of Indian Head High School will be holding their graduation ceremony at Mosaic Stadium.
                        In order to help support the graduating class pay for the rental fees for this facility, Bonfire Boys and friends will be holding a Sing-A-Thon fundraiser on Saturday, May 15.  <br/><br/>
                        
                        We are looking forward to supporting our grads as they say farewell to one journey and embark on a new one.
                        
                        </p>
                    </Col>
                    <Col lg={4}> 
                        <Image src={stadium} style={{borderRadius: "20px", width: "100%"}} fluid />
                    </Col>
                </Row>
                <Divider/>
                <DonationCardSection donations={this.state.donations} amountofdonations={this.state.amountofdonations} />
                <Divider/>
                <Row style={{marginTop: 20}} className="justify-content-center">
                    <h5 className="footer-text">2021 © Josh Blayone. Developed by Josh Blayone</h5>
                </Row>
            </Container>
        )
    }
}