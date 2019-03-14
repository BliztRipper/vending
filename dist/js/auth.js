/*Staging Code*/
const url_tmn = "https://api-vending-payment-stg.truemoney.net";
const url_vending = "https://api-vending-stg.truemoney.net";
/*Production Code*/
// const url_tmn = 'https://api-vending-payment.truemoney.net'
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
    return_url: `${url_vending}/v4/Notification`,
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
  }).then(r => r.json())

  let str = paymentData.description.split(':')

  if (paymentData.status_code == 0) {
    purchaseBtn.classList.remove("disable")
    window.location.href = "success.html"
  } else if(paymentData.status_code == 10103 && paymentData.description === 'Pending' ) {
    queryTx()
  }
  else if(paymentData.status_code == 35000 && str[0] === 'insufficient_fund ' ) {
    window.location.href = "nobalance.html"
  }
  else {
    window.location.href = "error.html"
  }
}

let queryTxCounter = 0
let queryTxTimer
let totalEachResponseInSec = 5
let totalTimeoutInSec = 30
function queryTx () {
  let sendDate = (new Date()).getTime()
  if (queryTxTimer) {
    clearTimeout(queryTxTimer)
    queryTxTimer = ''
  }
  try {
    fetch(`${url_tmn}/v4/QueryTx/${txid}`)
    .then(response => response.json())
    .then(data => {
      if (data.status_code === 0 && queryTxCounter < (totalTimeoutInSec / totalEachResponseInSec)) {
        let instantPaymentStatusData = data.data
        console.dir(instantPaymentStatusData)
        let paymentIsSuccess = false
        let paymentIsNotSuccess = false
        instantPaymentStatusData.forEach((paymentItem) => {
          paymentIsSuccess = paymentItem.payment_status === 'Payment Success' ? true : false
          paymentIsNotSuccess = paymentItem.payment_status === 'Payment Failed' ? true : false
          if (paymentIsSuccess) {
            window.location.href = "success.html"
          }
          if (paymentIsNotSuccess) {
            window.location.href = "error.html"
          }
        });
        if (!paymentIsSuccess && !paymentIsNotSuccess) {
          let responseDate = (new Date()).getTime()
          let totalResponseMs =  (totalEachResponseInSec * 1000) - (responseDate - sendDate)
          totalResponseMs = totalResponseMs > 0 ? totalResponseMs : 0
          queryTxTimer = setTimeout(() => {
            queryTxCounter += 1
            queryTx()
          }, totalResponseMs);
        }
      } else {
        window.location.href = "error.html"
      }

    })
  } catch (error) {
    console.error(error)
  }
}

history.pushState(null, null, location.href)
window.onpopstate = function() {
  history.go(1);
};
