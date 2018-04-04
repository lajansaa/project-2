module.exports = (dbPool) => {
  return {
    get: (report_id, callback) => {
      const reportQueryString = `SELECT
                                     R.*,
                                     C.title AS category_title
                                 FROM reports R
                                 JOIN categories C ON R.category_id = C.id
                                 WHERE R.id = ${report_id};`;
      dbPool.query(reportQueryString, (err, res) => {
        const categoryQueryString = `SELECT
                                         C.id,
                                         C.title
                                     FROM categories C
                                     LEFT JOIN reports R ON C.id = R.category_id
                                                        AND R.id = ${report_id}
                                     WHERE R.id IS NULL
                                     ORDER BY 2;`;
        dbPool.query(categoryQueryString, (err2, res2) => {
          callback(err2, Object.assign(res.rows[0], {category: res2.rows}));
        })
      })
    },

    getOutput: (queryString, callback) => {
      dbPool.query(queryString, (err, res) => {
        callback(err, res.rows);
      })
    },

    edit: (report, callback) => {
      const queryString = `UPDATE reports SET title=$$${report.title}$$, description=$$${report.description}$$, query=$$${report.query}$$, category_id=${report.category_id} WHERE id=${report.id};`
      dbPool.query(queryString, (err, res) => {
        callback(err, res);
      })
    },

    getCategory: (callback) => {
      const categoryQueryString = `SELECT id, title FROM categories ORDER BY CASE WHEN title = 'Others' THEN 1 ELSE 2 END;`;
      dbPool.query(categoryQueryString, (err, res) => {
        callback(err, res.rows);
      })
    },

    createReport: (report, callback) => {
      const insertString = `INSERT INTO reports(title, description, query, category_id) VALUES ($$${report.title}$$, $$${report.description}$$, $$${report.query}$$, ${report.category_id}) RETURNING id`;
      dbPool.query(insertString, (err, res) => {
        callback(err, res.rows[0]);
      })
    },

    remove: (report_id, callback) => {
      const deleteString = `DELETE FROM reports WHERE id = ${report_id} RETURNING category_id;`;
      dbPool.query(deleteString, (err, res) => {
        callback(err, res.rows[0]);
      })
    }

  }
}