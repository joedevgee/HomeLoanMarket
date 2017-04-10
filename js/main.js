/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }

  // Your custom JavaScript goes here

  // Market Size by State
  var pieChart = echarts.init(document.getElementById('market_state_div'))
  var pieOption = {
    backgroundColor: 'white',
    title : {
        text: 'Market Size by State',
        subtext: '10 Billions',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        right: 'right',
        bottom: 'bottom',
        data:['Washington D.C.','Delaware','Maryland','Virginia','West Virginia']
    },
    series : [
        {
            name: 'Total Loan Amount',
            type: 'pie',
            radius : '70%',
            center: ['50%', '60%'],
            data:[
                {value:20505741, name:'Washington D.C.'},
                {value:12844189, name:'Delaware'},
                {value:125971751, name:'Maryland'},
                {value:207275496, name:'Virginia'},
                {value:16846620, name:'West Virginia'}
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};
  pieChart.setOption(pieOption)

  // Market by state in 2012
  var pieTwelve = echarts.init(document.getElementById('market_state_2012_div'))
  var pieTwelveOption = {
    title: {
        subtext: '2012',
        x:'center',
        top: -20
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    series: [
        {
            name:'Loan Purpose',
            type:'pie',
            selectedMode: 'single',
            radius: [0, '60%'],
            center: ['50%', '60%'],
            label: {
                normal: {
                    position: 'inner'
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:46706849, name:'Purchase', selected:false},
                {value:113179744, name:'Refinance'}            ]
        },
        {
            name:'State',
            type:'pie',
            radius: ['75%', '80%'],
            center: ['50%', '60%'],
            data:[
                {value:8368582, name:'DC'},
                {value:5253819, name:'DE'},
                {value:54095591, name:'MD'},
                {value:86144960, name:'VA'},
                {value:6023641, name:'WV'}
            ]
        }
    ]
};
  pieTwelve.setOption(pieTwelveOption)

  // Market by state in 2013
  var pieThirteen = echarts.init(document.getElementById('market_state_2013_div'))
  var pieThirteenOption = {
    title: {
        subtext: '2013',
        x:'center',
        top: -20
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    series: [
        {
            name:'Loan Purpose',
            type:'pie',
            selectedMode: 'single',
            radius: [0, '60%'],
            center: ['50%', '60%'],
            label: {
                normal: {
                    position: 'inner'
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:53660124, name:'Purchase', selected:false},
                {value:79719904, name:'Refinance'}            ]
        },
        {
            name:'State',
            type:'pie',
            radius: ['75%', '80%'],
            center: ['50%', '60%'],
            data:[
                {value:7092372, name:'DC'},
                {value:4598409, name:'DE'},
                {value:43640475, name:'MD'},
                {value:72210009, name:'VA'},
                {value:5838763, name:'WV'}
            ]
        }
    ]
};
  pieThirteen.setOption(pieThirteenOption)

  // Market by state in 2013
  var pieForteen = echarts.init(document.getElementById('market_state_2014_div'))
  var pieForteenOption = {
    title: {
        subtext: '2014',
        x:'center',
        top: -20
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    series: [
        {
            name:'Loan Purpose',
            type:'pie',
            selectedMode: 'single',
            radius: [0, '60%'],
            center: ['50%', '60%'],
            label: {
                normal: {
                    position: 'inner'
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:54225405, name:'Purchase', selected:false},
                {value:35951771, name:'Refinance'}            ]
        },
        {
            name:'State',
            type:'pie',
            radius: ['75%', '80%'],
            center: ['50%', '60%'],
            data:[
                {value:5044787, name:'DC'},
                {value:2991961, name:'DE'},
                {value:28235685, name:'MD'},
                {value:48920527, name:'VA'},
                {value:4984216, name:'WV'}
            ]
        }
    ]
};
  pieForteen.setOption(pieForteenOption)

  // Market Trend by Year
  var trendChart = echarts.init(document.getElementById('trend_chart_div'))
  var trendOption = {
    backgroundColor: 'white',
      title: {
          left: 'center',
          text: 'Click below to view individual state'
      },
      tooltip : {
          trigger: 'axis'
      },
      legend: {
          top: 25,
          data:['Washington D.C.','Delaware','Maryland','Virginia','West Virginia']
      },
      toolbox: {
          feature: {
              saveAsImage: {}
          }
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis : [
          {
              type : 'category',
              boundaryGap : false,
              data : ['2012','2013','2014']
          }
      ],
      yAxis : [
          {
              type : 'value'
          }
      ],
      series : [
          {
              name:'Washington D.C.',
              type:'line',
              stack: 'Total Loan Size',
              areaStyle: {normal: {}},
              data:[8368582,7092372,5044787]
          },
          {
              name:'Delaware',
              type:'line',
              stack: 'Total Loan Size',
              areaStyle: {normal: {}},
              data:[5253819,4598409,2991961]
          },
          {
              name:'Maryland',
              type:'line',
              stack: 'Total Loan Size',
              areaStyle: {normal: {}},
              data:[54095591,43640475,28235685]
          },
          {
              name:'Virginia',
              type:'line',
              stack: 'Total Loan Size',
              areaStyle: {normal: {}},
              data:[86144960,72210009,48920527]
          },
          {
              name:'West Virginia',
              type:'line',
              stack: 'Total Loan Size',
              label: {
                  normal: {
                      show: false,
                      position: 'top'
                  }
              },
              areaStyle: {normal: {}},
              data:[6023641,5838763,4984216]
          }
      ]
  };
  trendChart.setOption(trendOption)

})();
