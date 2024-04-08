import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';
import {TextInput, Modal, ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';

export default function App() {
  const [list, setList] = useState([]);
  const [modalUser, setModalUser] = useState(false);
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    getListUsers();
  }, []);

  const getListUsers = () => {
    fetch("https://reqres.in/api/users", {
      method: "GET"
    }).then(res => {
      return res.json();
    }).then(res => {
      console.log(res);
      if (res && res.data) {
        setList(res.data);
      }
    }).catch(err => {
      console.log(err);
    });
  };

  const handleRemove = (user) => {
    const updatedList = list.filter(item => item.id !== user.id);
   setList(updatedList);
  }

  const handleCreate = () => {
    clearForm();
      setModalUser(true);
  }

  const handleCloseModal = () => {
    setModalUser(false);
    setId("");
  }

  const handleSave = () => {
    // Check if required fields are not empty
   // Check if required fields are not empty
   if (!firstname || !lastname || !email) {
    alert("Please fill in all fields");
    return;
  }

  // Construct user object
  const user = {
    first_name: firstname,
    last_name: lastname,
    email: email
  };

  // Check if id is set (editing existing user)
  if (id !== "") {
    // Send PUT request to update user
    fetch(`https://reqres.in/api/users/${id}`, {
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      // Update user list with updated user
      setList(list.map(item => item.id === id ? res : item));
      // Close modal
      setModalUser(false);
      // Clear form
      clearForm();
    })
    .catch(err => {
      console.log(err);
      alert("Failed to update user");
    });
  } else {
    // Send POST request to add new user
    fetch("https://reqres.in/api/users", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      // Update user list with newly added user
      setList([...list, res]);
      // Close modal
      setModalUser(false);
      // Clear form
      clearForm();
    })
    .catch(err => {
      console.log(err);
      alert("Failed to add new user");
    });
  }
  }

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setId("")
  }

  const handleEdit = (item) => {
    setId(item.id)
    setFirstName(item.first_name);
    setLastName(item.last_name);
    setEmail(item.email);
    setModalUser(true);
  }

  return (
    <SafeAreaView style={styles.container}>

      <Modal
        visible={modalUser}
         >
          <SafeAreaView>
          <View style={styles.newUserHeader}>
            
            <TouchableOpacity onPress={handleCloseModal}>
                <AntDesign style={{marginLeft: 10}} name={'left'} size={30} />
            </TouchableOpacity>
            <Text style={styles.txtNewUser}>New User</Text>
          </View>
          <View style={{
            paddingHorizontal: 10,
            marginTop:10,}}>
              <Text   style={styles.inputText}>First Name</Text>
            <TextInput 
            value={firstname}
            onChangeText={(text)=>{setFirstName(text)}}
            placeholder='First Name' 
            style={styles.txtInput}/>
            <Text  style={styles.inputText}>Last Name</Text>
            <TextInput 
            placeholder='Last Name'
            value={lastname}
            onChangeText={(text)=>{setLastName(text)}} 
            style={styles.txtInput}/>
            <Text style={styles.inputText}>E-mail</Text>
            <TextInput 
            placeholder='E-mail' 
            value={email}
            onChangeText={(text)=>{setEmail(text)}}
            style={styles.txtInput}/>
            <TouchableOpacity onPress={handleSave} style={styles.btnContainer}>
              <Text style={styles.btnAdd}>{id !== "" ? "Edit" : "Add"}</Text>
            </TouchableOpacity>
          </View>
            
          </SafeAreaView>
          
      </Modal>

      <View style={styles.rowBetween}>
      <Text style={styles.txtMain}>User</Text>
      <TouchableOpacity  style={styles.btnNew} onPress={handleCreate}>
        <AntDesign name={'plus'} size={30} />
      </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{
        paddingHorizontal: 10
      }}>
        {list.map((item,index)=>
          {return ( 
            <View style={styles.rowBetween2} key={index}>
            <View style={styles.item} key={index}>
              
              <Text style={styles.Name}>{item.first_name} {item.last_name}</Text>
              <Text style={styles.Email}>{item.email}</Text>
              
            </View>
              <View>
              <TouchableOpacity style={styles.btnEdit} onPress={() => handleEdit(item)}>
                  <AntDesign name={'edit'} color={'#FFF'} size={20} />
                </TouchableOpacity>
              <TouchableOpacity style={styles.btnDelete} onPress={() => handleRemove(item)}>
                  <AntDesign name={'delete'} color={'#FFF'} size={20} />
                </TouchableOpacity>
                
              </View>
            </View>
            

          )}
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rowBetween:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    
    marginBottom: 15,
    borderRadius: 50,
    alignItems: 'center',
  },
  rowBetween2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'black',
    marginBottom: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },
  txtMain: {
    fontSize: 25,
    fontWeight: 'bold',
    padding: 10,
    marginLeft: 160,
  },
  item: {
    paddingLeft: 30,
    paddingVertical: 10,
    
    marginBottom: 15,
    borderRadius: 50,
    alignItems: 'center',
  },
  Name:{
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFF',
    fontSize: 20
  },
  Email:{
    color: '#FFF',
  },
  txtDelete:{
    color: 'red',
    paddingRight: 30,
  },
  btnNew: {
    padding: 10,
    
  },
  txtInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 30,
    borderRadius: 50,
  },
  btnContainer: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: 'black',
  },
  btnAdd: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 15,
  },
  txtNewUser: {
    paddingRight: 150,
    fontWeight: 'bold',
    fontSize: 20,
    
  },
  newUserHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  inputText: {
    fontSize: 15,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  btnDelete: {
    marginRight: 30,
  },
  btnEdit: {
    marginBottom: 15
  },
});