/*Staging Code*/
// const url_tmn = 'https://api-cinema.truemoney.net'
// const url_vending = 'https://v.truemoney.net'
/*Production Code*/
const url_tmn = 'https://api-vending.truemoney.net'
const url_vending = 'https://api-vending.truemoney.net'

const url_string = window.location.href;
const url = new URL(url_string);
const txid = url.searchParams.get("txid");
const mobileNo = sessionStorage.getItem("mobileno");
const payment_code = url.searchParams.get("payment_code");

(async function getData() {
  let response = await fetch(`${url_vending}/GetSKU/${txid}`).then(r => r.json())
  if (response.status_code != 0) {
    window.location.href='error.html'
  } else{
    // console.log(response);
    // console.log(txid);
    // console.log(response.description);
    var myJSON = JSON.stringify(response);
  }

  let fetchData = response.data

  let saleDesc = fetchData.product_name;
  // let saleCode = fetchData.sale_code;
  let price = fetchData.amount_satang;
  let currency = fetchData.currency;
  let productImg = fetchData.image_url;
  let productImgDetail = fetchData.cover_image_url;

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
    // console.log(paymentData);
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