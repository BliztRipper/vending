
/*Dev Code*/
// const txid = 'df7b2ca28514482ab7af3bf829759302';
// const tmnid = 'tmn.10000000001';
// const mobileNo = '0891916415';

/*Production Code*/
const url_tmn = 'https://api-cinema.truemoney.net'
const url_vending = 'https://v.truemoney.net'
const url_string = window.location.href;
const url = new URL(url_string);
const txid = url.searchParams.get("txid");
const tmnid = url.searchParams.get("tmnid");
const mobileNo = url.searchParams.get("mobileno");
var SKUData = '';

(async function getData() {
  // let tokenCheck = await fetch(`${url_tmn}/HasToken/${txid}`, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  // }).then(r => r.json())
  // if(tokenCheck.status_code  !== 0){
  //   sessionStorage.setItem("txid",txid);
  //   sessionStorage.setItem("tmnid",tmnid);
  //   sessionStorage.setItem("mobileno",mobileNo);
  //   window.location.href=`otp.html`
  // } else{
  //   // console.log('Token is '+ tokenCheck.description)
  //   // console.log(tokenCheck.status_code)
  // }

  let response = await fetch(`${url_vending}/GetSKU/${txid}`).then(r => r.json())
  if (response.status_code != 0) {
    window.location.href='error.html'
  } else{
    let myJSON = JSON.stringify(response);
  }

  SKUData = response.data

  let saleDesc = SKUData.product_name;
  // let saleCode = SKUData.sale_code;
  let price = (SKUData.amount_satang / 100).toFixed(2);
  let currency = SKUData.currency;
  let productImg = SKUData.image_url;
  let productImgDetail = SKUData.cover_image_url;

  let append_sale_description = document.getElementById("saleDesc").innerHTML += saleDesc;
  // let append_sale_code = document.getElementById("saleCode").innerHTML += 'Product Code : ' + saleCode;
  let append_price = document.getElementById("price").innerHTML += price;
  let append_productImg = document.getElementById("image").src = productImg;


  if (currency === 'THB') {
    document.getElementById("currency").innerHTML += '฿';
  }

})();

async function returnPayment() {
  postData = {'third_party_tx_id': txid, 'amount_satang': SKUData.amount_satang.toString(), 'currency': SKUData.currency, 'return_url': `${url_vending}/Notification`, 'payload': SKUData.payload}
  let paymentData = await fetch(`${url_tmn}/Payment/${tmnid}/${mobileNo}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
  }).then(r => r.json()).then( json => json)
    console.log(paymentData);
    if (paymentData.status_code !== 0) {
      window.location.href = 'error.html'
    } else {
      let loading = document.getElementById("load");
      loading.classList.add("show")
      window.location.href = 'success.html'
    }
  }

  history.pushState(null, null, location.href);
  window.onpopstate = function () {
      history.go(1);
  };