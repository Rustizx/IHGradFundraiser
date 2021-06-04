import React, { Component } from 'react';
import { Container, Row, Col, ProgressBar } from "react-bootstrap";
//import ReactPlayer from 'react-player'

import "../../styles/obs.css";


export default class AmountsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moneyGoal: 4900,
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
            <Container className="home-container" style={{width: 1920}}>
            
                <Row>
                    <Col md={3}>
                        <h3 className="home-donationbar-header-obs">{`$${this.state.moneyFundraised}`}</h3>
                        <p className="home-donationbar-text-obs">{`Raised out of $${this.state.moneyGoal}`}</p>
                    </Col>
                    <Col md={3}>
                        <h3 className="home-donationbar-header-obs">{`$${this.state.moneyGoal-this.state.moneyFundraised}`}</h3>
                        <p className="home-donationbar-text-obs">Needed</p>
                    </Col>
                    <Col md={3}>
                        <h3 className="home-donationbar-header-obs">{`${this.state.amountofdonations}`}</h3>
                        <p className="home-donationbar-text-obs">Donations</p>
                    </Col>
                    <Col md={3}>
                    </Col>
                </Row>
            </Container>
            </>
        )
    }
}