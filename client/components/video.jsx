import React, {Component} from 'react';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        {
          text: "test",
        }
      ],
      currentMessage: "",
      username: "",
      users: [],
      video: null
    };

    this.pubnub = new PubNub({
        publishKey: 'pub-c-cf1aafc6-8870-4bd2-b7f0-261fe8871836',
        subscribeKey: 'sub-c-9d8fe528-1422-11e7-a5a9-0619f8945a4f',
        ssl: true
    });

    this.changedMessage = this.changedMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.makeCall = this.makeCall.bind(this);
    this.setCallee = this.setCallee.bind(this);
    this.setCaller = this.setCaller.bind(this);
    this.login = this.login.bind(this);
  }

  changedMessage() {
    this.setState({
      currentMessage: this.refs.input.value
    });
  }

  setCallee(e) {
    this.setState({
      callee: e.target.value
    })
  }

  setCaller(e) {
    this.setState({
      caller: e.target.value
    })
  }

  sendMessage() {
    this.pubnub.publish({
      channel: 'chat',
      message: {
        text: this.state.currentMessage,
        sender: this.pubnub.getUUID()
      }
    });
    this.setState({
      currentMessage: ''
    });
    this.pubnub.subscribe({
      channels: ['chat'],
      withPresence: true
    });
    this.pubnub.addListener({
      message: (e) => {
        // this.setState({
        //   messages: [...this.state.messages, {text: e.message.text}]
        // });
        this.state.messages.push(
          {text: e.message.text}
        );
        this.setState({
          messages: this.state.messages
        });
      }
    });
  }

  login(e) {
    e.preventDefault();
    let phone = window.phone = PHONE({
        number: this.state.caller || "Anonymous", // listen on username line else Anonymous
        publish_key: 'pub-c-cf1aafc6-8870-4bd2-b7f0-261fe8871836',
        subscribe_key: 'sub-c-9d8fe528-1422-11e7-a5a9-0619f8945a4f',
        ssl: true
    });	
    phone.ready(() => {
      console.log('Phone ready');
    });
    let video_out = document.getElementById("videoBox");
    phone.receive((session) => {
        session.connected((session) => {
          console.log('Connected. Caller: ', this.state.caller);
          // this.refs.video.innerHTML = session.video;
          video_out.appendChild(session.video);
        });
        session.ended((session) => {
          this.refs.video.innerHTML='';
        });
    });
  }

  makeCall() {
    // let phone = window.phone = PHONE({
    //   number: this.state.caller,
    //   publish_key: 'pub-c-cf1aafc6-8870-4bd2-b7f0-261fe8871836',
    //   subscribe_key: 'sub-c-9d8fe528-1422-11e7-a5a9-0619f8945a4f'
    // });
    // phone.ready(() => {console.log('phone ready')});
    // phone.receive((session) => {
    //   session.connected((session) => {
    //     console.log('connected');
    //     this.refs.video.innerHTML = session.video;
    //   });
    //   session.ended((session) => {
    //     this.refs.video.innerHTML = '';
    //   });
    // });
    phone.dial(this.state.callee);
  }

  render() {
    return (
      <div>
        <h1>Chat</h1>
        <div>
          {this.state.messages.map((message, idx) => {return <p key={idx}>{message.text}</p>})}
        </div>
        <div>
          <input
            type="text"
            ref="input"
            value={this.state.currentMessage}
            placeholder="Message"
            onChange={this.changedMessage}
          />
          <button onClick={this.sendMessage}>send</button>
        </div>
        <h1>Video Call</h1>
          <input type="text" name="number" placeholder="Enter your name" onChange={this.setCaller}/>
          <input type="submit" value="Log in" onClick={this.login} />
          <input type="text" name="number" placeholder="Enter user to call" onChange={this.setCallee}/>
          <input type="submit" value="Call" onClick={this.makeCall}/>
        <div id="videoBox" ref="video">
        </div>
      </div>
      );
  }
}

ReactDOM.render(<Main/>, document.getElementById('main'));
