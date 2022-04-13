import React, { useState, useEffect} from 'react';
import ip from "../ip"

const Clients = () => {
    const [clients, setClients] = useState([])
    const [clientId, setClientId] = useState([])
    let id = ''

    const getClients = async () => {
        try {
            const response = await fetch(`http://${ip}:5000/clients`);
            const data = await response.json()
            setClients(data)
        } catch (err) {
            console.error(err.message)
        }
    }

    // MODAL
    const openModal = (e) => {
        const modal = document.querySelector(`.${e.target.dataset.toggle}`)
        modal.classList.add('show-modal')
        console.log(e.target.dataset.id)
        setClientId(e.target.dataset.id)
        id = e.target.dataset.id
    }

    const closeModal = (e) => {
        if (e.target.dataset.dismiss !== undefined) {
            document.getElementById(e.target.dataset.dismiss).classList.remove('show-modal');
        }
    }

    const actionModal = (e) => {
        if (e.target.dataset.dismiss !== undefined) {
            deleteClient()
            document.getElementById(e.target.dataset.dismiss).classList.remove('show-modal');
        }
    }

    const deleteClient = async() => {
        try {
            const response = await fetch(`http://${ip}:5000/clients/${clientId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
                })
            alert(`Le client ${clientId} à été supprimé`)
        } catch (err) {
            console.error(err.message)
        }
    }

    useEffect(() => {
        getClients()
    }, [])

    return (
        <div className="container">
            <table id="month-table">
                <thead>
                    <tr>
                        <th><i className="fas fa-trash-alt"></i></th>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Adresse</th>
                        <th>Code Postal</th>
                        <th>Ville</th>
                        <th>Pays</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client, i) => (
                        <tr key={i}>
                            <td><i className="fas fa-trash-alt" data-toggle="modal-delete-client" data-id={client.client_id} onClick={(e) => openModal(e)}></i></td>
                            <td>{client.client_id}</td>
                            <td>{client.client_name}</td>
                            <td>{client.client_address}</td>
                            <td>{client.client_postal_code}</td>
                            <td>{client.client_city}</td>
                            <td>{client.client_country}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div id="modal-delete-client" className="modal modal-delete-client" data-dismiss="modal-delete-client" data-toggle="modal-delete-client" onClick={(e) => closeModal(e)}>
                            <div className="modal-dialog modal-delete-client-dialog">
                                <div className="">
                                    <div className="">
                                        <h2>Supprimer Client n°<span>{clientId}</span> </h2>
                                        <span className="close-btn" data-dismiss="modal-delete-client" onClick={(e) => closeModal(e)}>&times;</span>
                                    </div>
                                    <div className="">
                                            <h3>Êtes-vous sûr de vouloir supprimer ce client ?</h3>
                                            <button type="button" className="btn-in-modal" data-dismiss="modal-delete-client" onClick={(e) => actionModal(e)}>Supprimer</button>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
        </div>
    )
}

export default Clients;