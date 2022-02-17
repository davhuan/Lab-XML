
window.addEventListener("load",openXML,false);

function getData(xmlDoc){
	
	//Date ATH 
	var dateRef = document.getElementById("date"); // hämtar upp date 
	var datum = xmlDoc.getElementsByTagName("Id")[0].childNodes[0].nodeValue; // value i elementet
	var textNode = document.createTextNode("Datum: "+datum ); // skapar en text node med variablen datum
	dateRef.appendChild(textNode); //textNode finns nu i dom-en 
	
	//time http://stackoverflow.com/questions/5539028/converting-seconds-into-hhmmss
	var tidRef = document.getElementById("time");
	var tid = xmlDoc.getElementsByTagName("TotalTimeSeconds")[0].childNodes[0].nodeValue;
	var h = Math.floor(tid / 3600); // till att få timmar , total delat med 3600, mathfoor användas till att få inga decimalaltal
	var m = Math.floor(tid % 3600 / 60);// till att få minuter
	var s = Math.floor(tid % 3600 % 60); //till att få sekunder
	var textNode = document.createTextNode("Tid: " +h +":" +m +":" +s);
	tidRef.appendChild(textNode);
	
	

	var distansRef = document.getElementById("distance");
	var distans = xmlDoc.getElementsByTagName("DistanceMeters")[0].childNodes[0].nodeValue; //hämtar distans värdet 
	var km = Math.floor(distans/1000); // till att få kilometer delar vi total med 1000
	var rest = Math.floor(distans%1000); // rest får vi med att använda %
	var textNode = document.createTextNode("Distans: " +km +"," +rest +"km");
	distansRef.appendChild(textNode);
	

	var speedRef = document.getElementById("speed");
	var maxSpeed = xmlDoc.getElementsByTagName("MaximumSpeed")[0].childNodes[0].nodeValue; // hämtar maximum speed värdet 
	var speed = Math.round(maxSpeed*18)/5;
	var textNode = document.createTextNode("Maxhastighet: " +speed +"km/h");
	speedRef.appendChild(textNode);
	
	//Snitthastighet 
	var snittRef = document.getElementById("snitt");
	var snitt = Math.round(distans/tid);
	var textNode = document.createTextNode("Snitthastighet: " +snitt +"km/h");
	snittRef.appendChild(textNode);
	
	//Maxpuls fick hjälp från	http://stackoverflow.com/questions/19862693/how-childnode-works till att få förståelse hur child nodes fungerar
	var pulsRef = document.getElementById("maxpuls");
	var maxPuls = xmlDoc.getElementsByTagName("MaximumHeartRateBpm")[0].childNodes[1].childNodes[0].nodeValue; //hämtar upp maximum heart rate värdet 
	var textNode = document.createTextNode("Maxpuls: " +maxPuls +"bpm");
	pulsRef.appendChild(textNode);
	
	
	var snittPulsRef = document.getElementById("snittpuls"); 
	var snittPuls = xmlDoc.getElementsByTagName("AverageHeartRateBpm")[0].childNodes[1].childNodes[0].nodeValue;
	var textNode = document.createTextNode("Snittpuls: " +snittPuls +"bpm");
	snittPulsRef.appendChild(textNode);
	
		

}
function initMap() {
	//läsa ett xml document förläsning 3
	var xmlhttp=new XMLHttpRequest(); //detta är ett xml dokument som ska användas
    xmlhttp.open("GET","G2.TCX", false); //öppnar dokumentet G2.TCX + sökväg 
	xmlhttp.send(); //skickar xml datan 
	
	//kod hämtad från https://developer.mozilla.org/en-US/docs/Web/API/DOMParser och anpassat till vår kod
	var parser = new DOMParser(); //skapar parser objekt, så att man kan parse XML från string med parseFromString() metoden 
	var xmlDoc = parser.parseFromString(xmlhttp.responseText,"text/xml");

		
	var points = [];    //skapar en tom lista
	var trackpoint = xmlDoc.getElementsByTagName("Trackpoint"); // hämtar upp trackpoint och placerar det i variablen trackpoint 
	var i;
	var x=0;

	for(i=0; i<trackpoint.length; i++){ //söker igenom alla trackpoints, varje varv hämtar den upp ->
		var latitude = trackpoint[i].getElementsByTagName("LatitudeDegrees"); //hämtar upp latitudedegress
		var longitude = trackpoint[i].getElementsByTagName("LongitudeDegrees"); //hämtar upp lonitudedegress
		
	
		 
		if((latitude.length>0)&&(longitude.length>0)){ //if satsen används på grund av en av trackpoints var tom 
			var latitudeValue = latitude[0].childNodes[0].nodeValue; //värdet i latitude
			var longitudeValue = longitude[0].childNodes[0].nodeValue; //värdet i longitude
			
			points[x++]= new google.maps.LatLng(latitudeValue,longitudeValue);// sparar värderna för latitude och longiude i points[] listan
		}			
	}
	 //kod tagit från https://developers.google.com/maps/documentation/javascript/examples/polyline-simple och anpassat till vår lösning 
	 var map = new google.maps.Map(document.getElementById('map'), { //hämtar upp elemented map för att det är där linjen ska ritas 
     zoom:13 , //zoom på kartan
     center: new google.maps.LatLng(59.3857161,13.5062751), //startvärderna
    mapTypeId: google.maps.MapTypeId.ROADMAP //vilken typ av map 
  });

  var path = new google.maps.Polyline({ //linje som vi kommer att rita på kartan 
    path: points, //Listan som innehåller latitude och longitude värderna 
    strokeColor: '#FF0000', //färgen på linjen
    strokeOpacity: 1.0, //transparens
    strokeWeight: 2 //hur tjock linjen är 
  });

 path.setMap(map); //set map skriver ut linjen på kartan 

}
	
   function getCanvas(xmlDoc){
	var theCanvas = document.getElementById("canvasOne"); //hämtar canvas taggen 
	var context = theCanvas.getContext("2d");
	
	var bild = new Image(); //skapan en bild objekt
	var trackpoint = xmlDoc.getElementsByTagName("Trackpoint");
    bild.src = "graf.png"; //bild objekt får en bild
	var i;
	
	bild.onload = function(){ //funktionen körs när bilden laddas 
    pulsValue=trackpoint[0].getElementsByTagName("Value")[0].childNodes[0].nodeValue; //startvärde för grafens linje 
	context.drawImage(bild, 0, 0, 600, 400); //ritar upp bilden med starpunktar och storlek
	
	context.beginPath(); //påbörjar linjen
	context.moveTo(50, 320);  //första värdet för linjen, x och y kodinater som säger till vart pathen ska börja 
	
	
	for(i=1; i < trackpoint.length; i++){ //Loopar igenom trackpoints 
		puls=trackpoint[i].getElementsByTagName("Value"); //hämtar värden
		 
	 if((puls.length>0)){ //Kontrollera om ngn av dem är tom med en if sats 
		pulsValue = puls[0].childNodes[0].nodeValue;
		console.log(pulsValue);
    	context.lineTo(50 + (2*(i/3)) , 320-pulsValue*0.9); //x + någonting, y-pulsValue 
	}
	
	}
	context.strokeStyle = "red";//linjens färg
	context.stroke();//ritar upp 
	
	};
	
}
  
 

function openXML(){
	//läsa ett xml document förläsning 3
	var xmlhttp=new XMLHttpRequest(); //detta är ett xml dokument som ska användas
    xmlhttp.open("GET","G2.TCX", false); //öppnar dokumentet G2.TCX + sökväg 
	xmlhttp.send(); //skickar xml datan 
	
	//kod hämtad från https://developer.mozilla.org/en-US/docs/Web/API/DOMParser och anpassat till vår kod
	var parser = new DOMParser(); //skapar parser objekt, så att man kan parse XML från string med parseFromString() metoden 
	var xmlDoc = parser.parseFromString(xmlhttp.responseText,"text/xml");
	
	
	getData(xmlDoc); //anropar getData och skickar med xmlDoc
	getCanvas(xmlDoc);  //anropar getCanvas och skickar med xmlDoc
	
}