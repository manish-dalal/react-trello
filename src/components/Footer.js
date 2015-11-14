import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 18px 24px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  text-align: center;
  font-size: 1.1rem;
`;

const Footer = () => (
  <Container>
    Want to learn how to build this awesome app? Visit <a href="https://alterclass.io">AlterClass.io</a>
  </Container>
);

export default Footer;
