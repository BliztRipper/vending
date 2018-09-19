/*Dev Code*/
const txid = sessionStorage.getItem("txid");
const tmnid = sessionStorage.getItem("tmnid");
const mobileNo = sessionStorage.getItem("mobileno");

console.log(txid);
console.log(tmnid);
console.log(mobileNo);

/*Production Code*/
var otp = '';
var auth = '';
var status = '';
var otp_ref = '';
var auth_code = '';
var otp_form = document.getElementById('otp');
var auth_form = document.getElementById('auth_otp');
var otpInput = document.getElementById('otp-form');
var authInput = document.getElementById('auth-form');

authInput.addEventListener('keyup', function (e) {
  var auth = authInput.value  
  auth_no = {'otp_ref': otp_ref,"otp_code" : auth, "agreement_id": "online_merchant", "auth_code": auth_code, "tmn_account" : mobileNo};
  console.log(auth_no)
  if(authInput.value.length != 6){
      
  } else {
      let loading = document.getElementById("load");
      loading.classList.add("show")
      checkauth();
  }
});


otp_no = {'mobile_number': mobileNo,"tmn_account" : mobileNo};
console.log(otp_no)

async function checkotp(){
  const rawResponse = await fetch(`https://v.truemoney.net/AuthApply/${txid}/${tmnid}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(otp_no)
  });
  const otp_data = await rawResponse.json(); 
  console.log(otp_data);
  status = otp_data.status
  auth_code = otp_data.auth_code
  if (status != 200 ) {
    otp_ref = ' รหัสยืนยันเกิดข้อผิดพลาด'
  } else {
    otp_ref = otp_data.otp_ref
  }
  append_otpRef = document.getElementById("otp_ref").innerHTML += 'Ref รหัสยืนยัน :' + otp_ref;
};
checkotp();

async function checkauth(){
  const rawResponse = await fetch(`https://v.truemoney.net/AuthVerify/${txid}/${tmnid}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(auth_no)
  });
  const auth_data = await rawResponse.json(); 
  console.log(auth_data);
  if(status != 200) {
    window.location.href='authError.html'
  } else {
    console.log('success');
    window.location.href=`index.html?txid=${txid}&tmnid=${tmnid}&mobileno=${mobileNo}`
  }
 };


 history.pushState(null, null, location.href);
 window.onpopstate = function () {
     history.go(1);
 };