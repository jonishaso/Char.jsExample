const FLAG = {dealing: true,msb: true,mel: true,syn: true}
const NUM_TEAM = 4
const TEAM_NAME = ['House-MSB', 'House Dealing', 'Melbourne BDM', 'Sydney BDM']

export function getTeamMonth(month_num){
    var c_year = new Date().getFullYear()
    var firstday = new Date(c_year, month_num, 2).toISOString().split('T')[0];
    var lastday = new Date(c_year, month_num + 1,1).toISOString().split('T')[0]
    return [firstday,lastday]
}

export function formatRawData(r){
    for (var e of r) {
        e["results"] = {}
        var ll = e["result"].length
        if (ll == 0) {
          e["results"] = {
            dealing: { tra: 0, equ: 0.0, pro: 0.0 },
            msb: { tra: 0, equ: 0.0, pro: 0.0 },
            mel: { tra: 0, equ: 0.0, pro: 0.0 },
            syn: { tra: 0, equ: 0.0, pro: 0.0 },
          }
        } else if ( NUM_TEAM == ll) {
          for(var i of e['result']){
            switch (i['team']) {
              case 'House-MSB':
                e['results']['msb'] = { tra: i['tra'], equ: i['equ'], pro: i['pro'] }
                break;
              case 'House Dealing':
                e['results']['dealing'] = { tra: i['tra'], equ: i['equ'], pro: i['pro'] }
                break;
              case 'Melbourne BDM':
                e['results']['mel'] = { tra: i['tra'], equ: i['equ'], pro: i['pro'] }
                break;
              case 'Sydney BDM':
                e['results']['syn'] = { tra: i['tra'], equ: i['equ'], pro: i['pro'] }
                break;
            }
          }
        } else {
          var flag = FLAG
          for (var i of e['result']) {
            switch (i['team']) {
              case 'House-MSB':
                flag['msb'] = false
                break;
              case 'House Dealing':
                flag['dealing'] = false
                break;
              case 'Melbourne BDM':
                flag['mel'] = false
                break;
              case 'Sydney BDM':
                flag['syn'] = false
                break;
            }
          }
          var missing = Object.keys(flag).filter((key)=> flag[key]);//array
          for(var i of missing){
            switch (i) {
              case 'msb':
                e['results']['msb'] = { tra: 0, equ: 0.0, pro: 0.0 }
                break;
              case 'dealing':
                e['results']['dealing'] = { tra: 0, equ: 0.0, pro: 0.0 }
                break;
              case 'mel':
                e['results']['mel'] = { tra: 0, equ: 0.0, pro: 0.0 }
                break;
              case 'syn':
                e['results']['syn'] = { tra: 0, equ: 0.0, pro: 0.0 }
                break;
            }
          }
          for(var i of e['result']){
            switch (i['team']) {
              case 'House-MSB':
                e['results']['msb'] = { tra: i['tra'], equ: i['equ'], pro: i['pro'] }
                break;
              case 'House Dealing':
                e['results']['dealing'] = { tra: i['tra'], equ: i['equ'], pro: i['pro'] }
                break;
              case 'Melbourne BDM':
                e['results']['mel'] = { tra: i['tra'], equ: i['equ'], pro: i['pro'] }
                break;
              case 'Sydney BDM':
                e['results']['syn'] = { tra: i['tra'], equ: i['equ'], pro: i['pro'] }
                break;
            }
          }
        }
        delete e.result
      }
    var new_r = {
        dealing:{tra:[],equ:[],pro:[]},
        msb:{tra:[],equ:[],pro:[]},
        mel:{tra:[],equ:[],pro:[]},
        syn:{tra:[],equ:[],pro:[]}
    }
    try {
        for (var i of r){
            for (var j in i['results']) {
                for(var k in i['results'][j]){
                    new_r[j][k].push(i['results'][j][k])
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
    return new_r
}

// module.exports = {getTeamMonth, formatRawData}
