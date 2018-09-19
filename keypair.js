let​​​​ fs​​​ = ​​​require​(​'fs'​);
let​​​​ crypto​​​ = ​​​require​(​'crypto'​);

function​​​​ createSignature​(​data​)​​ {​​​​​​​​​
  var​​​​ signer​​​ = ​​​crypto​.​createSign​(​'sha256'​);​​​​​​​​​
  let​​​​ private_key​​​ = ​​​fs​.​readFileSync​(​'private_key.pem'​).​toString​()​​​​​​​​​ 
  signer​.​update​(​data​);​
  ​​
  return​​​​ signer​.​sign​(​private_key​, ​​​'base64'​);
}​​​​​​​​

function​​​​ verifySignature​(​signature​, ​​​data​) {
  var​​​​ verifier​​​ = ​​​crypto​.​createVerify​(​'sha256'​)​​​​​​​​​ 
  let​​​​ public_key​​​ = ​​​fs​.​readFileSync​(​'public_key.pem'​).​toString​()​​​​​​​​​ 
  verifier​.​update​(​data​);​

  return​​​​ verifier​.​verify​(​public_key​, ​​​signature​, ​​​'base64'​);
}​​