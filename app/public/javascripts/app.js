var socket = io();
var team_month_raw = {}

function month_mapping(x) {
    switch (x) {
        case 0:
            return 'Jan'
            break;
        case 1:
            return 'Feb'
            break;
        case 2:
            return 'Mar'
            break;
        case 3:
            return 'Apr'
            break;
        case 4:
            return 'May'
            break;
        case 5:
            return 'Jun'
            break;
        case 6:
            return 'Jul'
            break;
        case 7:
            return 'Aug'
            break;
        case 8:
            return 'Sep'
            break;
        case 9:
            return 'Oct'
            break;
        case 10:
            return 'Nov'
            break;
        case 11:
            return 'Dec'
            break;
        default:
            break;
    }
}

Chart.plugins.register({
    afterDatasetsDraw: function(chart) {
        var ctx = chart.ctx;

        chart.data.datasets.forEach(function(dataset, i) {
            var meta = chart.getDatasetMeta(i);
            if (!meta.hidden) {
                meta.data.forEach(function(element, index) {
                    // Draw the text in black, with the specified font
                    ctx.fillStyle = 'rgb(0, 0, 0)';

                    var fontSize = 11;
                    var fontStyle = 'italic';
                    var fontFamily = 'Operator Mono';
                    ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                    // Just naively convert to string for now
                    var dataString = Number(dataset.data[index]).toLocaleString();

                    // Make sure alignment settings are correct
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    var padding = 5;
                    var position = element.tooltipPosition();
                    ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
                });
            }
        });
    }
});

document.getElementById('refreshbtn').addEventListener('click', function () {
    Array.from(['tra', 'pro', 'equ']).forEach(e => {
        var start_month = parseInt($('#fromtime').val()) - 1
        var end_month = parseInt($('#endtime').val()) - 1
        myLine[e].data.labels = Array.from(Array(end_month - start_month + 1).keys(), x => month_mapping(x + start_month))
        myLine[e].data.datasets[0].data = team_month_raw['dealing'][e].slice(start_month, end_month + 1);
        myLine[e].data.datasets[1].data = team_month_raw['msb'][e].slice(start_month, end_month + 1);
        myLine[e].data.datasets[2].data = team_month_raw['mel'][e].slice(start_month, end_month + 1);
        myLine[e].data.datasets[3].data = team_month_raw['syn'][e].slice(start_month, end_month + 1);
        if(e == 'pro' || e == 'equ')
            myBar[e].data.datasets[0].data = Array.from(myLine[e].data.datasets.map( dataset => 
                dataset.data.reduce((a, b) => parseFloat(a+b).toFixed(2))
            ))
        else
            myBar[e].data.datasets[0].data = Array.from(myLine[e].data.datasets.map( dataset => 
                dataset.data.reduce((a, b) => parseInt(a) + parseInt(b))
            ))
        myLine[e].update()
        myBar[e].update()
        var tableRow =  document.getElementById(e);
        myBar[e].data.datasets[0].data.forEach( i => {
            var cell = document.createElement('td');
            cell.appendChild(document.createTextNode(Number(i).toLocaleString()));
            tableRow.appendChild(cell);
        })
    })
})

$(function () {
    window.myLine = {
        tra: new Chart($("#myLinetra"), {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: "House Dealing",
                        data: [],
                        backgroundColor: 'rgb(66, 134, 244,0.2)',
                        borderColor: 'rgba(66, 134, 244, 1)',
                        fill: false
                    }, {
                        label: 'House-MSB',
                        data: [],
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        fill: false
                    }, {
                        label: "Melbourne BDM",
                        data: [],
                        backgroundColor: 'rgb(95, 244, 65,.2)',
                        borderColor: 'rgba(95, 244, 65, 1)',
                        fill: false
                    }, {
                        label: "Sydney BDM",
                        data: [],
                        backgroundColor: 'rgb(238, 244, 65, .2)',
                        borderColor: 'rgba(238, 244, 65, 1)',
                        fill: false
                    }
                ]
            },
            options: {
                elements: {
                    line: {
                        tension: 0.0001
                    }
                },
                scales: {
                    xAxes: [{
                        type: 'category',
                    }],
                    yAxes: [{
                        ticks: {
                            min: 0,
                            stepSize: 5
                        }
                    }],
                },

                responsive: true,
                legend: {
                    position: 'none',
                },
                title: {
                    display: true,
                    text: 'NO. of Trades'
                }
            }
        }),
        equ: new Chart($("#myLineequ"), {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: "House Dealing",
                        data: [],
                        backgroundColor: 'rgb(66, 134, 244,0.2)',
                        borderColor: 'rgba(66, 134, 244, 1)',
                        fill: false
                    }, {
                        label: 'House-MSB',
                        data: [],
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        fill: false
                    }, {
                        label: "Melbourne BDM",
                        data: [],
                        backgroundColor: 'rgb(95, 244, 65,.2)',
                        borderColor: 'rgba(95, 244, 65, 1)',
                        fill: false
                    }, {
                        label: "Sydney BDM",
                        data: [],
                        backgroundColor: 'rgb(238, 244, 65, .2)',
                        borderColor: 'rgba(238, 244, 65, 1)',
                        fill: false
                    }
                ]
            },
            options: {
                elements: {
                    line: {
                        tension: 0.0001
                    }
                },
                scales: {
                    xAxes: [{
                        type: 'category',
                    }],
                    yAxes: [{
                        ticks: {
                            min: 0,
                            stepSize: 20000000
                        }
                    }],
                },

                responsive: true,
                legend: {
                    position: 'none',
                },
                title: {
                    display: true,
                    text: 'Volume in AUD'
                }
            }
        }),
        pro: new Chart($("#myLinepro"), {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: "House Dealing",
                        data: [],
                        backgroundColor: 'rgb(66, 134, 244,0.2)',
                        borderColor: 'rgba(66, 134, 244, 1)',
                        fill: false
                    }, {
                        label: 'House-MSB',
                        data: [],
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        fill: false
                    }, {
                        label: "Melbourne BDM",
                        data: [],
                        backgroundColor: 'rgb(95, 244, 65,.2)',
                        borderColor: 'rgba(95, 244, 65, 1)',
                        fill: false
                    }, {
                        label: "Sydney BDM",
                        data: [],
                        backgroundColor: 'rgb(238, 244, 65, .2)',
                        borderColor: 'rgba(238, 244, 65, 1)',
                        fill: false
                    }
                ]
            },
            options: {
                elements: {
                    line: {
                        tension: 0.0001
                    }
                },
                scales: {
                    xAxes: [{
                        type: 'category',
                    }],
                    yAxes: [{
                        ticks: {
                            min: 0,
                            stepSize: 100000
                        }
                    }],
                },

                responsive: true,
                legend: {
                    position: 'none',
                },
                title: {
                    display: true,
                    text: 'Profit in AUD'
                }
            }
        })
    }
    window.myBar = {
        tra: new Chart($("#myCharttra"), {
            type: 'bar',
            data: {
                labels: ['House Dealing', 'House-MSB', 'Melbourne BDM', 'Sydney BDM'],
                datasets: [{
                    label: '',
                    data: Array.from([0, 0, 0, 0]),
                    backgroundColor: ['rgb(66, 134, 244,0.2)',//dealling color
                        'rgba(255, 99, 132, 0.2)',//msb color
                        'rgb(95, 244, 65,.2)',//mel color
                        'rgb(238, 244, 65, .2)'],//syn color
                    borderColor: ['rgba(66, 134, 244, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(95, 244, 65, 1)',
                        'rgba(238, 244, 65, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'category',
                    }],
                    yAxes: [{
                        ticks: {
                            min: 0,
                            stepSize: 5
                        }
                    }],
                },
                responsive: true,
                legend: {
                    position: 'none',
                },
                title: {
                    display: true,
                    text: 'NO. of Trades'
                }
            }
        }),
        pro: new Chart($("#myChartpro"), {
            type: 'bar',
            data: {
                labels: ['House Dealing', 'House-MSB', 'Melbourne BDM', 'Sydney BDM'],
                datasets: [{
                    label: '',
                    data: Array.from([0, 0, 0, 0]),
                    backgroundColor: ['rgb(66, 134, 244,0.2)',//dealling color
                        'rgba(255, 99, 132, 0.2)',//msb color
                        'rgb(95, 244, 65,.2)',//mel color
                        'rgb(238, 244, 65, .2)'],//syn color
                    borderColor: ['rgba(66, 134, 244, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(95, 244, 65, 1)',
                        'rgba(238, 244, 65, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'category',
                    }],
                    yAxes: [{
                        ticks: {
                            min: 0,
                            stepSize: 100000
                        }
                    }],
                },
                responsive: true,
                legend: {
                    position: 'none',
                },
                title: {
                    display: true,
                    text: 'Profit in AUD'
                }
            }
        }),
        equ: new Chart($("#myChartequ"), {
            type: 'bar',
            data: {
                labels: ['House Dealing', 'House-MSB', 'Melbourne BDM', 'Sydney BDM'],
                datasets: [{
                    label: '',
                    data: Array.from([0, 0, 0, 0]),
                    backgroundColor: ['rgb(66, 134, 244,0.2)',//dealling color
                        'rgba(255, 99, 132, 0.2)',//msb color
                        'rgb(95, 244, 65,.2)',//mel color
                        'rgb(238, 244, 65, .2)'],//syn color
                    borderColor: ['rgba(66, 134, 244, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(95, 244, 65, 1)',
                        'rgba(238, 244, 65, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'category',
                    }],
                    yAxes: [{
                        ticks: {
                            min: 0,
                            stepSize: 20000000
                        }
                    }],
                },
                responsive: true,
                legend: {
                    position: 'none',
                },
                title: {
                    display: true,
                    text: 'Volume in AUD'
                }
            }
        })
    }
    socket.on("report", function (msg) {
        team_month_raw = JSON.parse(msg)
        console.dir(team_month_raw)
    })
})
