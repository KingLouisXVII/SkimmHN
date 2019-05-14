import React from 'react';
import { StyleSheet, Text, View, ScrollView, Button, RefreshControl, FlatList, Linking, TouchableHighlight, WebView, ActivityIndicator } from 'react-native';

const styles = StyleSheet.create({
  modal: {
     flex: 1,
     alignItems: 'center',
     paddingTop: 9,
     backgroundColor: '#262525',
  },
  modalTitle: {
    fontFamily: 'Hiragino Sans',
    fontSize: 22,
    fontWeight: 'bold',
    paddingTop: 20,
    margin: 11,
    backgroundColor: '#262525',
    color: '#FF6600'
  }
});

export default class Settings extends React.Component {
  render() {
    return (
      <View style={styles.modal}>
        <Text style={styles.modalTitle}>Settings</Text>
      </View>
    );
  }
}
