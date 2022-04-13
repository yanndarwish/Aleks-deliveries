import React, {useState, useEffect} from "react";
import * as XLSX from 'xlsx';
import ip from "../ip";

const Admin = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [filteredDeliveriesDay, setFilteredDeliveriesDay] = useState([]);
    const [filteredDeliveriesMonth, setFilteredDeliveriesMonth] = useState([]);
    const [date, setDate] = useState('');
    const [deliveryId, setDeliveryId] = useState('');
    let id = ''
    //get today's date in the format YYYY-MM-DD
    const getDate = () => {
        let today = new Date();
        //add leading zero to month and day if needed
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        setDate(yyyy+'-'+mm+'-'+dd);
    }

    const getDeliveries = async () => {
        try {
            const response = await fetch(`http://${ip}:5000/deliveries`);
            const data = await response.json();
            setDeliveries(data);
        } catch (err) {
            console.error(err.message)
        }
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

    //export this Table to excel
    const exportToExcel = (e) => {
        const deliveriesTable = e.target.parentNode.nextSibling.childNodes[0];
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(deliveriesTable);
        XLSX.utils.book_append_sheet(wb, ws, `${deliveriesTable.id}`);
        XLSX.writeFile(wb, `${deliveriesTable.id}.xlsx`);
    }

    //filter deliveries by date
    const filterDeliveriesMonth = (deliveries) => {
        const month = date.slice(5, 7);
        const year = date.slice(0, 4);
        //remove eventual leading zeros
        const monthNumber = parseInt(month.replace(/^0+/, ''));
        const yearNumber = parseInt(year.replace(/^0+/, ''));
        //filter deliveries by date
        const filteredArray = deliveries.filter(delivery => {
            const deliveryMonth = delivery.delivery_pick_up_month
            const deliveryYear = delivery.delivery_pick_up_year
            return deliveryMonth === monthNumber && deliveryYear === yearNumber;
        });
        setFilteredDeliveriesMonth(filteredArray);
    }

    const filterDeliveriesDay = (deliveries) => {
        const day = date.slice(8, 10);
        const month = date.slice(5, 7);
        const year = date.slice(0, 4);
        //remove eventual leading zeros
        const dayNumber = parseInt(day.replace(/^0+/, ''));
        const monthNumber = parseInt(month.replace(/^0+/, ''));
        const yearNumber = parseInt(year.replace(/^0+/, ''));

        //filter deliveries by date
        const filtered = deliveries.filter(delivery => {
            const deliveryDay = delivery.delivery_pick_up_day
            const deliveryMonth = delivery.delivery_pick_up_month
            const deliveryYear = delivery.delivery_pick_up_year
            return deliveryDay === dayNumber && deliveryMonth === monthNumber && deliveryYear === yearNumber;
        });
        setFilteredDeliveriesDay(filtered);
    }

    //filter deliveries by driver
    const filterDeliveriesDriver = (deliveries) => {
        const driver = document.getElementById('driver-name-input').value;
        if (driver !== '') {
            const filtered = deliveries.filter(delivery => {
                return delivery.delivery_driver === driver;
            });
            filterDeliveriesMonth(filtered);
            filterDeliveriesDay(filtered);
        }
        else if (driver === '') {
            filterDeliveriesMonth(deliveries);
            filterDeliveriesDay(deliveries);
        }
    }

    // MODAL
    const openModal = (e) => {
        const modal = document.querySelector(`.${e.target.dataset.toggle}`)
        modal.classList.add('show-modal')
        console.log(e.target.dataset.id)
        setDeliveryId(e.target.dataset.id)
        id = e.target.dataset.id
    }

    const closeModal = (e) => {
        if (e.target.dataset.dismiss !== undefined) {
            document.getElementById(e.target.dataset.dismiss).classList.remove('show-modal');
        }
    }

    const actionModal = (e) => {
        if (e.target.dataset.dismiss !== undefined) {
            deleteDelivery()
            document.getElementById(e.target.dataset.dismiss).classList.remove('show-modal');
        }
    }

    const deleteDelivery = async() => {
        try {
            console.log(deliveryId)
            const response = await fetch(`http://${ip}:5000/deliveries/${deliveryId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
                })
            alert(`Livraison ${deliveryId} à été supprimée`)
        } catch (err) {
            console.error(err.message)
        }
    }

    useEffect(() => {
        getDeliveries();
        getDrivers();
        getDate();
    }, []);

    useEffect(() => {
        filterDeliveriesDay(deliveries);
        filterDeliveriesMonth(deliveries);
        filterDeliveriesDriver(deliveries);
    }, [deliveries, date]);

    return (
        <div className="container-admin">
            <div className="title-container">
                <h1>Admin</h1>
            </div>
            <div className="btn-container">
                <label className="label_admin" htmlFor="driver-name-input">Filtrer par chauffeur</label><br />
                <select name="driver-name-input" id="driver-name-input" onChange={() => filterDeliveriesDriver(deliveries)}>
                            <option value="">--Choisissez un chauffeur--</option>
                            {drivers.map((driver) => {
                                return <option key={driver.driver_id} value={driver.driver_name}>{driver.driver_name}</option>
                            })}
                        </select><br />
                <label className="label_admin" htmlFor="date-input">Filrer par date</label><br />
                <input className="input_admin" id="date-input" type="date" onChange={(e) => setDate(e.target.value)}/>
            </div>
            <div className="content-container">
                <div className="deliveries-container">
                    <div className="day-container">
                        <div className="title-container">
                            <h2>Jour</h2>
                            <button className="btn" onClick={(e) => exportToExcel(e)}>Exporter sur Excel</button>
                        </div>
                        <div className="table-container">
                            <table id="day-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Chauffeur</th>
                                        <th>Véhicule</th>
                                        <th>Date d'enlèvement</th>
                                        <th>Heure d'enlèvement</th>
                                        <th>Adresse d'enlèvement</th>
                                        <th>Date de livraison</th>
                                        <th>Heure de livraison</th>
                                        <th>Adresse de livraison</th>
                                        <th>Distance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDeliveriesDay.map((delivery,i) => (
                                        <tr key={i}>
                                            <td>{delivery.delivery_id}</td>
                                            <td>{delivery.delivery_driver}</td>
                                            <td></td> 
                                            <td>{delivery.delivery_pick_up_day + '/' + delivery.delivery_pick_up_month + '/' + delivery.delivery_pick_up_year}</td>
                                            <td>{delivery.delivery_pick_up_time}</td>
                                            <td>{delivery.delivery_pick_up_place}</td>
                                            <td>{delivery.delivery_drop_day + '/' + delivery.delivery_drop_month + '/' + delivery.delivery_drop_year}</td>
                                            <td>{delivery.delivery_drop_time}</td>
                                            <td>{delivery.delivery_drop_place}</td>
                                            <td>{delivery.delivery_distance}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="month-container">
                        <div className="title-container">
                            <h2>Mois</h2>
                            <button className="btn" onClick={(e) => exportToExcel(e)}>Exporter sur Excel</button>
                        </div>
                        <div className="table-container">
                            <table id="month-table">
                                <thead>
                                    <tr>
                                        <th><i className="fas fa-trash-alt"></i></th>
                                        <th>ID</th>
                                        <th>Chauffeur</th>
                                        <th>Véhicule</th>
                                        <th>Date d'enlèvement</th>
                                        <th>Heure d'enlèvement</th>
                                        <th>Adresse d'enlèvement</th>
                                        <th>Date de livraison</th>
                                        <th>Heure de livraison</th>
                                        <th>Adresse de livraison</th>
                                        <th>Distance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDeliveriesMonth.map((delivery, i) => (
                                        <tr key={i}>
                                            <td><i className="fas fa-trash-alt" data-toggle="modal-delete-delivery" data-id={delivery.delivery_id} onClick={(e) => openModal(e)}></i></td>
                                            <td>{delivery.delivery_id}</td>
                                            <td>{delivery.delivery_driver}</td>
                                            <td>{delivery.delivery_vehicle}</td>
                                            <td>{delivery.delivery_pick_up_day + '/' + delivery.delivery_pick_up_month + '/' + delivery.delivery_pick_up_year}</td>
                                            <td>{delivery.delivery_pick_up_time}</td>
                                            <td>{delivery.delivery_pick_up_place}</td>
                                            <td>{delivery.delivery_drop_day + '/' + delivery.delivery_drop_month + '/' + delivery.delivery_drop_year}</td>
                                            <td>{delivery.delivery_drop_time}</td>
                                            <td>{delivery.delivery_drop_place}</td>
                                            <td>{delivery.delivery_distance}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        <div id="modal-delete-delivery" className="modal modal-delete-delivery" data-dismiss="modal-delete-delivery" data-toggle="modal-delete-delivery" onClick={(e) => closeModal(e)}>
                            <div className="modal-dialog modal-delete-delivery-dialog">
                                <div className="">
                                    <div className="">
                                        <h2>Supprimer Livraison n°<span>{deliveryId}</span> </h2>
                                        <span className="close-btn" data-dismiss="modal-delete-delivery" onClick={(e) => closeModal(e)}>&times;</span>
                                    </div>
                                    <div className="">
                                            <h3>Êtes-vous sûr de vouloir supprimer cette livraison ?</h3>
                                            <button type="button" className="btn-in-modal" data-dismiss="modal-delete-delivery" onClick={(e) => actionModal(e)}>Supprimer</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;