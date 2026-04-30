const { Pool } = require('pg');
require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.DB_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false,
    },
});

async function populateDB() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Create Member table
        await client.query(`
            CREATE TABLE IF NOT EXISTS Member (
                member_id         INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                FirstName         VARCHAR(50)  NOT NULL,
                LastName          VARCHAR(50)  NOT NULL,
                Email             VARCHAR(100) UNIQUE,
                membership_status VARCHAR(100) NOT NULL,
                password          VARCHAR(255) NOT NULL
            )
        `);

        // Create massage_log table
        await client.query(`
            CREATE TABLE IF NOT EXISTS massage_log (
                log_id  INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                Title   VARCHAR(255) NOT NULL,
                Author  VARCHAR(100) NOT NULL,
                Text    TEXT         NOT NULL,
                Time    TIMESTAMP    DEFAULT NOW()
            )
        `);

        // Create clubs table
        await client.query(`
            CREATE TABLE IF NOT EXISTS clubs (
                club_id  INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                clubname VARCHAR(255),
                code     VARCHAR(255)
            )
        `);

        // Populate clubs
        const clubs = [
            ['The Book Nook', 'BKN'],
            ['Tech Innovators', 'TIN'],
            ['Fitness Freaks', 'FIT'],
            ['Art & Soul', 'ARS'],
            ['Language Exchange', 'LNG'],
            ['Chess Masters', 'CHM'],
            ['Film Buffs', 'FLB'],
            ['Music Jam', 'MJM'],
            ['Nature Explorers', 'NTX'],
            ['Debate Club', 'DBC'],
        ];

        for (const [clubname, code] of clubs) {
            await client.query(
                `INSERT INTO clubs (clubname, code) VALUES ($1, $2)`,
                [clubname, code]
            );
        }

        await client.query('COMMIT');
        console.log('✅ Database populated successfully');

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Error populating database:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

populateDB();