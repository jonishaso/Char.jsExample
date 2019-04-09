import mysql from 'mysql'

export class Database {
	constructor(config) {
		this.connection = mysql.createConnection(config)
	}

	actionQuery(qu, arg) {
		return new Promise((resolve, reject) => {
			this.connection.query(
				{
					sql: qu,
					values: arg
				},
				(err, results, fields) => {
					if (err) reject(err)
					resolve({ result: results })
				}
			)
		})
	}

	closeConn() {
		return new Promise((resolve, reject) => {
			this.connection.end((err) => {
				if (err) reject(err)
				resolve()
			})
		})
	}
}
