
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

(async function getData() {
  let tokenCheck = await fetch(`${url_tmn}/HasToken/${tmnid}`).then(r => r.json())
  if(tokenCheck.description  === 'Invalid parameters'){
    sessionStorage.setItem("txid",txid);
    sessionStorage.setItem("tmnid",tmnid);
    sessionStorage.setItem("mobileno",mobileNo);
    window.location.href=`otp.html`
  } else if (tokenCheck.description === 'Transaction is not found or expired'){
    window.location.href='error.html'
  } else{
    console.log('Token is '+ tokenCheck.description)
    console.log(tokenCheck.status_code)
  }

  let response = await fetch(`${url_vending}/GetSKU/${txid}`).then(r => r.json())
  if (response.status_code != 200) {
    // window.location.href='error.html'
  } else{
    let myJSON = JSON.stringify(response);
  }

  let fetchData = response.data

  let saleDesc = fetchData.sale_description;
  let saleCode = fetchData.sale_code;
  let price = fetchData.sale_amount;
  let currency = fetchData.sale_currency;
  let productImg = fetchData.product_image_url;
  let productImgDetail = fetchData.product_detail_image_url;

  let append_sale_description = document.getElementById("saleDesc").innerHTML += saleDesc;
  let append_sale_code = document.getElementById("saleCode").innerHTML += 'Product Code : ' + saleCode;
  let append_price = document.getElementById("price").innerHTML += price;
  let append_productImg = document.getElementById("image").src = productImg;


  if (currency === 'THB') {
    document.getElementById("currency").innerHTML += '฿';
  }

})();

async function returnPayment() {
  let paymentData = await fetch(`https://v.truemoney.net/Payment/${txid}/${tmnid}`).then(r => r.json()).then( json => json.status_code)
    console.log(paymentData);
    if (paymentData !== 200) {
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