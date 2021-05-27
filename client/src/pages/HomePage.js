import React, { Component } from 'react';
import { Container, Row, Image, Col, ProgressBar, Button, Modal, FormControl, InputGroup } from "react-bootstrap";
//import ReactPlayer from 'react-player'
import { ToastContainer } from 'react-toastify';
import { FacebookShareButton, WhatsappShareButton, EmailShareButton, FacebookMessengerShareButton } from "react-share";
import { FacebookIcon, WhatsappIcon, EmailIcon, FacebookMessengerIcon } from "react-share";

import "../styles/main.css";

import placeholder from "../assets/ihhs.png";
import stadium from "../assets/staduim.jpeg";

import DonateCard from "../componets/DonateCard";
import { DonationCardSection } from "../componets/DonationCardSection"
import { BxShareAltIcon, BxChatIcon } from "../assets/icons";
import TopDonatorsSection from '../componets/TopDonatorsSection';


const Divider = () => {
    return (
        <Row style={{marginTop: 23}}>
            <hr style={{color: '#d4d4d4', backgroundColor: '#d4d4d4', height: 0.5, borderColor : '#d4d4d4', width: "100%"}} />
        </Row>
    )
}

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moneyGoal: 4350,
            moneyFundraised: 0,
            totalDonations: 0,
            currentTotalViewers: 0,
            donations: {},
            amountofdonations: 0,
            share: false,
        }

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.copytoclickboard = this.copytoclickboard.bind(this);
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

    copytoclickboard (e) {
        this.refs.textArea.select();
        document.execCommand('copy');
        e.target.focus();
    }

    getDonationsData = () => {
        fetch('/donations')
          .then(response => response.json())
          .then(res => {
            this.setState({ donations: res, amountofdonations: res.length });
            this.intervalDonationsID = setTimeout(this.getDonationsData.bind(this), 15000);
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
            this.intervalMoneyID = setTimeout(this.getMoneyData.bind(this), 15000);
        });
    }

    render() {
        return (
            <>
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
                <Row className="justify-content-center">
                    <Col lg={8} style={{marginTop: "30px"}}>
                        <Image src={placeholder} fluid />
                        {/*<ReactPlayer url="https://www.facebook.com/newshour/videos/367296917967310" 
                            playing="true" 
                            width={`100`} 
                            height={`10`}  
                            controls /> */}
                    </Col>
                    <Col lg={4} style={{marginTop: "30px"}}> 
                        <DonateCard amountleft={this.state.moneyGoal-this.state.moneyFundraised} />
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
                            <Button className="share-button" variant="outline-dark" onClick={() => {window.location.href = "https://www.facebook.com/ihgrad"}}>
                                <BxChatIcon/>
                                <h3 className="share-button-text">Facebook</h3>
                            </Button>
                            <Button className="share-button" variant="outline-dark" onClick={() => {this.setState({ share: true })}}>
                                <BxShareAltIcon/>
                                <h3 className="share-button-text">Share</h3>
                            </Button>
                        </Row>
                    </Col>
                </Row>
                <Divider/>
                <Row style={{marginTop: 20}}>
                    <Col lg={7}>
                        <h3 className="about-us-header">About Us</h3>
                        <p className="about-us-text">
                        Welcome to the IHHS Grad 2021 fundraising website! <br/><br/>

                        This year, the Grade 12 class of Indian Head High School will be holding their graduation ceremony at Mosaic Stadium.
                        In order to help support the graduating class pay for the rental fees for this facility, Bonfire Boys will be holding a Sing-A-Thon fundraiser on Friday, June 4.  <br/><br/>
                        
                        We are looking forward to supporting our grads as they say farewell to one journey and embark on a new one. <br/><br/>

                        { /*Please note, if the Indian Head 2021 Grad ceremony gets cancelled, all funds rasised will go to help all extra-curricular programs next year equally. */}
                        
                        </p>
                    </Col>
                    <Col lg={5} style={{justifyContent: 'center'}}> 
                            <Image src={stadium} style={{borderRadius: "20px", width: "100%"}} fluid />
                    </Col>
                </Row>
                <Divider/>
                <TopDonatorsSection donations={this.state.donations} amountofdonations={this.state.amountofdonations} />
                <Divider/>
                <DonationCardSection donations={this.state.donations} amountofdonations={this.state.amountofdonations} />
                <Divider/>
                <Row style={{marginTop: 20}} className="justify-content-center">
                    <h5 className="footer-text">2021 © Josh Blayone. Developed by <a style={{color: "black"}} href="https://josh.blayone.com" >Josh Blayone</a></h5>
                </Row>
            </Container>
            <Modal
                    show={this.state.share}
                    onHide={() => {this.setState({ share: false, })}}
                    width={`30%`}
                >
                    <Modal.Header closeButton>
                        <Modal.Title className="form-text">Share</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="justify-content-center" >
                            <FacebookShareButton
                                url={"https://ihgrad.com"}
                                quote={"Indian Head Graduation Fundraiser"}
                                hashtag={"#ihgrad"}
                                description={"Help the IHHS Grade Class of 2021 fundraise for their upcoming Graduation"}
                                style={{marginLeft: "10px", marginRight: "10px"}}
                            >
                                <FacebookIcon size={32} round />
                            </FacebookShareButton>
                            <FacebookMessengerShareButton
                                style={{marginLeft: "10px", marginRight: "10px"}}
                                url={"https://ihgrad.com"}
                            >
                                <FacebookMessengerIcon size={32} round />
                            </FacebookMessengerShareButton>
                            <WhatsappShareButton
                                style={{marginLeft: "10px", marginRight: "10px"}}
                                url={"https://ihgrad.com"}
                                quote={"Indian Head High School Graduation Fundraiser"}
                                hashtag={"#ihgrad"}
                            >
                                <WhatsappIcon size={32} round />
                            </WhatsappShareButton>
                            <EmailShareButton
                                style={{marginLeft: "10px", marginRight: "10px"}}
                                subject="Help the Indian Head Class of 2021 Grads!"
                                url={"https://ihgrad.com"}
                                body="Help us support the Indian Head High School grads hold their graduation ceremony at Mosaic Staduim. Every little bit counts."
                            >
                                <EmailIcon size={32} round />
                            </EmailShareButton>
                        </Row>
                        <Row className="justify-content-center">
                            <InputGroup style={{marginTop: "10px", width: "80%"}}>
                                <FormControl
                                    value={`https://ihgrad.com/`}
                                    ref="textArea"
                                />
                                <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={this.copytoclickboard}>Copy</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Row>
                        <p style={{marginTop: "10px"}} className="form-text">Help by sharing with your friends and family!</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {this.setState({ share: false, })}}>
                            Back
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}