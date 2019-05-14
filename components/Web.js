import React from 'react';
import { StyleSheet, Text, View, ScrollView, Button, RefreshControl, FlatList, Linking, TouchableHighlight, WebView, ActivityIndicator } from 'react-native';

export default class Web extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: true };
  }
  hideSpinner() {
    this.setState({ visible: false });
  }
  render() {
    const uri = this.props.navigation.getParam('uri');
    return (
      <View style={{ flex: 1 }}>
      <WebView
       source={{uri: uri.url}}
       onLoad={() => this.hideSpinner()}
       />
       {this.state.visible && (
         <ActivityIndicator
           style={{ paddingBottom: '50%' }}
           size="large"
         />
       )}
       <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor:'#262525'}}>
         <Button
          title="<--- comments"
          color='#FF6600'
          onPress={()=>this.props.navigation.goBack()}
        />
         <Button
          title="browser --->"
          color='#FF6600'
          onPress={()=>Linking.openURL(uri.url)}
        />
       </View>
     </View>
   );
  }
}
