import React from "react";
import firebase from "../../firebase";
import { Link } from "react-router-dom";
import md5 from 'md5';
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";

class Register extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('users'),
  };
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((createdUser) => {
          createdUser.user.updateProfile({
            displayName: this.state.username,
            photoURL: `https://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
          }).then(() => {
            this.saveUser(createdUser).then(() => console.log('user saved'))
            this.setState({ loading: false })
          }).catch(err => {
            console.error(err);
            this.setState({ errors: this.state.errors.concat(err), loading: false })
          })
        })
        .catch((err) => {
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err),
          });
        });
    }
  };
  saveUser = createdUser => this.state.usersRef.child(createdUser.user.uid).set({
    name: createdUser.user.displayName,
    avatar: createdUser.user.photoURL,
  });
  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };
  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };
  isFormValid = () => {
    const errors = [];
    let error;
    if (this.isFormEmpty(this.state)) {
      error = { message: "Fill in all fields" };
      this.setState({ errors: errors.concat(error) });
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: "Password is invalid" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  };
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
      username,
      email,
      passwordConfirmation,
      password,
      errors,
      loading,
    } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                value={username}
                onChange={this.handleChange}
                type="text"
              />
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
              <Form.Input
                fluid
                className={this.handleInputError(errors, 'password')}
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                value={passwordConfirmation}
                onChange={this.handleChange}
                type="password"
              />
              <Button
                className={loading ? "loading" : ""}
                color="orange"
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
            Already a user? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
