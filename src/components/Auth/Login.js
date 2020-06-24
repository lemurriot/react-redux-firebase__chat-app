import React from "react";
import firebase from "../../firebase";
import { Link } from "react-router-dom";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    errors: [],
    loading: false,
  };
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSubmit = (e) => {
    const { email, password, errors } = this.state;
    e.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
    }
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(signedInUser => {
        console.log(signedInUser);
        this.setState({ loading: false })
      })
      .catch(err => {
        console.error(err);
        this.setState({
          errors: errors.concat(err),
          loading: false,
        })
      })
  };
  isFormValid = ({ email, password }) => email && password;

  handleInputError = (errors, inputName) => {
    return errors.some((err) =>
    err.message.toLowerCase().includes(inputName)
  )
    ? "error"
    : ""
  } 
  displayErrors = (errors) =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);
  render() {
    const {
      email,
      password,
      errors,
      loading,
    } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="violet" textAlign="center">
            <Icon name="code branch" color="violet" />
            Log In to DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                className={this.handleInputError(errors, 'email')}
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                value={email}
                onChange={this.handleChange}
                type="email"
              />
              <Form.Input
                fluid
                className={this.handleInputError(errors, 'password')}
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                value={password}
                onChange={this.handleChange}
                type="password"
              />
              <Button
                className={loading ? "loading" : ""}
                color="violet"
                fluid
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(this.state.errors)}
            </Message>
          )}
          <Message>
            Don't Have an Account <Link to="/register">Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
