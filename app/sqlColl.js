export const DBConf ={
    host: 'localhost',
    user: 'root',
    password: 'ruizean',
    database: "testing"
};
export const TEAMMONTH = `select count(fir.transaction) as tra,
                        SUM(fir.equity) as equ,
                        SUM(fir.profit) as pro,
                        sale_team.team as team from 
                        (select res.current as current,
                                res.sale as sale_name,
                                count(*) as transaction,
                                sum(res.equ) as equity,
                                sum(res.spread) as profit from
                                (select fs.Equivalent_AUD as equ,
                                        fs.Spread_Amount  as spread,
                                        fs.Entry_Trader   as trader,
                                        fs.Trade_Date     as current,
                                        sc.sale           as sale
                                    from forex_sale as fs
                                    join sale_client as sc on fs.Customer = sc.client
                                    where fs.Market_Rate <> 1.0
                                            and fs.Blotter <> "Position blotter"
                                            and fs.Blotter <> "leslie.chan"
                                            and fs.Trade_Date between date(?) and date(?)
                                ) as res group by sale, res.current
                        ) as fir
                join sale_team on fir.sale_name = sale_team.sale
                group by team;`;

const SALEMONTH = `select count(*) as Nooo,
                        SUM(fs.Equivalent_AUD) as equ,
                        SUM(fs.Spread_Amount) as spread,
                        sc.sale           as sale
                from forex_sale as fs
                join sale_client as sc on fs.Customer = sc.client
                where fs.Market_Rate <> 1.0
                        and fs.Blotter <> "Position blotter"
                        and fs.Blotter <> "leslie.chan"
                        and fs.Trade_Date between date(?) and date(?)
                group by sale;`


// module.exports =  {DBConf,TEAMMONTH}
// export {DBConf,TEAMMONTH}
