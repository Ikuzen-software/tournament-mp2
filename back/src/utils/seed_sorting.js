
function seeding(numPlayers, pls) {
  let rounds = Math.log(numPlayers) / Math.log(2) - 1;
  
  if(pls){
    pls = [1, 2];
  } 
  for (let i = 0; i < rounds; i++) {
    pls = nextLayer(pls, numPlayers);
  }
  pls = pls.map(d => d > numPlayers ? 'bye' : d)
  console.log('Round 1 '+ pls)
  return pls;
}
function nextLayer(pls) {
  let out = [];
  let length = pls.length * 2 + 1;
  pls.forEach(function (d) {
    out.push(d);
    out.push(length - d);
  });
  return out;
}
function seedAllRounds(numPlayers){
  let rnd = seeding(numPlayers);
  while(rnd.length > 1){
    seeding(numPlayers, rnd)
  }
}
seedAllRounds(17)

// pls = pls.map(d => d > numPlayers ? 'bye' : d)
//   console.log('Round 1 '+ pls)
