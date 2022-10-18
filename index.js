require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listadoLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async ()=>{
   
    //creo la isntancia de mi clase busqueda
    const busquedas = new Busquedas();
    

    let opt;

    do {
        //mostramos la opcion de menu
        opt = await inquirerMenu()

        switch ( opt) {
            case 1:

                //mostramos mensaje para que el user escriba
                const termino = await leerInput('Ciudad: ')
                
                
                
                //buscamos los lugares
                const lugares = await busquedas.ciudad( termino );
                


                //el user debe seleccion el lugar
                const id = await listadoLugares(lugares)
                if(id === '0') continue;

                const lugarSeleccionado = lugares.find( lugar => lugar.id === id );

                //guardad en DB
                busquedas.agregarHistorial(lugarSeleccionado.nombre)
               

                

                //datos del clima 
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng)
                console.log(clima);
                

                //mostramos el resultado
                console.clear();
                console.log("\ninformacion de la ciudad\n".green);
                console.log('Ciudad: ', lugarSeleccionado.nombre);
                console.log('Lat: ', lugarSeleccionado.lat);
                console.log('Lng: ',lugarSeleccionado.lng );
                console.log('Temperatura: ', clima.temp );
                console.log('Minima:', clima.min);
                console.log('Maxima: ', clima.max);
                console.log('Como esta el clima: ', clima.desc  );
                break;

            case 2:

                busquedas.historiaCapitalizado.forEach((lugar, i)=>{

                    const idx = `${i + 1}`.green;
                    console.log(`${idx} ${lugar}`);

                })
                break;
        
            default:
                break;
        }
       

        if( opt !== 0) await pausa()

    } while ( opt !== 0);

    
}
main()