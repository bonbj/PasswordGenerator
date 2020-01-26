//get div code
const password = document.getElementById('password');

//random integer
getRandomNum = (lbound, ubound) => {
  return Math.floor(Math.random() * (ubound - lbound)) + lbound;
}

//random character
getRandomChar = (number,lower,upper,other) => {

  //options
  const numberChars = "0123456789";
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const otherChars = "`~!@#$%^&*()-_=+[{]}\\|;:'\",./?";

  let charSet = "";

  //filter
  if(number === true){
    charSet = charSet + numberChars;
  }

  if(lower === true){
    charSet = charSet + lowerChars;
  }

  if(upper === true){
    charSet = charSet + upperChars;
  }

  if(other === true){
    charSet = charSet + otherChars;
  }
  
  return charSet.charAt(getRandomNum(0, charSet.length));
}

//password
key = (measure,number,lower,upper,other) => {

  //generate password by length
  let srt = "";
  for(let i=0;i<measure;i++){
    srt=srt+ getRandomChar(number,lower,upper,other);
  }

  //show in html
  password.innerHTML = srt;
}

//call the password
key(50,true,true,true,true);