import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, KeyboardAvoidingView, TextInput,TouchableOpacity, TouchableHighlight, Keyboard,AppRegistry } from 'react-native';
import Icon from 'native-base';
import Voice from 'react-native-voice';
import Tts from 'react-native-tts';

export default class App extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = {
      messages:[],
      inputBarText: '',
      results:null,
    }
    Voice.onSpeechResults=this.onSpeechResults.bind(this);
  }






  //fun keyboard stuff- we use these to get the end of the ScrollView to "follow" the top of the InputBar as the keyboard rises and falls
  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  //Without this, whatever message is the keyboard's height from the bottom will look like the last message.
  keyboardDidShow (e) {
    this.scrollView.scrollToEnd();
  }

  //When the keyboard dissapears, this gets the ScrollView to move the last message back down.
  keyboardDidHide (e) {
    this.scrollView.scrollToEnd();
  }

  //scroll to bottom when first showing the view
  componentDidMount() {
    setTimeout(function() {
      this.scrollView.scrollToEnd();
    }.bind(this))
  }

  componentDidUpdate() {
    setTimeout(function() {
      this.scrollView.scrollToEnd();
    }.bind(this))
  }

  _sendMessage(msg,type) {
    if(type==1){
  this.state.messages.push({direction: "right", text: msg});

    }else{
  this.state.messages.push({direction: "left", text: msg});

    }

    this.setState({
      messages: this.state.messages,
    });
  }

  async getresponse(msg){
    const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN';

    try {
       const response = await fetch(`https://api.dialogflow.com/v1/query?v=20170712`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          query: msg,
          lang: 'en',
          sessionId: 'somerandomthing'
        })
      })
      let responseJson = await response.json();
      console.log(responseJson)
            this._sendMessage(responseJson.result.fulfillment.messages[0].speech,2);

      this.setState({results:responseJson.result.fulfillment.messages[0].speech});
      Tts.speak(responseJson.result.fulfillment.messages[0].speech);

    } catch(error) {
      console.error(error);
    }
}




onSpeechResults(e){
  console.log("evalue: "+e.value[0]);
  if(e.value.length){
  this.setState({results:e.value[0]});
 
  }else{
   this.setState({results:e.value});
   
  }
   this._sendMessage(this.state.results,1);
  this.getresponse(this.state.results);
  console.log("state value: "+this.state.results);
}


onSpeechEnd(){
  Voice.stop();
}
  render() {

    var messages = [];

    this.state.messages.forEach(function(message, index) {
      messages.push(
          <MessageBubble key={index} direction={message.direction} text={message.text}/>
        );
    });

    return (
              <View style={styles.outer}>
                  <ScrollView ref={(ref) => { this.scrollView = ref }} style={styles.messages}>
                    {messages}
                  </ScrollView>
                  <InputBar/>
                              
              </View>
            );
  }
}

class MessageBubble extends Component {
  render() {

    var leftSpacer = this.props.direction === 'left' ? null : <View style={{width: 70}}/>;
    var rightSpacer = this.props.direction === 'left' ? <View style={{width: 70}}/> : null;

    var bubbleStyles = this.props.direction === 'left' ? [styles.messageBubble, styles.messageBubbleLeft] : [styles.messageBubble, styles.messageBubbleRight];

    var bubbleTextStyle = this.props.direction === 'left' ? styles.messageBubbleTextLeft : styles.messageBubbleTextRight;

    return (
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            {leftSpacer}
            <View style={bubbleStyles}>
              <Text style={bubbleTextStyle}>
                {this.props.text}
              </Text>
            </View>
            {rightSpacer}
          </View>
      );
  }
}

class InputBar extends Component {

onSpeechStart(){
  console.log('started');
  Voice.start('en-US');
   Voice.stop();
}

  render() {
    return (
   
          <TouchableOpacity onPress={this.onSpeechStart}  >
    <View style={styles.CircleShapeView} >
<Text style={{color:'white'}}>Speak</Text>
        </View></TouchableOpacity >
          );
  }
}

const styles = StyleSheet.create({

  //ChatView

  outer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'white',

  },

  messages: {
    flex: 1
  },

  //InputBar

  inputBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

 
  CircleShapeView: {
    width: 70,
    height: 70,
    borderRadius: 70/2,
    backgroundColor: 'black',
        justifyContent: 'center',
marginLeft:150,
marginBottom:10,
marginTop:15,
    alignItems:'center'
},
 

  containeraa: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 10
  },

  //MessageBubble

  messageBubble: {
      borderRadius: 5,
      marginTop: 8,
      marginRight: 10,
      marginLeft: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      flexDirection:'row',
      flex: 1
  },

  messageBubbleLeft: {
    backgroundColor: '#d5d8d4',
  },

  messageBubbleTextLeft: {
    color: 'black'
  },

  messageBubbleRight: {
    backgroundColor: '#66db30'
  },

  messageBubbleTextRight: {
    color: 'white'
  },
})

AppRegistry.registerComponent('App', () => App);