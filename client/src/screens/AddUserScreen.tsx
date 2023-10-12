import React, { useState } from "react";
import axios from "axios";
import {
  useSearchParams,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Container,
  Row,
  Col,
  Button,
  Form as BootstrapForm,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import { addUser } from "../features/userSlice";

interface FormData {
  name: string;
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Ime je obavezno polje"),
  email: Yup.string().required("Email je obavezno polje"),
  password: Yup.string().required("Password je obavezno polje"),
});

const AddUser: React.FC = () => {
  const dispatch = useDispatch<any>();

  let navigate = useNavigate();

  const initialValues: FormData = {
    name: "",
    email: "",
    password: "",
  };

  const handleSubmit = async (values: FormData) => {
    console.log(values);
    dispatch(addUser(values));
    // navigate("/");
  };

  return (
    <Container>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Row>
              <Col>
                <BootstrapForm.Group controlId="name">
                  <BootstrapForm.Label>Ime:</BootstrapForm.Label>
                  <Field
                    type="text"
                    name="name"
                    as={BootstrapForm.Control}
                    placeholder="Unesite ime"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-danger"
                  />
                </BootstrapForm.Group>
              </Col>
              <Col>
                <BootstrapForm.Group controlId="email">
                  <BootstrapForm.Label>Email:</BootstrapForm.Label>
                  <Field
                    type="text"
                    name="email"
                    as={BootstrapForm.Control}
                    placeholder="Unesite email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
                  />
                </BootstrapForm.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <BootstrapForm.Group controlId="password">
                  <BootstrapForm.Label>Password:</BootstrapForm.Label>
                  <Field
                    type="text"
                    name="password"
                    as={BootstrapForm.Control}
                    placeholder="Unesite password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-danger"
                  />
                </BootstrapForm.Group>
              </Col>
            </Row>

            <br />

            <Button type="submit" disabled={isSubmitting}>
              Pošalji
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default AddUser;
