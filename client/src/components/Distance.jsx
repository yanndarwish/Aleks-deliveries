import React from "react";


    let adresses = []
    let latitudes = []
    let longitudes = []

    const getInfo = async () => {
        try {
        let origin = document.getElementById('origin').value;
        adresses.push(origin)
        let destination = document.getElementById('destination').value;
        adresses.push(destination)
        for (let i = 0; i < adresses.length; i++) {
            const response = await fetch(`https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=${adresses[i]}&accept-language=en&polygon_threshold=0.0`, {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-host": "forward-reverse-geocoding.p.rapidapi.com",
                        "x-rapidapi-key": "fb659e29b0msh23372634e4fd6d1p165b25jsn9cb9bae1a359"
                    }
                })
                const json = await response.json();
                let lat = json[0].lat;
                let lng = json[0].lon;
                latitudes.push(lat)
                longitudes.push(lng)
                console.log(latitudes)
                console.log(longitudes)
            }
            getDistance()
        }
        catch(err) {
            console.error(err)
        }
    }

    const getDistance = async () => {
        let origin = `${latitudes[0]}, ${longitudes[0]}`
        let destination = `${latitudes[1]}, ${longitudes[1]}`

        console.log(latitudes[0])
        try {
            const response = await fetch(`https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins=${origin}&destinations=${destination}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "trueway-matrix.p.rapidapi.com",
                    "x-rapidapi-key": "fb659e29b0msh23372634e4fd6d1p165b25jsn9cb9bae1a359"
                }
            })
            const json = await response.json();
            console.log(json.distances[0][0]/1000 + ' km')
            console.log(json.durations[0][0]/60 + ' min')
        } catch (err) {
            console.error(err.message)
        }
        adresses = []
        latitudes = []
        longitudes = []
    }

  
