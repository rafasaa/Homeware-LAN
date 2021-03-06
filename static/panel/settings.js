function requestSettings(){
  var http = new XMLHttpRequest();
  http.addEventListener("load", function(){
    console.log(http.responseText)
    loadSettings(http.responseText);
  });
  http.open("GET", "/api/settings/get");
  http.setRequestHeader('authorization', 'baerer ' + getCookieValue('token'))
  http.send();
}

function loadSettings(local_data){
  var token = JSON.parse(local_data);

  document.getElementById('clientId').value = token['google']['client_id'];
  document.getElementById('clientSecret').value = token['google']['client_secret'];
  document.getElementById('actionOnGoogleAuxiliarData').innerHTML = '<b>Authorization URL:</b> https://' + token['ddns']['hostname'] + '/auth/<br>';
  document.getElementById('actionOnGoogleAuxiliarData').innerHTML += '<b>Token URL:</b> https://' + token['ddns']['hostname'] + '/token/<br>';
  document.getElementById('actionOnGoogleAuxiliarData').innerHTML += '<b>Fulfillment URL:</b> https://' + token['ddns']['hostname'] + '/smarthome/<br>';



  document.getElementById('ddnsUsername').value = token['ddns']['username'];
  document.getElementById('ddnsPassword').value = token['ddns']['password'];
  document.getElementById('ddnsProvider').select = token['ddns']['provider'];
  document.getElementById('ddnsHostname').value = token['ddns']['hostname'];
  document.getElementById('ddnsEnabled').checked = token['ddns']['enabled'];
  document.getElementById('ddnsLastUpdate').innerHTML = '<b>Last update:</b> ' + token['ddns']['last'];
  document.getElementById('ddnsIP').innerHTML = '<b>IP:</b> ' + token['ddns']['ip'];

  badgeClass = {
    'unknown': 'badge-secondary',
    'good': 'badge-success',
    'nochg': 'badge-warning',
    'nohost': 'badge-danger',
    'badauth': 'badge-danger',
    'badagent': 'badge-danger',
    '!donator': 'badge-danger',
    'abuse': 'badge-danger',
    '911': 'badge-danger'
  }
  document.getElementById('ddnsStatusBadge').innerHTML = token['ddns']['status'];
  document.getElementById('ddnsStatusBadge').className = 'badge ' + badgeClass[token['ddns']['code']]

}

save.addEventListener('click', function() {
  //Update the text message
  document.getElementById('textMessageAlert').innerHTML = '...';
  data['google'] = {};
  data['google']['client_id'] = document.getElementById('clientId').value;
  data['google']['client_secret'] = document.getElementById('clientSecret').value;
  data['ddns'] = {};
  data['ddns']['username'] = document.getElementById('ddnsUsername').value;
  data['ddns']['password'] = document.getElementById('ddnsPassword').value;
  data['ddns']['provider'] = document.getElementById('ddnsProvider').value;
  data['ddns']['hostname'] = document.getElementById('ddnsHostname').value;
  data['ddns']['enabled'] = document.getElementById('ddnsEnabled').checked;
  if(document.getElementById('ddnsEnabled').checked)
    document.getElementById('ddnsStatusBadge').innerHTML = 'Waiting to request'
  else
    document.getElementById('ddnsStatusBadge').innerHTML = 'Disabled'

  saveData('settings', data);
  //Update the text message
  updateMessageWithTime();
});

function saveData(segment, value){
  var http = new XMLHttpRequest();
  http.addEventListener("load", function(){
    if (http.responseText != 'Bad token')
      console.log(http.responseText);
    else {
      document.getElementById('textMessageAlert').innerHTML = 'An error has happed.';
    }
  });
  http.open("POST", "/api/" + segment + "/update/");
  http.setRequestHeader('authorization', 'baerer ' + getCookieValue('token'))
  http.setRequestHeader("Content-type", "application/json");
  http.send(JSON.stringify(value));
}

function updateModal(settings){
  var title = 'Fail';
  var paragrahp = 'Something goes wrong';

  if (settings == 'clientSecret'){
    title = 'Client Secret';
    paragraph = 'It is used to authenticate with Google. If you change it here, you must change it on the Actions Console > Develop > Account Linking.';
  } else if (settings == 'clientId'){
    title = 'Client ID';
    paragraph = 'It is used to authenticate with Google. If you change it here, you must change it on the Actions Console > Develop > Account Linking';
  } else if (settings == 'apiClockURL'){
    title = 'The clock\'s URL from your Homeware API';
    paragraph = 'It is an static URL, you can not change it.';
  }


  document.getElementById('learMoreModalTitle').innerHTML = title;
  document.getElementById('learMoreModalParagraph').innerHTML = paragraph;

}

//Print message after save
function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function updateMessageWithTime(){
  var d = new Date();
  var h = addZero(d.getHours());
  var m = addZero(d.getMinutes());
  var s = addZero(d.getSeconds());
  document.getElementById('textMessageAlert').innerHTML = 'Saved at ' + h + ":" + m + ":" + s;
}

// TODO
// - Show events list
//Load the events
/*showEventsLog.addEventListener('click', function(){
  database.ref('/events/read/').on('value', function(eventsSnapshot){
    var events = eventsSnapshot.val();
    var eventsKeys = Object.keys(events);
    //Compose the HTML
    var html = '';
    for(i = eventsKeys.length-1; i > eventsKeys.length-11; i--){
      var uniqueEvent = events[eventsKeys[i]];
      date = new Date(uniqueEvent.timestamp);
      html += '<div class="card"> <div class="card-body">';
      html += '<b>' + uniqueEvent.title + '</b> <br> ' + uniqueEvent.text + ' <br> <b>Timestamp</b>: ';
      html += addZero(date.getDate()) + '/' + addZero(date.getMonth()) + '/' + date.getFullYear() + ' ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes()) + ':' + addZero(date.getSeconds());
      html += '</div> </div>';
    }

    document.getElementById('eventsLogBox').innerHTML = html;
  })
})*/

function buckup(){
  window.location = "/files/buckup/homeware/" + getCookieValue('token')
}

function generateAPIKey(){
  if(confirm('The current API Key will be override.')){
    var http = new XMLHttpRequest();
    http.addEventListener("load", function(){
      apikey = JSON.parse(http.responseText);
      console.log(apikey)
      document.getElementById('apikey').value = apikey['apikey'];
    });
    http.open("GET", "/api/settings/apikey");
    http.setRequestHeader('authorization', 'baerer ' + getCookieValue('token'))
    http.send();

  }
}
