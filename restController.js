var express = require('express');
var app = express();
const { balance, getAllNft, createNft} = require('./fynd.js');



app.get('/getBalance/:publicKey', function (req, res) {
     setTimeout(async function (){
        var d= await balance(req.params.publicKey)
        res.status(200).json({ tokens: d });
    },1000); 
})


app.get('/createNft', function (req, res) {
   
    setTimeout(async function (){
       var d= await createNft
       res.status(200).json({ nftAddress: d });
   },1000); 
})

app.get('/getAllNft/:publicKey', function (req, res) {
   
    setTimeout(async function (){
       var nft= await getAllNft(req.params.publicKey)
       res.status(200).json(nft);
   },20000); 
})

/*app.post('/buyNft', function (req,res){
    setTimeout(async function (){
       await buyNft('7GX3etb3b1H1LuwrqgkGpNtL2KMUnXyijuN99MZvC7o6','FqTLTHzWBMD2LXwbRhUsDPzQ9BqzbjaKWWbRtM2ePx5F','FCWyqvraWVRDGSWBQzdNiFVBjU6Cabc9DPE1gidcvMYb')
 
        res.status(200);
    },1000); 


})*/

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Fynd app listening at http://%s:%s", host, port)
})
