
const readline = require(`readline`)
const fs = require('fs');
class HotelLocator{

constructor() {
    this.northHotels = [];
    this.southHotels = [];
}

//retrieves hotels from JSON and sorts them appropriately
loadHotelsFromJSON() {
    const data = fs.readFileSync('hotels.json');
    const hotels = JSON.parse(data).hotels;

    this.northHotels = hotels.filter(hotel => hotel.location === 'north').map(hotel => hotel.name);
    this.southHotels = hotels.filter(hotel => hotel.location === 'south').map(hotel => hotel.name);
}

//returns the north hotels
    locateNorthHotels(){
    this.northHotels.forEach(hotel => {
        console.log(`North: ${hotel}`);
    });
}
//returns the south hotels
    locateSouthHotels(){
        this.southHotels.forEach(hotel => {
            console.log(`South: ${hotel}`);
        });
    
    }

//locate hotels based on input
    locateHotels(value){
        this.loadHotelsFromJSON();
            if (value == "north"){
               this.locateNorthHotels()
            }
            else if (value == "south"){
                this.locateNorthHotels();
            }
            else{
                this.locateNorthHotels();
                this.locateSouthHotels();
            }
    }

}

//implements readline for use
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const hotelLocator = new HotelLocator();

rl.question('Do you want to view "north", "south" or "all" hotels?: ', (answer) => {
    hotelLocator.locateHotels(answer.trim().toLowerCase());
    rl.close();
});