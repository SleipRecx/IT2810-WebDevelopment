import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
var queryString = require('query-string');
var jwt = require('json-web-token');
let secret = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"

class LoginStore extends EventEmitter{
  constructor(){
    super();
    this.token = {};
  }

  // Returns token
  getToken(){
    return this.token;
  }

 // Decrypts json web token to check id user is logged in
 loginCheck(){
    return new Promise(function(resolve, reject) {
      var token = localStorage.getItem("token");
      jwt.decode(secret, token, function (err, decode) {
        if(err){
          return resolve(false)
        }
        if(decode.loggedIn==="true"){
            resolve(true);
        }
        resolve(false)
      });
    });
  }

  // Encrypts payload and saves it in localStorage
  encrypt(payload){
    return new Promise(function(resolve, reject) {
        jwt.encode(secret, payload, function (err, token) {
          if(err){
            return reject(err)
          }
          localStorage.setItem("token", token)
          resolve(token)
        });
      });
    }

   // Decrypts token
  decrypt(token){
    return new Promise(function(resolve, reject) {
        jwt.decode(secret, token, function (err, decode) {
          if(err){
            return reject(err)
          }
          resolve(decode);
        });
      });
    }

   // Decrypts token and saves it then emits that token has been decrypted
   decryptToken(){
     this.decrypt(localStorage.getItem("token")).then((token)=>{
       this.token = token;
       this.emit("token_decrypted")
     });
    }

    // Handles a new user by saving information about them to db using the api
    handleNewUser(user_data){
      var payload = {
      "image_link": user_data.image,
      "facebook_id": user_data.face_id,
      "first_name": user_data.first_name,
      "last_name": user_data.last_name,
      "email": user_data.email,
      "rating": 5};
      var data = queryString.stringify(payload)
        fetch("http://localhost:9001/api/user",
        {
            method: "POST",
            body: data,
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
        .then(r => r.json()).then(data => {
          user_data.id = data.insertId;
          this.encrypt(user_data);
          this.emit('change');
        })

    }

    // Handles login
    handleLogin(user_data){
      var url = "http://localhost:9001/api/user/face/" + user_data.face_id
      fetch(url).then(r => r.json())
      .then(data => {
        if(data.length === 0){
          this.handleNewUser(user_data)
        }
        else{
          user_data.id = data[0].user_id
          this.encrypt(user_data);
          this.emit('change');
        }
      })
      .catch(e => console.log("async function failed"))
    }

  // Listens for dispatched actions
  handleActions(action){
    switch(action.type){
      case "GET_SESSION": {
        this.decryptToken()
          break;
      }
      case "LOGIN": {
          this.handleLogin(action.token)
          break;
      }
      case "LOGOUT": {
          localStorage.clear();
          this.emit('change');
          break;
      }

      default: {
        break;
      }

    }
  }

}

 // Registeres object to dispatcher and exports it
const loginStore = new LoginStore();
dispatcher.register(loginStore.handleActions.bind(loginStore));
export default loginStore;
