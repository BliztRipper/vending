const url_tmn = 'https://api-cinema.truemoney.net'
const url_vending = 'https://v.truemoney.net'
const url_string = window.location.href;
const url = new URL(url_string);
const txid = url.searchParams.get("txid");
const payment_code = url.searchParams.get("payment_code");

(async function getData() {
  let response = await fetch(`${url_vending}/GetSKU/${txid}`).then(r => r.json())
  if (response.status_code != 200) {
    // window.location.href='error.html'
  } else{
    console.log(response);
    console.log(txid);
    console.log(response.description);
    var myJSON = JSON.stringify(response);
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
  let paymentData = await fetch(`https://v.truemoney.net/Payment/${txid}/${payment_code}`).then(r => r.json()).then( json => json.status_code)
    console.log(paymentData);
    if (paymentData !== 200) {
      window.location.href = 'error.html'
    } else {
      window.location.href = 'success.html'
    }
  }

