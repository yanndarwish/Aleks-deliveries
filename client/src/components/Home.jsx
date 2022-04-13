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
    const [vehicles, setVehicles] = useState([])
    const [editedDelivery, setEditedDelivery] =useState([])
    const [editMode, setEditMode] = useState(false)

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

    const getVehicles = async () => {
        try {
            const response = await fetch(`http://${ip}:5000/vehicles`);
            const data = await response.json();
            setVehicles(data)
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

        let vehicle = document.querySelector('.vehicle-input:checked').id
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
                delivery_vehicle: vehicle,
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


    const openModal = (e) => {
        if (e.target.dataset.action === 'distance') {
            getInfo()
        }
        const modal = document.querySelector(`.${e.target.dataset.toggle}`)
        modal.classList.add('show-modal')
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
            const newClientName = document.getElementById('new-client-name').value.toUpperCase().split(' ').join('_');
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
        const label = document.createElement('label');

        input.setAttribute('type', 'text');
        input.setAttribute('class', 'pick-up-place input_home');
        input.setAttribute('placeholder', 'Pick up place');
        input.setAttribute('name', 'pick-up-place');
        input.setAttribute('list', 'clients');
        input.setAttribute('required', 'true');

        label.setAttribute('for', 'pick-up-place');
        label.setAttribute('class', 'label_home');
        pickUpsContainer.appendChild(label);

        pickUpsContainer.appendChild(input);

        pickUpsContainer.innerHTML += `<datalist id="clients">
        ${clients.map((client) => {
            return <option key={client.client_id} value={client.client_name + ' ' + client.client_address + ' ' + client.client_postal_code + ' ' + client.client_city + ' ' + client.client_country}>{client.client_name + ' ' + client.client_address + ' ' + client.client_postal_code + ' ' + client.client_city + ' ' + client.client_country}</option>
            })}
        </datalist><br />`;
    }

    const addDropOff = () => {
        const dropOffsContainer = document.getElementById('drop-offs-container');
        //create new pick-up-place input
        const input = document.createElement('input');
        const label = document.createElement('label');

        input.setAttribute('type', 'text');
        input.setAttribute('class', 'drop-off-place input_home');
        input.setAttribute('placeholder', 'Drop off place');
        input.setAttribute('name', 'drop-off-place');
        input.setAttribute('list', 'addresses');
        input.setAttribute('required', 'true');

        label.setAttribute('for', 'drop-off-place');
        label.setAttribute('class', 'label_home');

        dropOffsContainer.appendChild(label);
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
                    console.log(addressesArr[i])
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

    // EDIT MODE
    const editing = () => {
        setEditedDelivery([])
        const editInput = document.getElementById('edit-delivery-input')
        setActualId(editInput.value)
        // get delivery that matches the id
        deliveries.filter(delivery => {
            if (delivery.delivery_id === parseInt(editInput.value)){
                console.log(delivery)
                setEditedDelivery(editedDelivery => [... editedDelivery, delivery])
            }
        })
        setEditMode(true)

    }

    const editValues = () => {

            if (editedDelivery[0].delivery_vehicle !== null) {
                let vehicle = editedDelivery[0].delivery_vehicle 
                document.getElementById(vehicle).checked = true
            }
            document.getElementById('name').value  = editedDelivery[0].delivery_driver
    
            // reformat dates
            let pickUpMonth = editedDelivery[0].delivery_pick_up_month
            let pickUpDay = editedDelivery[0].delivery_pick_up_day
            let dropMonth = editedDelivery[0].delivery_drop_month
            let dropDay = editedDelivery[0].delivery_drop_day
            if (editedDelivery[0].delivery_pick_up_month < 10) {
                pickUpMonth = 0 + editedDelivery[0].delivery_pick_up_month.toString()
                console.log(pickUpMonth)
            }
            if (editedDelivery[0].delivery_pick_up_day < 10) {
                pickUpDay = 0 + editedDelivery[0].delivery_pick_up_day.toString()
                console.log(pickUpDay)
            }
            if (editedDelivery[0].delivery_drop_month < 10) {
                dropMonth = 0 + editedDelivery[0].delivery_drop_month.toString()
                console.log(dropMonth)
            }
            if (editedDelivery[0].delivery_drop_day < 10) {
                dropDay = 0 + editedDelivery[0].delivery_drop_day.toString()
                console.log(dropDay)
            }
            document.getElementById('pick-up-date').value = editedDelivery[0].delivery_pick_up_year + '-' + pickUpMonth + '-' + pickUpDay
            document.getElementById('pick-up-time').value = editedDelivery[0].delivery_pick_up_time
            // document.getElementsByClassName('pick-up-place') = editedDelivery[0].delivery_
            document.getElementById('drop-off-date').value = editedDelivery[0].delivery_drop_year + '-' + dropMonth + '-' + dropDay
            document.getElementById('drop-off-time').value = editedDelivery[0].delivery_drop_time
            // document.getElementsByClassName('drop-off-place') = editedDelivery.delivery_
    }

    useEffect(() => {
        getDrivers();
        getClients();
        getVehicles();
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

    useEffect(()=> {
        if(editMode) {
            console.log(editedDelivery)
            editValues()
        }
    }, [editMode])


    return (
        <div className="container">
            <div className="container_top">
                <div className="titre">
                    <h1>Accueil</h1>
                    <h2>Livraison n° {actualId}</h2>
                </div>
                <div className="btn_modal">
                        <button className="btn_modal_pos" data-toggle="modal-driver" onClick={(e) => openModal(e)}>Ajouter Chauffeur</button>
                        <div id="modal-driver" className="modal modal-driver" data-dismiss="modal-driver" data-toggle="modal-driver" onClick={(e) => closeModal(e)}>
                            <div className="modal-dialog modal-driver-dialog">
                                <div className="">
                                    <div className="">
                                        <h2>Ajouter Chauffeur</h2>
                                        <span className="close-btn" data-dismiss="modal-driver" onClick={(e) => closeModal(e)}>&times;</span>
                                    </div>
                                    <div className="">
                                        <form>
                                            <label className="label_home" htmlFor="new-driver-name">Nom Chauffeur</label>
                                            <input type="text" id="new-driver-name" name="new-driver-name" required/><br />
                                            <button type="submit" className="btn-in-modal" onClick={addDriver}>Ajouter Chauffeur</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="btn_modal_pos" data-toggle="modal-client" onClick={(e) => openModal(e)}>Ajouter Client</button>
                        <div id="modal-client" className="modal modal-client" data-dismiss="modal-client" onClick={(e) => closeModal(e)}>
                            <div className="modal-dialog modal-client-dialog">
                                <div className="">
                                    <div className="">
                                        <h2>Client</h2>
                                        <span className="close-btn" data-dismiss="modal-client" onClick={(e) => closeModal(e)}>&times;</span>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <label className="label_home" htmlFor="new-client-name">Nom Client</label>
                                            <input className="input_home" required type="text" id="new-client-name" name="new-client-name" /><br />
                                            <label className="label_home" htmlFor="new-client-address">Adresse Client</label>
                                            <input className="input_home" required type="text" id="new-client-address" name="new-client-address" /><br />
                                            <label className="label_home" htmlFor="new-client-postal">Code Postal Client</label>
                                            <input className="input_home" required type="text" id="new-client-postal" name="new-client-postal" /><br />
                                            <label className="label_home" htmlFor="new-client-city">Ville Client</label>
                                            <input className="input_home" required type="text" id="new-client-city" name="new-client-city" /><br />
                                            <label className="label_home" htmlFor="new-client-country">Code Pays Client</label>
                                            <input className="input_home" required type="text" maxLength="3"id="new-client-country" name="new-client-country" /><br />
                                            <button type="submit" className="btn-in-modal" onClick={addClient}>Ajouter Client</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                    </div>
                    <div className="flex">
                        <input id="edit-delivery-input" type="number"/>
                        <button type="button" className="btn" onClick={() => editing()}>Editer</button>
                    </div>
                </div>
            </div>
            <div className="container_bot">
                <div className="">
                    <h2>Livraison</h2>
                </div>
                <div className="">
                    <form>
                        <div className="btn-container flex">
                            {vehicles.map(vehicle => {
                                return (
                                    <div key={vehicle.vehicle_id}>
                                        <input className="vehicle-input" id={vehicle.vehicle_name} type="radio" name="vehicle"/>
                                        <label htmlFor={vehicle.vehicle_name}>{vehicle.vehicle_name}</label>
                                    </div>
                                )
                            })}
                        </div>
                        <label className="label_home" htmlFor="name">Chauffeur :</label>
                        <select className="select-option" name="name" id="name">
                            <option value="">--Choisissez une option--</option>
                            {drivers.map((driver) => {
                                return <option key={driver.driver_id} value={driver.driver_name}>{driver.driver_name}</option>
                            })}
                        </select><br />
                        <label className="label_home" htmlFor="pick-up-date">Date d'enlèvement :</label>
                        <input className="input_home" required type="date" id="pick-up-date" name="pick-up-date" /><br />
                        <label className="label_home" htmlFor="pick-up-time">Heure d'enlèvement :</label>
                        <input className="input_home" id="pick-up-time" type="time"></input><br />
                        <label className="label_home" htmlFor="pick-up-place">Adresse d'enlèvement :</label>
                        <input className="input_home pick-up-place" required type="text" list="clients" id="pick-up-place"/><br />
                            <datalist id="clients">
                                {clients.map((client) => {
                                return <option key={client.client_id} value={client.client_name + ' ' + client.client_address + ' ' + client.client_postal_code + ' ' + client.client_city + ' ' + client.client_country}>{client.client_name + ' ' + client.client_address + ' ' + client.client_postal_code + ' ' + client.client_city + ' ' + client.client_country}</option>

                                })}
                            </datalist>
                            <div id="pick-ups-container">
                        </div>
                        <button type="button" className='btn' onClick={() => addPickUp()}>Enlévement Suplémentaire</button><br />
                        
                        <label className="label_home" htmlFor="drop-off-date">Date de livraison :</label>
                        <input className="input_home" required type="date" id="drop-off-date" name="drop-off-date" /><br />
                        <label className="label_home" htmlFor="drop-off-time">Heure de livraison :</label>
                        <input className="input_home" id="drop-off-time" type="time"></input><br />
                        <label className="label_home" htmlFor="drop-off-place">Adresse de livraison :</label>
                        <input className="input_home drop-off-place" required type="text" list="clients" id="drop-off-place"/>
                        <datalist id="clients">
                        {clients.map((client) => {
                                return <option key={client.client_id} value={client.client_name + ' ' + client.client_address + ' ' + client.client_postal_code + ' ' + client.client_city + ' ' + client.client_country}>{client.client_name + ' ' + client.client_address + ' ' + client.client_postal_code + ' ' + client.client_city + ' ' + client.client_country}</option>
                            })}
                        </datalist>
                        <div id="drop-offs-container">
                        </div>
                        <button type="button" className="btn" onClick={() => addDropOff()}>Livraison Suplémentaire</button><br /><br />
                        
                        <div>
                        <button  type="button" id="submit-btn" className="btn btn_submit" data-toggle="modal-delivery" data-action="distance" onClick={(e) => openModal(e)}>Confirmer Livraison</button>
                        <div id="modal-delivery" className="modal modal-delivery" data-dismiss="modal-delivery" data-toggle="modal-delivery" onClick={(e) => closeModal(e)}>
                            <div className="modal-dialog modal-delivery-dialog">
                                <div className="">
                                    <div className="">
                                        <h2>Confirmer Livraison</h2>
                                        <span className="close-btn" data-dismiss="modal-delivery" onClick={(e) => closeModal(e)}>&times;</span>
                                    </div>
                                    <div className="">
                                        <h3>Êtes-vous sûr de vouloir confirmer cette livraison ?</h3>    
                                        <button type="submit" className="btn-in-modal" onClick={setDelivery}>Confirmer livraison</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
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
