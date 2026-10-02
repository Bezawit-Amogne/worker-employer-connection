const db = require('./config/db');

const queries = [
  'SHOW TABLES',
  'DESCRIBE users',
  'DESCRIBE workers',
  'DESCRIBE employers',
  'DESCRIBE jobs',
  'DESCRIBE applications',
  'DESCRIBE worker_requests',
  'DESCRIBE contact_requests'
];

(async () => {
  for (const query of queries) {
    try {
      const [rows] = await db.promise().query(query);
      console.log('\n--- QUERY: ' + query + ' ---');
      console.table(rows);
    } catch (error) {
      console.log('\n--- FAILED: ' + query + ' ---');
      console.log(error.message);
    }
  }

  db.end();
})();
