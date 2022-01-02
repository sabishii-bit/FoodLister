const config                = require('./dbConfig'),
      sql                   = require('mssql');

const getItemData = async() => {
    try {
        let pool = await sql.connect(config);
        let orderList = pool.request().query("SELECT DISTINCT ItemName, max(ItemQuantity) ItemQuantity FROM dbo.OrderData GROUP BY ItemName ORDER BY ItemQuantity DESC;");
        return orderList; 
    }
    catch(error) {
        console.log(error);
    }
}

module.exports = {
    getItemData
}