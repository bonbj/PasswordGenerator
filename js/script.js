//get div code
const password = document.getElementById('password');
const generator = document.getElementById('generator');
let numberDiv = document.getElementsByName('number');
let lowerDiv = document.getElementsByName('lower');
let upperDiv = document.getElementsByName('upper');
let otherDiv = document.getElementsByName('other');

//random integer
getRandomNum = (lbound, ubound) => {
  return Math.floor(Math.random() * (ubound - lbound)) + lbound;
}

//random character
getRandomChar = () => {

  //options
  const numberChars = "0123456789";
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const otherChars = "`~!@#$%^&*()->_=+[{]}\\|;:'<\",./?";

  let charSet = "";

  //filter
  if(numberDiv[0].checked === true){
    charSet = charSet + numberChars;
  }

  if(upperDiv[0].checked === true){
    charSet = charSet + upperChars;
  }

  if(otherDiv[0].checked === true){
    charSet = charSet + otherChars;
  }

  if(lowerDiv[0].checked === true){
    charSet = charSet + lowerChars;
  }else{
    if(charSet.length === 0){
      charSet = charSet + lowerChars;
    }
  }
  
  return charSet.charAt(getRandomNum(0, charSet.length));
}

//password
key = () => {
  const measure = document.getElementById('lenght').value;

  //prevent password small or big
  if(measure < 8){
    measure = 8;
  }
  if(measure > 50){
    measure = 50;
  }

  //generate password by length
  let srt = "";
  for(let i=0;i<measure;i++){
    let temp = getRandomChar();
    if(temp === "<"){
      srt=srt+"&lt;";
    }else if(temp === ">"){
      srt=srt+"&gt;";
    }else{
      srt=srt+temp;
    }
  }

  //show in html
  password.innerHTML = srt;
}

//call the password
key();