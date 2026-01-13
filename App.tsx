
import { SafeAreaView } from 'react-native-safe-area-context';
import { PermissionsAndroid, Platform, StatusBar, StyleSheet, useColorScheme, Text, TextInput, Button, View, FlatList, Alert } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import messaging from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";

function App() {
  const isDarkMode = useColorScheme() === 'light';


  // const requestPermission = async () => {
  //   try {
  //     const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  //     if (result === PermissionsAndroid.RESULTS.GRANTED) {
  //       // requestToken();
  //       console.log(result)
  //     } else {
  //       Alert.alert("Permission Denied");
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // };

  // const requestToken = async () => {
  //   try {
  //     await messaging().registerDeviceForRemoteMessages();
  //     const token = await messaging().getToken();
  //     console.log("Token** ", token);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    }

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Best crud app',
      body: 'Notification aayi hai',
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  // useEffect(() => {
  //   requestPermission();
  // }, []);

  type Item = {
    id: string,
    title: string
  };

  const [items, setItems] = useState<Item[]>([]);
  const [text, setText] = useState("");

  const addItem = () => {
    if (!text.trim()) return;
    setItems([...items, { id: Date.now().toString(), title: items.length + 1 + ". " + text }]);
    setText("");
  }

  const clearList = () => {
    setItems([]);
  }

  const deleteLast = () => {
    if (items.length !== 0) {
      setItems(prevItems => prevItems.slice(0, -1));
    } else {
      console.log("No items in the list")
    }
  }


  const deleteFirst = () => {
    if (items.length !== 0) {
      setItems(prevItems => prevItems.slice(1, items.length));
    } else {
      console.log("No items in the list")
    }
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Basic CRUD App</Text>
        <View style={styles.itemBox}>
          <FlatList data={items} keyExtractor={item => item.id} renderItem={({ item }) => (
            <Text style={styles.item}>{item.title}</Text>
          )} />
        </View>
        <TextInput style={styles.textbox} value={text} onChangeText={setText} placeholder='Type item here' />
        <View style={{ marginBottom: 8, width: 100, alignSelf: 'center' }}>
          <Button title='Add Item' onPress={addItem} />
        </View>
        <View style={{ marginBottom: 8, width: 200, alignSelf: 'center' }}>
          <Button title='Remove Last Item' onPress={deleteLast} />
        </View>
        <View style={{ marginBottom: 8, width: 200, alignSelf: 'center' }}>
          <Button title='Remove First Item' onPress={deleteFirst} />
        </View>
        <View style={{ marginBottom: 8, width: 100, alignSelf: 'center' }}>
          <Button title='Clear List' onPress={onDisplayNotification} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#005461'
  },
  textbox: {
    backgroundColor: 'white',
    marginBottom: 20
  },
  itemBox: {
    height: 300,
    backgroundColor: '#0C7779',
    padding: 10
  },
  heading: {
    paddingTop: 20,
    alignSelf: 'center',
    marginBottom: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3BC1A8'
  },
  item: {
    alignSelf: 'center',
    fontSize: 24,
    color: '#F5FBE6'
  }
});

export default App;
