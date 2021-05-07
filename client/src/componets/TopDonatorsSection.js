import React from 'react';
import { Container, Col, Row } from "react-bootstrap";

import "../styles/donors.css"

function SimpleCard(props) {
    try{
        return (
            <Container className="donorcard-container">
                <Row className="justify-content-center">
                    <h3 className="donorcard-title">{props.donation.name}</h3>
                </Row>
                <Row className="justify-content-center">
                    <h3 className="donorcard-amount">{`$${props.donation.amount} raised`}</h3>
                </Row>
            </Container>
        )
    } catch (error) {
        return (<div></div>)
    }
}

export default function TopDonatorsSection (props) {
    var arr = [];

    var i;
    for (i = 0; i < props.amountofdonations; i++) {
        arr.push({ name: props.donations[i].name, amount: props.donations[i].amount })
    }
    
    var resMap = new Map();
    var result = [];
    arr.map((x) => {
        if (!resMap.has(x.name))
            resMap.set(x.name, x.amount);
        else
            resMap.set(x.name, (x.amount + resMap.get(x.name)));

        return 0;
    })
    resMap.forEach((value, key) => {
        result.push({
            name: key,
            amount: value
        })
    })

    // Highest First
    result.sort(function(a, b){
        return b.amount-a.amount
    })

    return (
        <Container>
            <Row className="justify-content-center">
                <h3 className="donorcard-header">Top Donators</h3>
            </Row>
            <Row style={{marginTop: "10px"}}>
                <Col md={3} style={{marginTop: "10px"}}>
                    <SimpleCard donation={result[0]} />
                </Col>
                <Col md={3} style={{marginTop: "10px"}}>
                    <SimpleCard donation={result[1]}/>
                </Col>
                <Col md={3} style={{marginTop: "10px"}}>
                    <SimpleCard donation={result[2]}/>
                </Col>
                <Col md={3} style={{marginTop: "10px"}}>
                    <SimpleCard donation={result[3]}/>
                </Col>
            </Row>
        </Container>
    )
}