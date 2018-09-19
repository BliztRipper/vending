document.getElementById('getData').addEventListener('click', getData);

async function getData()  {
  let response = await fetch('https://api.giphy.com/v1/gifs/random?api_key=38669919d392472c9751620b2645382b&tag=&rating=R').then( r => r.json())
  if (response.meta.msg === 'OK') {
    console.log('YESSSSS')
    console.log(response);
    let img_url = await response.data.images.original.url
    console.log(img_url);
  }
//     .then(json => {
//       console.log(json);
//       var x = document.getElementById("output");
//       x.setAttribute("src", json.data.images.original.url);
//     }).catch(err => console.log(err))
} 
