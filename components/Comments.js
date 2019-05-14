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
  },
  comments: {
    fontSize: 16,
    margin: 11,
    paddingLeft: 11,
    backgroundColor: '#262525',
    fontFamily: 'Courier',
    color: '#BF360C'
  },
  parent: {
    marginTop: 11,
    paddingLeft: 11,
    backgroundColor: '#262525',
    fontFamily: 'Hiragino Sans',
    color: '#FF6600'
  },
  replyCount: {
    fontSize: 14,
    paddingLeft: 6,
    marginLeft: 6,
    fontFamily: 'Courier',
    color: '#FF6600'
  }
});

export default class Comments extends React.Component {
  constructor() {
    super();
    this.state = {
      comments: [],
      isCancelled: false
    };
  }

  componentDidMount() {
    const item = this.props.navigation.getParam('story');
    this.fetchComments(item);
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  renderSeparator = () => {
     return (
       <View
         style={{
           height: 1,
           backgroundColor: "#263238",
           width: '86%',
           marginLeft: '7%',
           marginRight: '7%',
         }}
       />
     );
  };

  fetchComments = (item) => {
    {item.kids ?
      item.kids.map(item =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${item}.json?print=pretty`)
        .then(r => r.json())
        .then(r => {
          !this.isCancelled && this.setState({
            comments: [...this.state.comments, r],
          });
        })
        .catch(function (err) {
          return console.log(err);
        })
      )
      :
      !this.isCancelled && this.setState({
        comments: [],
      });
    }
  }

  render() {
    const item = this.props.navigation.getParam('story');
    const parent = this.props.navigation.getParam('parent');
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();
    return (
      <View style={styles.modal}>
        {
          item.title ?
            <Text
              style={styles.modalTitle}
              onPress={ () => this.props.navigation.navigate('WebView', { uri: item }) }>{item.title}</Text>
            :
            null
        }
        <FlatList
          data={this.state.comments}
          extraData={this.state}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={this.renderSeparator}
          renderItem={ ({item}) =>
                      <Text
                        style={styles.comments}
                        onPress={ () =>
                                  item.kids ?
                                  this.props.navigation.push('Comments', { story: item , parent: item.text })
                                  :
                                  null
                                }
                                >
                        <Text>{entities.decode(item.text).replace(/<(?:.|\n)*?>/gm, "\n\n") + "\n\n"}</Text>
                        <Text style={styles.replyCount}>
                        {
                          (item.kids ? item.kids.length : 0)
                          +
                          (item.kids && item.kids.length === 1 ? " reply" : " replies")
                        }
                        </Text>
                      </Text>
                    }
        />
        {
          item.title ?
            null
          :
          <Button
           title="<--- back to top comments"
           color='#FF6600'
           onPress={()=>this.props.navigation.navigate('Comments')}
         />
        }
      </View>
    );
  }
}
