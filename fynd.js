const splToken = require('@solana/spl-token');
const web3 =  require('@solana/web3.js');


let firstWinPrivKey = [40,182,167,76,24,236,20,84,255,50,226,138,48,105,193,238,25,232,167,65,184,107,231,248,126,29,196,97,195,107,15,169,93,31,206,120,150,67,154,184,137,168,171,66,191,188,201,126,98,167,41,7,50,211,54,18,12,232,3,34,222,236,108,81]
    .slice(0,32);
let secretKey = Uint8Array.from(firstWinPrivKey);
let accountFromSeed = web3.Keypair.fromSeed(secretKey);

let secondWinPrivKey = [78,239,231,124,212,13,219,55,100,57,72,102,135,12,99,214,55,190,35,191,52,78,35,107,149,123,177,151,78,17,197,87,142,207,217,32,79,235,82,185,177,94,167,57,193,205,232,197,2,104,207,212,60,129,129,34,234,75,158,119,186,237,132,181]
    .slice(0,32);
let secretnKey = Uint8Array.from(secondWinPrivKey);
let accountFromnSeed = web3.Keypair.fromSeed(secretnKey);

let c = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');

 //gives balance of an account
 async function balance(address){
  var number= await c.getBalance(new web3.PublicKey(address));
  return number;
   }

  //creates nft and return its address
 async function createNft(){ 

    var mint = await splToken.Token.createMint(c, accountFromSeed, accountFromSeed.publicKey, null, 0, splToken.TOKEN_PROGRAM_ID) 
    var myToken = await mint.getOrCreateAssociatedAccountInfo(accountFromSeed.publicKey);
    await mint.mintTo(myToken.address,  accountFromSeed.publicKey, [], 1);
    return mint.publicKey.toBase58();

   };

   //returns all nft for an account
  async function getAllNft(publickey){
    var sourceContent = new Array();
    var nft = await c.getParsedTokenAccountsByOwner(
       new web3.PublicKey(publickey),
        {
          programId: splToken.TOKEN_PROGRAM_ID
        },
        'confirmed'
      ).then(async (parsedTokenAccounts) =>{
          for (const tokenAccountInfo of parsedTokenAccounts.value) {
            const mintAddress = tokenAccountInfo.account.data.parsed.info.mint
            sourceContent.push('https://explorer.solana.com/address/'+mintAddress+'/largest?cluster=devnet');
          
        }
      }
      ).catch()
        .finally(() => {
          // to clear if any
        })
      
        return sourceContent;
  };

  async function buyNft(fromaccount,toAccountAdd,tokenAdress){
            const mint=  new splToken.Token(
            c,                         // connection
            new web3.PublicKey(tokenAdress),    // publicKey of token
            splToken.TOKEN_PROGRAM_ID,       // programId deployed on chain
            accountFromSeed,                    // payer
        )
        // Get the token account of the fromWallet Solana address, if it does not exist, create it         
        const fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
          new web3.PublicKey(fromaccount),
        );  
        //get the token account of the toWallet Solana address, if it does not exist, create it
        const toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
          new web3.PublicKey(toAccountAdd),
        );
        // Add token transfer instructions to transaction
        const transaction = new web3.Transaction().add(
          splToken.Token.createTransferInstruction(
            splToken.TOKEN_PROGRAM_ID,
            fromTokenAccount.address,
            toTokenAccount.address,
            accountFromSeed.publicKey,
            [],
            1,
          ),
        );  
        // Sign transaction, broadcast, and confirm
        const signature = await web3.sendAndConfirmTransaction(
          c,
          transaction,
          [accountFromSeed],
          {commitment: 'confirmed'},
        );
        console.log('SIGNATURE', signature);      
  };

  module.exports = {
    balance: balance,
    createNft: createNft(),
    getAllNft: getAllNft,
    //buyNft: buyNft(),
  };
