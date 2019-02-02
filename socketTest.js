var wifi = require("Wifi");
var dht = require("DHT22").connect(D12);
var irr = require("IRReceiver");
var http = require("http");



function onInit() {
  var testTime = 60000 * 1; // min * qtd -> 1 min
  var initialPage = [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '</head>',
      '<body>',
        '<h1>Energizei Engenharia</h1>',
        '<hr>'
  ].join('');

  var formNet = [
    '<h3><u>Roteador Wifi:</u></h3>',
    '<form action="/" method="POST">',
     'SSID: <input type="text" name="ssid" align="center"><br>',
     'Pass: <input type="password" name="pass" align="center"><br>',
     '<input type="submit" value="Enviar">',
    '</form>',
    '<hr>'
  ].join('');

  var endPage = [
      '</body>',
    '</html>'
  ].join('');


  function handleForm(requestPost) {
    //var postReq = requestPost.read();
    var twoArray = requestPost.split("&");
    var userArray = twoArray[0].split("=");
    var passArray = twoArray[1].split("=");
    var APuser = userArray[1].toString();
    var APpass = passArray[1].toString();
    return [APuser, APpass];
  }

  function connectToAP(APSsid, APPassword) {

    wifi.connect(APSsid, {password:APPassword}, function(err) {
      console.log("connected? err=", err, "info=", wifi.getIP());
      wifi.save();
      //res.end("Connected to AP!");
    });

  }



  function checkNew() {
    if(wifi.getIP().ip == "0.0.0.0") {
      //pick last 6 MAC chars as ssid and first 8 as password
      wifi.stopAP();
      wifi.startAP(wifi.getAPIP().mac
                       .split(":")
                       .slice(-3)
                       .join(""),
                   {
                     authMode: "wpa2",
                     password: wifi.getAPIP().mac
                               .split(":")
                               .slice(0,-2)
                               .join("")
                   });

      wifi.save();
    }
  }
  function readDHT() {
    dht.read(function (a) {
      console.log(
        "Temp is "+a.temp.toString()+"and RH is "+a.rh.toString()
      );
    });
  }

  var off = "1110001001101001101100100100000000000000000000100110000001110000000011100000000000000110111";
  var on = "1110001001101001101100100100000000000000000100100110000001111000000111000000000000000001011";
  var fan = "1110001001101001101100100100000000000000000100100111000001110000011011100000000000000100100";
  var dry = "1110001001101001101100100100000000000000000100100010000001110000000011100000000000000010011";
  var auto = "1110001001101001101100100100000000000000000100100000100001110000000011100000000000000100101";
  var cool22 ="1110001001101001101100100100000000000000000100100110000001001000000011100000000000000000011";
  var cool19 = "1110001001101001101100100100000000000000000100100110000000011000000011100000000000000010011";
  irr.connect(D5, function(code) {
    //if(wifi.getIP().ip !== "0.0.0.0") {
      if(code.length > 20) {
        if(code.slice(0,4) != "1110") {
          code = code.slice(1);
          console.log("Data Truncated, but corrected:");
          console.log(code);
        } else {
          //codeArray.push(code);
          console.log(code);
        }
      }
    //}
  });

  function onPageRequest(req, res) {

    var a = url.parse(req.url,true);
    console.log(a);
    if (a.path == "/") {

      if(req.method == "GET") {
        res.writeHead(200);
        res.write(initialPage);
        res.write(formNet);
        res.end(endPage);
      }

      if(req.method == "POST") {
        req.on("data", function(data) {
          console.log(data);
          var LoginArray = handleForm(data);
          connectToAP(LoginArray[0], LoginArray[1]);
          res.end("Connected!!");
        });
        //var LoginArray = handleForm(req);
        //connectToAP(LoginArray[0], LoginArray[1]);
        //res.end("Connected!!");
      }
    }
  }
  http.createServer(onPageRequest).listen(80);


  checkNew();
  setInterval(readDHT, testTime);
} // close onInit

onInit();
save();
