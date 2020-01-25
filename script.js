//get div code
const password = document.getElementById('password');

//random integer
function getRandomNum(lbound, ubound) {
  return Math.floor(Math.random() * (ubound - lbound)) + lbound;
}

//random character
function getRandomChar() {
  var numberChars = "0123456789";
  var lowerChars = "abcdefghijklmnopqrstuvwxyz";
  var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var otherChars = "`~!@#$%^&*()-_=+[{]}\\|;:'\",./?";
  var charSet = numberChars + lowerChars + upperChars + otherChars;
  return charSet.charAt(getRandomNum(0, charSet.length));
}

//password
let srt = "";
for(let i=0;i<20;i++){
  srt=srt+ getRandomChar();
}

//show in html
password.innerHTML = srt;