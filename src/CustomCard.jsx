import { React, useState, useEffect } from "react";
import {
  Col,
  Card,
} from "react-bootstrap";

const CustomCard=(props)=>{
    return(
        <Col key={props.colKey}>
            <Card key={props.cardKey} className="h-100">
            <Card.Img
                variant="top"
                className="card-img"
                src={props.src}
            />
            <Card.Body>
                <Card.Title className="h-20">
                {props.title}
                </Card.Title>
            </Card.Body>
            </Card>
        </Col>
    );
}

export default CustomCard;

