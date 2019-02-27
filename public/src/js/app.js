

var officerCardArea = document.querySelector('#main_cont_row');
var loginbutton = document.querySelector('#login');
var key1;

if(!window.Promise){
    window.Promise=Promise;
}

if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js').then(function(){
        console.log("Service Worker Registered")
    }).catch(function(err){
        console.log(err);
    });
}

function clearCards(){
    while(officerCardArea.hasChildNodes()){
      officerCardArea.removeChild(officerCardArea.lastChild);
    }
  }
  
  function createOfficerCard(data) {
    var cardGrid = document.createElement('div');
    cardGrid.className = 'mdl-cell mdl-cell--4-col';
    var cardWrapper = document.createElement('div');
    cardWrapper.className = 'mdl-card mdl-shadow--2dp demo-card-wide';
    cardGrid.appendChild(cardWrapper);
    var cardTitle = document.createElement('div');
    cardTitle.className = 'mdl-card__title';
    var cardTitleTextElement = document.createElement('h2');
    cardTitleTextElement.className = 'mdl-card__title-text';
    cardTitleTextElement.textContent = data.name;
    cardTitle.appendChild(cardTitleTextElement);
    cardWrapper.appendChild(cardTitle);
    var cardSupportingText = document.createElement('div');
    cardSupportingText.className = 'mdl-card__supporting-text';
    cardSupportingText.textContent = data.department;
    // var cardSaveButton = document.createElement('button');
    // cardSaveButton.textContent="Save"; 
    // cardSaveButton.addEventListener('click', onSaveButtonClicked);
    // cardSupportingText.appendChild(cardSaveButton);
    cardWrapper.appendChild(cardSupportingText);
    var cardAction = document.createElement('div');
    cardAction.className = 'mdl-card__actions mdl-card--border';
    var cardActionButton = document.createElement('a');
    cardActionButton.className = 'mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect';
    cardActionButton.textContent = 'Get Officer Information';
    cardAction.appendChild(cardActionButton);
    cardWrapper.appendChild(cardAction);
    componentHandler.upgradeElement(cardWrapper);
    officerCardArea.appendChild(cardGrid);
  }
  
  function updateUI(data){
    clearCards();
    for(var i =0;i<data.length;i++){
      createOfficerCard(data[i]);
    }
  }
  
  var url="https://availo-api.herokuapp.com/officers";
  var networkDataRecieved = false;
  
  fetch(url).then(function(res) {
      return res.json();
    })
    .then(function(data) {
      networkDataRecieved=true;
      console.group("from web",data);
      var dataArray=[];
      for(var key in data){
          dataArray.push(data[key]);
      }
      updateUI(dataArray);
    });
  
    if('indexedDB' in window){
        readAllData('officer-cards').then(function(data){
          if(!networkDataRecieved){
            console.log('from cache',data);
            updateUI(data);
          }
        });
      }

      readAllData('login-tokens').then(function(data){
    console.log("Data Read", data);
    console.log(data[0].token);
    key1 = data[0].token;
});

console.log(key1);

loginbutton.addEventListener('click',function(event){
    fetch("https://availo-api.herokuapp.com/officers/verify",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            Authorization : "Bearer "+key1
        }
    }).then(function(res){
        return res.json();
    })
    .then(function(data){
        console.log(data);
        if(data.message =="forbidden"){
            loginbutton.href = "./login.html"
        }
        else{
            loginbutton.href = "/profile.html?id="+data.id;
        }
    });

});
  

//   if('indexedDB' in window){
//     readAllData('posts').then(function(data){
//       if(!networkDataRecieved){
//         console.log('from cache',data);
//         updateUI(data);
//       }
//     });
//   }
  


//     var txt = "";
// fetch('https://availo-api.herokuapp.com/officers').then(function(res){
// console.log(res);
// return res.json();
// })
// .then(function(json){
//     console.log(json);
//     var i;
// for (i = 0; i < json.length; i++){
//     txt+='<br>';
// txt += '<div class="mdl-cell mdl-cell--4-col"><div class="mdl-card mdl-shadow--2dp demo-card-wide"><div class="mdl-card__title"><h2 class="mdl-card__title-text">'+json[i].name+'</h2></div><div class="mdl-card__supporting-text">'+json[i].department+'</div><div class="mdl-card__actions mdl-card--border"><a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Get Started</a></div></div></div>';
// txt+='<br>';
// } 
// $('#main_cont_row').html(txt);
// });

