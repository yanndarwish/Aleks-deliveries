const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const { query } = require('express');

app.use(cors());
app.use(express.json());


//DRIVERS
// get all drivers
app.get('/drivers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM drivers');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//add a new driver
app.post('/drivers', async (req, res) => {
    try {
        const { name } = req.body;
        const result = await pool.query('INSERT INTO drivers (driver_name) VALUES ($1)', [name]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// delete a driver
app.delete('/drivers/:id', async (req, res) => { 
    try {   
        const { id } = req.params;
        const result = await pool.query('DELETE FROM drivers WHERE driver_id = $1', [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
    }
});


// CLIENTS
// get all clients
app.get('/clients', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM clients');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//add a new client
app.post('/clients', async (req, res) => {
    try {
        const { 
            name,
            address,
            postal_code,
            city,
            country
        } = req.body;
        const result = await pool.query('INSERT INTO clients (client_name, client_address, client_postal_code, client_city, client_country) VALUES ($1, $2, $3, $4, $5)', [name, address, postal_code, city, country]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//delete a client
app.delete('/clients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM clients WHERE client_id = $1', [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//DELIVERIES
//get a delivery
app.get('/deliveries/:delivery_id', async (req, res) => {
    try {
        const {delivery_id} = req.params
        const result = await pool.query(`SELECT * FROM deliveries WHERE delivery_id = $1`, [delivery_id])
        res.json(result.rows)
    } catch (err) {
        console.error(err.message)
    }
})

// get all deliveries
app.get('/deliveries', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM deliveries');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//add a new delivery
app.post('/deliveries', async (req, res) => {
    try {
        const {
            delivery_id,
            delivery_driver,
            delivery_vehicle,
            delivery_pick_up_year,
            delivery_pick_up_month,
            delivery_pick_up_day,
            delivery_pick_up_time,
            delivery_pick_up_place,
            delivery_drop_year,
            delivery_drop_month,
            delivery_drop_day,
            delivery_drop_time,
            delivery_drop_place,
            delivery_distance
        } = req.body;
        const result = await pool.query('INSERT INTO deliveries (delivery_id, delivery_driver, delivery_vehicle, delivery_pick_up_year, delivery_pick_up_month, delivery_pick_up_day, delivery_pick_up_time, delivery_pick_up_place, delivery_drop_year, delivery_drop_month, delivery_drop_day, delivery_drop_time, delivery_drop_place, delivery_distance) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)', [delivery_id, delivery_driver, delivery_vehicle, delivery_pick_up_year, delivery_pick_up_month, delivery_pick_up_day, delivery_pick_up_time, delivery_pick_up_place, delivery_drop_year, delivery_drop_month, delivery_drop_day, delivery_drop_time, delivery_drop_place, delivery_distance]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// delete a delivery
app.delete('/deliveries/:delivery_id', async (req, res) => {
    try {
        const { delivery_id } = req.params
        const result = await pool.query('DELETE FROM deliveries WHERE delivery_id = $1', [delivery_id])
        res.json(result.rows);
    } catch (err) {
        console.error(err.message)
    }
})

// edit a delivery
app.put('/deliveries/:delivery_id', async (req,res) => {
    try {
        const {
            delivery_id,
            delivery_driver,
            delivery_vehicle,
            delivery_pick_up_year,
            delivery_pick_up_month,
            delivery_pick_up_day,
            delivery_pick_up_time,
            delivery_pick_up_place,
            delivery_drop_year,
            delivery_drop_month,
            delivery_drop_day,
            delivery_drop_time,
            delivery_drop_place,
            delivery_distance
        } = req.body;
        const result = await pool.query('UPDATE deliveries SET (delivery_id, delivery_driver, delivery_vehicle, delivery_pick_up_year, delivery_pick_up_month, delivery_pick_up_day, delivery_pick_up_time, delivery_pick_up_place, delivery_drop_year, delivery_drop_month, delivery_drop_day, delivery_drop_time, delivery_drop_place, delivery_distance) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)', [delivery_id, delivery_driver, delivery_vehicle, delivery_pick_up_year, delivery_pick_up_month, delivery_pick_up_day, delivery_pick_up_time, delivery_pick_up_place, delivery_drop_year, delivery_drop_month, delivery_drop_day, delivery_drop_time, delivery_drop_place, delivery_distance]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message)
    }
})


// VEHICLES
app.get('/vehicles', async (req,res) => {
    try {
        const result = await pool.query('SELECT * FROM vehicles');
        res.json(result.rows)
    } catch (err) {
        console.error(err.message)
    }
})

app.listen(5000, () => {
    console.log('Server started on port 5000');
})