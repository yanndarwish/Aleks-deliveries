import React, { useState,  useEffect} from 'react';
import ip from "../ip"

const Home = () => {
    const [drivers, setDrivers] = useState([]);
    const [clients, setClients] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [actualId, setActualId] = useState(0);
    const [adresses, setAdresses] = useState([]);
    const [ready, setReady] = useState(false);
    const [latitudes, setLatitudes] = useState([]);
    const [longitudes, setLongitudes] = useState([]);
    const [distance, setDistance] = useState(0);
    const [duration, setDuration] = useState(0);

    const getDeliveries = async () => {
        try {
            const response = await fetch(`http://${ip}:5000/deliveries`)
            const data = await response.json();
            setDeliveries(data);
        } catch (err) {
            console.error(err.message);
        }
    }

    //get last delivery id 
    const getLastDeliveryId = () => {
        let lastDeliveryId = 0;
        deliveries.forEach(delivery => {
            if (delivery.delivery_id > lastDeliveryId) {
                lastDeliveryId = delivery.delivery_id;
            }
        });
        setActualId(lastDeliveryId + 1);
    }


    const getDrivers = async () => {
        try {
            const response = await fetch(`http://${ip}:5000/drivers`);
            const data = await response.json();
            setDrivers(data);
        } catch (err) {
            console.error(err.message)
        }
    }

    const getClients = async () => {
        try {
            const response = await fetch(`http://${ip}:5000/clients`);
            const data = await response.json();
            setClients(data);
        } catch (err) {
            console.error(err.message)
        }
    }

    const setDelivery = async () => {
        let name = document.getElementById('name').value;
        let pickUpDate = document.getElementById('pick-up-date').value;
        let pickUpTime = document.getElementById('pick-up-time').value;
        let pickUpPlace = document.getElementsByClassName('pick-up-place');
        let dropOffDate = document.getElementById('drop-off-date').value;
        let dropOffTime = document.getElementById('drop-off-time').value;
        let dropOffPlace = document.getElementsByClassName('drop-off-place');

        const dateArray = pickUpDate.split('-');
        let pDay = dateArray[2];
        let pMonth = dateArray[1];
        let pYear = dateArray[0];
        const dDateArray = dropOffDate.split('-');
        let dDay = dDateArray[2];
        let dMonth = dDateArray[1];
        let dYear = dDateArray[0];

        //get the longest array
        const longestArray = pickUpPlace.length > dropOffPlace.length ? pickUpPlace.length : dropOffPlace.length;
        for (let i = 0; i < longestArray; i++) {
            try {
                let pickUpPlaceValue
                let dropOffPlaceValue
                if (pickUpPlace[i] !== undefined) {
                pickUpPlaceValue = pickUpPlace[i].value;
                } else if (pickUpPlace[i] === undefined) {
                    pickUpPlaceValue = ''
                }
                if (dropOffPlace[i] !== undefined) {
                    dropOffPlaceValue = dropOffPlace[i].value;
                } else if (dropOffPlace[i] === undefined){
                    dropOffPlaceValue = ''
                }
                const body = {
                delivery_id: parseInt(actualId),
                delivery_driver: name,
                delivery_pick_up_year: parseInt(pYear),
                delivery_pick_up_month: parseInt(pMonth),
                delivery_pick_up_day: parseInt(pDay),
                delivery_pick_up_time: pickUpTime,
                delivery_pick_up_place: pickUpPlaceValue,
                delivery_drop_year: parseInt(dYear),
                delivery_drop_month: parseInt(dMonth),
                delivery_drop_day: parseInt(dDay),
                delivery_drop_time: dropOffTime,
                delivery_drop_place: dropOffPlaceValue,
                delivery_distance: Math.floor(distance*100)/100
                };
                const response = await fetch(`http://${ip}:5000/deliveries`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                })
                const data = await response.json();
                console.log(data);
            } catch (err) {
                console.error(err.message)
            }
        }
        document.getElementById('name').value = '';
        document.getElementById('pick-up-date').value = '';
        document.getElementById('pick-up-time').value = '';
        for (let i = 0; i < document.getElementsByClassName('pick-up-place').length; i++) {
            document.getElementsByClassName('pick-up-place')[i].value = '';
        }
        document.getElementById('drop-off-date').value = '';
        document.getElementById('drop-off-time').value = '';
        for (let i = 0; i < document.getElementsByClassName('drop-off-place').length; i++) {
            document.getElementsByClassName('drop-off-place')[i].value = '';
        }
        setActualId(actualId + 1);
    }

    console.log(clients)

    const openModal = (e) => {
        document.getElementById(e.target.nextSibling.dataset.dismiss).classList.add('show-modal');
    }

    const closeModal = (e) => {
        if (e.target.dataset.dismiss !== undefined) {
            document.getElementById(e.target.dataset.dismiss).classList.remove('show-modal');
        }
    }

    const addDriver = async () => {
        try {
            const newDriverName = document.getElementById('new-driver-name').value;
            const response = await fetch(`http://${ip}:5000/drivers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newDriverName
                })
            })
            const data = await response.json();
            console.log(data);
        }
        catch (err) {
            console.error(err.message)
        }
    }

    const addClient = async () => {
        try {
            const newClientName = document.getElementById('new-client-name').value.toUpperCase();
            const newClientAddress = document.getElementById('new-client-address').value;
            const newClientPostal = document.getElementById('new-client-postal').value;
            const newClientCity = document.getElementById('new-client-city').value.charAt(0).toUpperCase() + document.getElementById('new-client-city').value.slice(1);
            const newClientCountry = document.getElementById('new-client-country').value.toUpperCase();

            const response = await fetch(`http://${ip}:5000/clients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newClientName,
                    address: newClientAddress,
                    postal_code: newClientPostal,
                    city: newClientCity,
                    country: newClientCountry
                })
            })
            const data = await response.json();
            console.log(data);
        }
        catch (err) {
            console.error(err.message)
        }
    }

    const addPickUp = () => {
        const pickUpsContainer = document.getElementById('pick-ups-container');
        //create new pick-up-place input
        const input = document.createElement('input');

        input.setAttribute('type', 'text');
        input.setAttribute('class', 'pick-up-place');
        input.setAttribute('placeholder', 'Pick up place');
        input.setAttribute('name', 'pick-up-place');
        input.setAttribute('list', 'addresses');
        input.setAttribute('required', 'true');

        pickUpsContainer.appendChild(input);

        pickUpsContainer.innerHTML += `<datalist id="addresses">
        ${clients.map((client) => {
            return <option key={client.client_id} value={client.client_name + ' ' + client.client_address + ' ' + client.client_postal_code + ' ' + client.client_city + ' ' + client.client_country}>{client.client_name + ' ' + client.client_address + ' ' + client.client_postal_code + ' ' + client.client_city + ' ' + client.client_country}</option>
            })}
        </datalist><br />`;
    }

    const addDropOff = () => {
        const dropOffsContainer = document.getElementById('drop-offs-container');
        //create new pick-up-place input
        const input = document.createElement('input');

        input.setAttribute('type', 'text');
        input.setAttribute('class', 'drop-off-place');
        input.setAttribute('placeholder', 'Drop off place');
        input.setAttribute('name', 'drop-off-place');
        input.setAttribute('list', 'addresses');
        input.setAttribute('required', 'true');
        dropOffsContainer.appendChild(input);

        dropOffsContainer.innerHTML += `<datalist id="addresses">
        ${clients.map((client) => {
            return <option key={client.client_id} value={client.client_name + ' ' + client.client_address + ' ' + client.client_postal_code + ' ' + client.client_city + ' ' + client.client_country}>{client.client_name + ' ' + client.client_address + ' ' + client.client_postal_code + ' ' + client.client_city + ' ' + client.client_country}</option>
            })}
        </datalist><br />`;
    }

    const getInfo = async () => {
        let addressesArr = [];
        let latitudesArr = [];
        let longitudesArr = [];
        try {
            let origins = document.getElementsByClassName('pick-up-place');
            let destinations = document.getElementsByClassName('drop-off-place');
            for (let i = 0; i < origins.length; i++) {
                //remove client name from value
                let origin = origins[i].value.split(' ').slice(1).join(' ');
                addressesArr.push(origin)
            }
            for (let i = 0; i < destinations.length; i++) {
                //remove client name from value
                let destination = destinations[i].value.split(' ').slice(1).join(' ');
                addressesArr.push(destination)
            }
            for (let i = 0; i < addressesArr.length; i++) {
                setTimeout(async () => {
                    const response = await fetch(`https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=${addressesArr[i]}&accept-language=en&polygon_threshold=0.0`, {
                        "method": "GET",
                        "headers": {
                            "x-rapidapi-host": "forward-reverse-geocoding.p.rapidapi.com",
                            "x-rapidapi-key": "fb659e29b0msh23372634e4fd6d1p165b25jsn9cb9bae1a359"
                        }
                    })
                    const json = await response.json();
                    let lat = json[0].lat;
                    let lng = json[0].lon;
                    latitudesArr.push(lat)
                    longitudesArr.push(lng)
                    console.log(longitudesArr.length)
                    console.log(addressesArr.length)
                    console.log(latitudesArr, longitudesArr)
                    setLatitudes(latitudesArr)
                    setLongitudes(longitudesArr)
                    if(addressesArr.length === longitudesArr.length) {
                        // getDistance(latitudesArr, longitudesArr)
                        setReady(true)
                    }
                    // getDistance(latitudes, longitudes)
                }, i * 500)
            }
            
        }
        catch(err) {
            console.error(err)
        }
    }

    const getDistance = (latitudes, longitudes) => {
        //get longest array
        console.log(latitudes)
        let distances = 0
        let durations   = 0
        for (let  i = 1; i < latitudes.length; i++) {
            setTimeout(async () => {
                let origin = `${latitudes[i-1]}, ${longitudes[i-1]}`
                let destination = `${latitudes[i]}, ${longitudes[i]}`
                console.log(latitudes[i - 1])
                console.log(longitudes[i])
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
                    //setdistance = previous value + json.distances[0][0]/1000
                    //setduration = previous value + json.durations[0][0]/60
                    distances += json.distances[0][0]/1000
                    durations += json.durations[0][0]/60
                    setDistance(distances)
                    setDuration(durations)
                } catch (err) {
                    console.error(err.message)
                }
            }, i * 500)
        }
        setAdresses([])
    }

    const DisplayResults = () => {
        if (duration > 60) {
            return (
                <div id="results">
                    <h2>Total distance: {distance} km</h2>
                    <h2>Total duration: {Math.floor(duration/60)} hours and {Math.floor(duration%60 *100)/100} minutes</h2>
                </div>
            )
        } else {
            return (
                <div id="results">
                    <h2>Total distance: {distance} km</h2>
                    <h2>Total duration: {Math.floor(duration*100)/100} min</h2>
                </div>
            )
        } 
        
    }
    

    useEffect(() => {
        getDrivers();
        getClients();
        getDeliveries();
    }, []);

    useEffect(() => {
        getLastDeliveryId();
    }, [deliveries])

    useEffect(() => {
        if (ready) {
            getDistance(latitudes, longitudes)
        }
    }, [ready])


    return (
        <div className="container">
            <div className="title-container">
                <h1>Accueil</h1>
                <h2>Livraison n° {actualId}</h2>
            </div>
            <div className="btn-container">
                <div className="add-driver-container">
                    <button className="btn" onClick={(e) => openModal(e)}>Ajouter Chauffeur</button>
                    <div id="modal-driver" className="overlay" data-dismiss="modal-driver" onClick={(e) => closeModal(e)}>
                        <div className="modal p-2">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h2>Ajouter Chauffeur</h2>
                                    <span className="close" data-dismiss="modal-driver" onClick={(e) => closeModal(e)}>&times;</span>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <label htmlFor="new-driver-name">Nom Chauffeur</label>
                                        <input type="text" id="new-driver-name" name="new-driver-name" required/><br />
                                        <button type="submit" className="btn" onClick={addDriver}>Ajouter Chauffeur</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="add-client-container">
                    <button className="btn" onClick={(e) => openModal(e)}>Ajouter Client</button>
                    <div id="modal-client" className="overlay" data-dismiss="modal-client" onClick={(e) => closeModal(e)}>
                        <div className="modal p-2">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h2>Ajouter Client</h2>
                                    <span className="close" data-dismiss="modal-client" onClick={(e) => closeModal(e)}>&times;</span>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <label htmlFor="new-client-name">Nom Client</label>
                                        <input required type="text" id="new-client-name" name="new-client-name" /><br />
                                        <label htmlFor="new-client-address">Adresse Client</label>
                                        <input required type="text" id="new-client-address" name="new-client-address" /><br />
                                        <label htmlFor="new-client-postal">Code Postal Client</label>
                                        <input required type="text" id="new-client-postal" name="new-client-postal" /><br />
                                        <label htmlFor="new-client-city">Ville Client</label>
                                        <input required type="text" id="new-client-city" name="new-client-city" /><br />
                                        <label htmlFor="new-client-country">Code Pays Client</label>
                                        <input required type="text" maxLength="3"id="new-client-country" name="new-client-country" /><br />
                                        <button type="submit" className="btn" onClick={addClient}>Ajouter Client</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content-container">
                <div className="title-container">
                    <h2>Nouvelle Livraison</h2>
                </div>
                <div className="form-container">
                    <form>
                        <label htmlFor="name">Chauffeur</label>
                        <select name="name" id="name">
                            <option value="">--Choisissez une option--</option>
                            {drivers.map((driver) => {
                                return <option key={driver.driver_id} value={driver.driver_name}>{driver.driver_name}</option>
                            })}
                        </select><br />
                        <label htmlFor="pick-up-date">Date d'enlèvement</label>
                        <input required type="date" id="pick-up-date" name="pick-up-date" /><br />
                        <label htmlFor="pick-up-time">Heure d'enlèvement</label>
                        <input id="pick-up-time" type="time"></input><br />
                        <label htmlFor="pick-up-place">Adresse d'enlèvement</label>
                        <input required type="text" list="clients" id="pick-up-place" className="pick-up-place"/><br />
                            <datalist id="clients">
                                {clients.map((client) => {
                                return <option key={client.client_id} value={client.client_name + ' ' + client.client_address + ' ' + client.client_postal_code + ' ' + client.client_city + ' ' + client.client_country}>{client.client_name + ' ' + client.client_address + ' ' + client.client_postal_code + ' ' + client.client_city + ' ' + client.client_country}</option>

                                })}
                            </datalist><br />
                        <button type="button" onClick={() => addPickUp()}>Ajouter enlèvement</button>
                        <div id="pick-ups-container">
                        </div>
                        <label htmlFor="drop-off-date">Date de livraison</label>
                        <input required type="date" id="drop-off-date" name="drop-off-date" /><br />
                        <label htmlFor="drop-off-time">Heure de livraison</label>
                        <input id="drop-off-time" type="time"></input><br />
                        <label htmlFor="drop-off-place">Adresse de livraison</label>
                        <input required type="text" list="addresses" id="drop-off-place" className="drop-off-place"/>
                        <datalist id="addresses">
                        {clients.map((client) => {
                                return <option key={client.client_id} value={client.client_name + ' ' + client.client_address + ' ' + client.client_postal_code + ' ' + client.client_city + ' ' + client.client_country}>{client.client_name + ' ' + client.client_address + ' ' + client.client_postal_code + ' ' + client.client_city + ' ' + client.client_country}</option>
                            })}
                        </datalist><br />
                        
                        <button type="button" onClick={() => addDropOff()}>Ajouter livraison</button>
                        <div id="drop-offs-container">
                        </div>
                        <button type="button" id="calculate-btn" onClick={() => getInfo()}>Calculer Distance</button>
                        <button  type="button" id="submit-btn" className="btn" onClick={setDelivery}>Envoyer</button>
                    </form>
                </div>
                <div id="results-container">
                    {duration ? <DisplayResults /> : null}
                </div>
            </div>
        </div>
    )
}

export default Home;
