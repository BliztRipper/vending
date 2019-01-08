
/*Staging Code*/
const url_tmn = "https://api-vending-payment-stg.truemoney.net";
const url_vending = "https://api-vending-stg.truemoney.net";
/*Production Code*/
// const url_tmn = 'https://api-vending.truemoney.net'
// const url_vending = 'https://api-vending.truemoney.net'

const txid = sessionStorage.getItem("txid");
const tmnid = sessionStorage.getItem("tmnid");
const mobileNo = sessionStorage.getItem("mobileno");

// console.log(txid);
// console.log(tmnid);
// console.log(mobileNo);

/*Production Code*/
var otp = '';
var auth = '';
var status = '';
var otp_ref = '';
var auth_code = '';
var auth_no = "";
var otp_form = document.getElementById('otp');
var auth_form = document.getElementById('auth_otp');
var otpInput = document.getElementById('otp-form');
var authInput = document.getElementById('auth-form');

authInput.addEventListener('keyup', function (e) {
  if(authInput.value.length != 6){

  } else {
      checkauth();
  }
});


otp_no = {'mobile_number': mobileNo,"tmn_account" : mobileNo};
// console.log(otp_no)

async function checkotp(){
  const rawResponse = await fetch(`${url_tmn}/AuthApply/${txid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(otp_no)
  });
  const otp_data = await rawResponse.json();
  // console.log(otp_data);
  status = otp_data.status
  auth_code = otp_data.auth_code
  if (status != 0 ) {
    otp_ref = ' รหัสยืนยันเกิดข้อผิดพลาด'
  } else {
    otp_ref = otp_data.otp_ref
  }
  append_otpRef = document.getElementById("otp_ref").innerHTML += 'Ref รหัสยืนยัน :' + otp_ref;
};
checkotp();

async function checkauth(){
  auth = authInput.value
  auth_no = {'otp_ref': otp_ref,"otp_code" : auth, "agreement_id": "online_merchant", "auth_code": auth_code, "tmn_account" : mobileNo};

  let loading = document.getElementById("load");
  loading.classList.add("show")
  const rawResponse = await fetch(`${url_tmn}/AuthVerify/${txid}/${tmnid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(auth_no)
  });

  const auth_data = await rawResponse.json();
  status = auth_data.status_code
  if(status != 0) {
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