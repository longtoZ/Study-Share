import pool from '../config/database.js';

class User {
    static async create(info) {
        const query = `
            insert into "User" (
                UserID,
                Email,
                Fullname,
                Gender,
                Bio,
                ProfilePictureURL,
                DateOfBirth,
                Address,
                PasswordHash,
                CreatedDate,
                LastLogin,
                IsAdmin
            ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            returning *;
        `;

        const { rows } = await pool.query(query, info);
        return rows[0];
    }

    static async findByID(userID) {
        const query = 'select * from User where UserID = $1';
        const { rows } = await pool.query(query, [userID]);
        return rows[0];
    }

    static async findByEmail(email) {
        const query = 'select * from User where Email = $1';
        const { rows } = await pool.query(query, [email]);
        return rows[0];
    }
}

export default User;