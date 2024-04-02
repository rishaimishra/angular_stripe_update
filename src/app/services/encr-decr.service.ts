import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncrDecrService {

  constructor() { }
 
 // The set method is use for encrypt the value.
  set(keys, value){
    // var key = CryptoJS.enc.Utf8.parse(keys);
    // var iv = CryptoJS.enc.Utf8.parse(keys);
    // var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
    // {
    //     keySize: 128 / 8,
    //     iv: iv,
    //     mode: CryptoJS.mode.CBC,
    //     padding: CryptoJS.pad.Pkcs7
    // }
    // );
    // return encrypted.toString();


   
    var encrypted = CryptoJS.AES.encrypt(value, keys);
    // console.log(encrypted);
    return encodeURIComponent(encrypted.toString());

    // var encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), '#SLM2019Matrix').toString();
    // return encrypted;

  }

  //The get method is use for decrypt the value.
  get(keys, value){
    // var key = CryptoJS.enc.Utf8.parse(keys);
    // var iv = CryptoJS.enc.Utf8.parse(keys);
    // var decrypted = CryptoJS.AES.decrypt(value, key, {
    //     keySize: 128 / 8,
    //     iv: iv,
    //     mode: CryptoJS.mode.CBC,
    //     padding: CryptoJS.pad.Pkcs7
    // });

    // return decrypted.toString(CryptoJS.enc.Utf8);
   

    var decrypted = CryptoJS.AES.decrypt(value, keys);
    //console.log(decrypted.toString(),'decrypted data');
    //console.log(CryptoJS.enc.Utf8.stringify(decrypted),'decrypted data2');
    return CryptoJS.enc.Utf8.stringify(decrypted);
   // return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
