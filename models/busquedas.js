const fs = require('fs');

const axios = require('axios')

class Busquedas{

    //definimos las propiedades
    historial = []
    dbPath = './db/database.json'
    

    //definimos el constructor
    constructor(){
        //todo, leemos DB si existe
        this.leerDB();
    }


    get historiaCapitalizado (){
        //capitalizamos cada palabra
        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ');
        })
    }


    //busqueda de la ciudad que solicita la persona
    async ciudad ( lugar = '') {

        try {
           
            const resp = await axios.get(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json?limit=5&proximity=ip&types=place%2Cpostcode%2Caddress&language=es&access_token=${ process.env.MAPBOX_KEY}`
            )
            
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
            
        } catch (error) {
            return []
        }
    }

    async climaLugar (lat, lon){
        try {
            
            const resp = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_MAP}&units=metric&lang=es`)
            const { weather, main} = resp.data
            return {
                desc:  weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
            }
        } catch (error) {
            console.log(error);
        }

    }

    agregarHistorial (lugar = ''){

        //valido que no se me repitan 
        if(this.historial.includes(lugar.toLocaleLowerCase())) return;

        this.historial = this.historial.splice(0,5);

        this.historial.unshift(lugar.toLocaleLowerCase());

        //grabar en db
        this.guardarDB();
    }

    guardarDB (){
        //grbamos en la db
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }
    
    leerDB(){
        //verificamos si existe la db
        if( !fs.existsSync( this.dbPath) ) return;

        
        //si existe cargamos la information
        const info = fs.readFileSync( this.dbPath, {encoding: 'utf-8'});
        
        const data = JSON.parse(info);


        this.historial = data.historial
    }
}




module.exports = Busquedas;