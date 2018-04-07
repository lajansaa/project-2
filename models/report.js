module.exports = (dbPool) => {
  return {
    get: (payload, callback) => {
      const reportQueryString = `SELECT
                                     R.*,
                                     C.title AS category_title,
                                     U.name AS user_name
                                 FROM reports R
                                 JOIN categories C ON R.category_id = C.id
                                 JOIN users U ON R.user_id = U.id
                                 WHERE R.id = ${payload.report_id};`;
      dbPool.query(reportQueryString, (err, res) => {
        const categoryQueryString = `SELECT
                                         C.id,
                                         C.title
                                     FROM categories C
                                     LEFT JOIN reports R ON C.id = R.category_id
                                                        AND R.id = ${payload.report_id}
                                     WHERE R.id IS NULL
                                     ORDER BY 2;`;
        dbPool.query(categoryQueryString, (err2, res2) => {
          const userQueryString = `SELECT
                                       U.id,
                                       U.name
                                   FROM users U
                                   LEFT JOIN reports R ON U.id = R.user_id
                                                      AND R.id = ${payload.report_id}
                                   WHERE R.id IS NULL
                                   ORDER BY 2;`;
          dbPool.query(userQueryString, (err3, res3) => {
            const favouriteQueryString = `SELECT *
                                          FROM favourites F
                                          WHERE F.report_id = ${payload.report_id}
                                            AND F.user_id = ${payload.user_id}`;
            dbPool.query(favouriteQueryString, (err4, res4) => {
              callback(err3, Object.assign(res.rows[0], { category: res2.rows, author: res3.rows, favourite: res4.rowCount==1 ? true : false }));
            })
          })
        })
      })
    },

    getOutput: (queryString, callback) => {
      dbPool.query(queryString, (err, res) => {
        callback(err, res);
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
    },

    favourite: (payload, callback) => {
      if (payload.rating == 1) {
        var queryString = `INSERT INTO favourites(user_id, report_id) VALUES (${payload.user_id}, ${payload.report_id});`;
      } else {
        var queryString = `DELETE FROM favourites WHERE user_id='${payload.user_id}' AND report_id='${payload.report_id}';`;
      }
      dbPool.query(queryString, (err, res) => {
        callback(err);
      })
    }

  }
}