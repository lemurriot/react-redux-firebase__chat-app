import React, { Component, Fragment } from "react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setUserPosts } from "../../actions";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";
class Messages extends Component {
  state = {
    privateChannel: this.props.isPrivateChannel,
    privateMessagesRef: firebase.database().ref("privateMessages"),
    messagesRef: firebase.database().ref("messages"),
    messages: [],
    messagesLoading: true,
    currentUser: this.props.currentUser,
    usersRef: firebase.database().ref("users"),
    channel: this.props.currentChannel,
    numUniqueUsers: "",
    searchTerm: "",
    searchLoading: false,
    searchResults: [],
    isChannelStarred: false,
  };

  componentDidMount() {
    const { channel, currentUser } = this.state;

    if (channel && currentUser) {
      this.addListeners(channel.id);
      this.addUserStarsListener(channel.id, currentUser.uid);
    }
  }

  componentDidUpdate(_prevPros, prevState) {
    if (prevState.messages !== this.state.messages) {
      this.countUniqueUsers(this.state.messages);
    }
  }

  addListeners = (channelId) => {
    this.addMessageListener(channelId);
  };

  addUserStarsListener = (channelId, userId) => {
    this.state.usersRef
      .child(userId)
      .child("starred")
      .once("value")
      .then((data) => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channelId);
          this.setState({ isChannelStarred: prevStarred });
        }
      });
  };

  addMessageListener = (channelId) => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    ref.child(channelId).on("child_added", (snap) => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false,
      });
    });
    this.countUniqueUsers(loadedMessages);
    this.countUserPosts(loadedMessages);
  };

  countUniqueUsers = (messages) => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length !== 1;
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? "s" : ""}`;
    this.setState({ numUniqueUsers });
  };

  countUserPosts = (messages) => {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1,
        };
      }
      return acc;
    }, {});
    this.props.setUserPosts(userPosts);
  };

  displayMessages = (messages) =>
    !!messages.length &&
    messages.map((message) => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.currentUser}
      />
    ));

  displayChannelName = (channel) => {
    const prependSign = this.state.privateChannel ? "@" : "#";
    return channel ? `${prependSign}${channel.name}` : "";
  };

  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef, privateChannel } = this.state;
    return privateChannel ? privateMessagesRef : messagesRef;
  };

  handleSearchChange = (e) => {
    this.setState(
      {
        searchTerm: e.target.value,
        searchLoading: true,
      },
      () => this.handleSearchMessages()
    );
  };

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = channelMessages.reduce((acc, message) => {
      if (message.content && message.content.match(regex)) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({
      searchResults,
    });
    setTimeout(() => this.setState({ searchLoading: false }), 1000);
  };

  handleStar = () => {
    this.setState(
      (prevState) => ({
        isChannelStarred: !prevState.isChannelStarred,
      }),
      () => this.starChannel()
    );
  };

  starChannel = () => {
    const { currentUser, channel, usersRef, isChannelStarred } = this.state;
    if (isChannelStarred) {
      console.log(currentUser);
      usersRef.child(`${currentUser.uid}/starred`).update({
        [channel.id]: {
          name: channel.name,
          details: channel.details,
          createdBy: channel.createdBy.name,
          avatar: channel.createdBy.avatar,
        },
      });
    } else {
      console.log({ currentUser });
      usersRef
        .child(`${currentUser.uid}/starred`)
        .child(channel.id)
        .remove((err) => {
          if (err !== null) {
            console.error(err);
          }
        });
    }
  };

  render() {
    const {
      messagesRef,
      messages,
      channel,
      currentUser,
      numUniqueUsers,
      searchTerm,
      searchResults,
      searchLoading,
      privateChannel,
      isChannelStarred,
    } = this.state;
    return (
      <Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          isPrivateChannel={privateChannel}
          handleStar={this.handleStar}
          isChannelStarred={isChannelStarred}
        />
        <Segment>
          <Comment.Group className="messages">
            {searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>
        <MessageForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={currentUser}
          isPrivateChannel={privateChannel}
          getMessagesRef={this.getMessagesRef}
        />
      </Fragment>
    );
  }
}

export default connect(null, { setUserPosts })(Messages);
