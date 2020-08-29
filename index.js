var hive = require('@hiveio/hive-js');

let wif = ''
let voter = ''


function votebotstart(){
	hive.api.getDynamicGlobalProperties(function(err, result) {
	  if(!err){
       getblock(result.head_block_number)
       return;
	  }
	});
}

function getblock(blockNum){
	hive.api.getBlock(blockNum, function(err, result) {
	  if(err || result===null){
	  	setTimeout(getblock, 1000, blockNum)
	  	return;
	  }
	  if(!err){
         result.blockNum = blockNum
         blockprocessor(result)
         return;
	  }
	});
}

function blockprocessor(block){
  for(var i=0;i<block.transactions.length;i++){
  	cursor = block.transactions[i]
  	for(var j=0;j<cursor.operations.length;j++){
      ops=cursor.operations[j]
      if(ops[0]==='vote' && ops[1].voter === 'nrg'){
      	upvotepost(ops[1].permlink, ops[1].weight, ops[1].author)
      }
  	}
  }
  block.blockNum++;
  getblock(block.blockNum)
  return;
}

function upvotepost(permlink, weight, author){
	hive.broadcast.vote(wif, voter, author, permlink, weight, function(err, result) {
	  console.log(err, result);
	});
}

votebotstart()