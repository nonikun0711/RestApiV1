var socket = io.connect("http://127.0.0.1:3000");
var mapa;
var markers = {};

$(document).ready(function () {  
    
    geolocalizar(); 
    socket.on('new', add);

    socket.on('location update', updateMarker);        
    $("#formulario").bind("submit", enviar);

});



function enviar()
{   
    socket.emit('msg', {
        name: $('#nombre').val(),
        msg: $('#mensaje').val(),
        lat: lat,
        lon: lon
    });

    $('#mensaje').val('');
    
    return false;
}
function add(data){
    var name = data.name || 'anonymous';
      var msg = $('<div class="msg"></div>')
        .append('<span class="name">' + name + '</span>: ')
        .append('<span class="text">' + data.msg + '</span>');

    $('#messages')
        .append(msg)
        .animate({scrollTop: $('#messages').prop('scrollHeight')}, 0);

    socket.emit("send location", {        
        lat: lat,
        lon: lon
    });
    
}

function loadMarkers(data) {
  
  for(key in data) {
    var user = data[key];
    markers[key] = getMarker(user.lat, user.lon);
  }
}

function updateMarker(data){
  var marker = markers[data.key];
  if(!marker) {    
    markers[data.key] = getMarker(data.lat, data.lon);
  }
}

function getMarker(lat, lon) {
  return new google.maps.Marker({
    map: mapa,
    position: new google.maps.LatLng(lat,lon)
  });
}

function geolocalizar()
{
    navigator.geolocation.getCurrentPosition(mostrarMapa,errorMapa);
}
function mostrarMapa(datos)
{

    lat = datos.coords.latitude;
    lon = datos.coords.longitude;
  
    var coordenada = new google.maps.LatLng(lat, lon);
    var opciones = {
        center: coordenada,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };
    mapa = new google.maps.Map( $("#mapa_canvas")[0],  opciones);    
    
    $("#mapa_canvas").css("height", "400px")
                     .css("margin", "0 auto")
                     .css("width", "600px");

     socket.emit('request locations', loadMarkers);

    
}
function errorMapa()
{
    console.log("no se encontró ubicación");
}

