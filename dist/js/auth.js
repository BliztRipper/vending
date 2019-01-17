/*Staging Code*/
const url_tmn = "https://api-vending-payment-stg.truemoney.net";
const url_vending = "https://api-vending-stg.truemoney.net";
/*Production Code*/
// const url_tmn = 'https://api-vending.truemoney.net'
// const url_vending = 'https://api-vending.truemoney.net'

const url_string = window.location.href;
const url = new URL(url_string);
const txid = url.searchParams.get("txid");
const token = url.searchParams.get("token");
var SKUData = "";

(async function getData() {
  let response = await fetch(`${url_vending}/v4/GetSKU/${txid}`).then(r =>r.json())
  if (response.status_code != 0) {
    window.location.href = "error.html";
  }

  SKUData = response.data;

  let saleDesc = SKUData.product_name;
  // let saleCode = SKUData.sale_code;
  let price = (SKUData.amount_satang / 100).toFixed(2);
  let currency = SKUData.currency;
  let productImg = SKUData.image_url;
  let productImgDetail = SKUData.cover_image_url;

  let append_sale_description = (document.getElementById("saleDesc").innerHTML += saleDesc);
  // let append_sale_code = document.getElementById("saleCode").innerHTML += 'Product Code : ' + saleCode;
  let append_price = (document.getElementById("price").innerHTML += price);
  let append_productImg = (document.getElementById("image").src = productImg);

  if (currency === "THB") {
    document.getElementById("currency").innerHTML += "฿";
  }
})()

async function returnPayment() {
  postData = {
    third_party_tx_id: txid,
    amount_satang: SKUData.amount_satang.toString(),
    currency: SKUData.currency,
    description: SKUData.product_name,
    return_url: `${url_vending}/Notification`,
    payload: SKUData.payload
  }

  let purchaseBtn = document.getElementById("purchase-btn")
  var loading = document.getElementById("load")
  purchaseBtn.disabled = true;
  purchaseBtn.classList.add("disable");
  loading.classList.add("show");

  let paymentData = await fetch(`${url_tmn}/v4/Payment`, {
    method: "POST",
    headers: {"Content-Type": "application/json","token": `${token}` },
    body: JSON.stringify(postData)
  })
    .then(r => r.json())
    .then(json => json)

  let str = paymentData.description.split(':')
  if (paymentData.status_code = 0) {
    purchaseBtn.classList.remove("disable")
    window.location.href = "success.html"
  } else if(paymentData.status_code = 10103 && paymentData.description === 'Pending' ) {
      let timesRun = 0
      let interval = setInterval(function(){
        let paymentStatus = fetch(`${url_tmn}/v4/QueryTx/${txid}`, {
          method: "GET",
          headers: {"Content-Type": "application/json"}})
          .then(r => r.json()).then(json => json.data)
          .then(data => data.map(status=>{
            return status.payment_status
          }))
        timesRun += 1
        if(timesRun === 4){
          clearInterval(interval)
          window.location.href = "error.html"
        }else if(paymentStatus === "Payment Success"){
          clearInterval(interval)
          window.location.href = "success.html"
        } else {

        }
      }, 5000)

  }
  else if(paymentData.status_code = 35000 && str[0] === 'insufficient_fund ' ) {
    window.location.href = "nobalance.html"
  }
  else {
    window.location.href = "error.html"
  }
}

history.pushState(null, null, location.href)
window.onpopstate = function() {
  history.go(1);
};
