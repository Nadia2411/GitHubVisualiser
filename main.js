var form = document.getElementById("myForm")

form.addEventListener('submit',function(e){
  e.preventDefault()
  var search = document.getElementById("search").value
  var oName = search.split(' ').join('')
  document.getElementById("result").innerHTML =""
  fetch("https://api.github.com/users/" + oName)
  .then((result) => result.json())
  .then((data) =>{
    console.log(data)
    document.getElementById("result").innerHTML = `
      <a target ="_blank" href = "https://github.com/${oName}">
       <img src = "${data.avatar_url}" width="200" height="200"/>
      </a>
      <div href = "https://github.com/${oName}">
        <br>
        <h3> ${oName}</h3>
        Bio: <i>${data.bio==null?" ":data.bio}</i>
        <br>
        Following: <i>${data.following==0?"0":data.following}</i>
        <br>
        Followers: <i>${data.followers==0?"0":data.followers}</i>
        <br>
        Repositories: <i>${data.public_repos}</i>
        <br>
        Joined: <i>${data.created_at}</i>
      </div>
    `
  })
})
  
function handleInput(input) {
    var user = document.getElementById("search").value;
    user = user.replace(/\s/g, '');
    var token = undefined
        if (languageChart != null) languageChart;
        if (hourCommitChart != null) hourCommitChart;
        chartType = (input==2) ?    'doughnut':'bar';
    main(user, token, chartType);
}

async function main(user, token, chartType) {
    var url = `https://api.github.com/users/${user}/repos`;
    var repo = await getRequest(url, token).catch(error => console.error(error));
    url = `https://api.github.com/users/${user}`;
    var user_info = await getRequest(url, token).catch(error => console.error(error));
    get_language_pie(repo, user, token, chartType);
    get_commits_times(repo, user, token);
}

async function getRequest(url, token) {
    const headers = {
        'Authorization': `Token ${token}`
    }
    const response = (token == undefined) ? await fetch(url) : await fetch(url, {
        "method": "GET",
        "headers": headers
    });
    let data = await response.json();
    return data;
}

async function get_language_pie(repo, user, token, chartType) {
    let data = [];
    let label = [];
    for (i in repo) {
        let url = `https://api.github.com/repos/${user}/${repo[i].name}/languages`;
        let languages = await getRequest(url, token).catch(error => console.error(error));
        for (language in languages) {
            if (label.includes(language)) {
                for (i = 0; i < label.length; i++)
                    if (language == label[i])
                        data[i] = data[i] + languages[language];
            } else {
                label.push(language);
                data.push(languages[language]);
            }
        }
    }
    draw('language', chartType, label, data);
}

function draw(ctx, chartType, label, data) {
    let myChart = document.getElementById(ctx).getContext('2d');
    languageChart = new Chart(myChart, {
        type: chartType,
        data: {
            labels: label,
            datasets: [{
                data: data,
                label:"languages",
                backgroundColor: [
                    'rgb(230, 25, 75)', 'rgb(60, 180, 75)', 'rgb(255, 225, 25)',
                    'rgb(0, 130, 200)', 'rgb(245, 130, 48)', 'rgb(145, 30, 180)',
                    'rgb(70, 240, 240)', 'rgb(240, 50, 230)', 'rgb(210, 245, 60)',
                    'rgb(250, 190, 212)', 'rgb(0, 128, 128)', 'rgb(220, 190, 255)',
                    'rgb(170, 255, 195)', 'rgb(160, 0, 66)', 'rgb(0, 128, 0)',
                ],
                borderColor: [
                    'rgb(230, 25, 75)', 'rgb(60, 180, 75)', 'rgb(255, 225, 25)',
                    'rgb(0, 130, 200)', 'rgb(245, 130, 48)', 'rgb(145, 30, 180)',
                    'rgb(70, 240, 240)', 'rgb(240, 50, 230)', 'rgb(210, 245, 60)',
                    'rgb(250, 190, 212)', 'rgb(0, 128, 128)', 'rgb(220, 190, 255)',
                    'rgb(170, 255, 195)', 'rgb(160, 0, 66)', 'rgb(0, 128, 0)',
                ],
                borderWidth: 1
            }],
        },
    });
}

async function get_commits_times(repo, user, token) {
    let label = [];
    let data = [];
    let backgroundColor = [];
    var hours = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10','11', '12', 
    '13', '14', '15', '16', '17', '18', '19', '20','21', '22', '23', '24' ];
    for (i in repo) {
        let url = `https://api.github.com/repos/${user}/${repo[i].name}/commits?per_page=100`;
        let commits = await getRequest(url, token).catch(error => console.error(error));
        for (j in commits) {
            let date = commits[j].commit.committer.date;
            var h = new Date(date);
            let hour = hours[h.getHours()];
            if (label.includes(hour)) {
                for (i = 0; i < label.length; i++)
                    if (hour == label[i])
                        data[i] += 1;
            } else {
                label.push(hour);
                data.push(1);
                backgroundColor.push('rgb(58, 144, 255)');
            }
        }
    }
    drawHour('commits', 'commits',  label, data);
}


function drawHour(cont, label, data) {

    let myChart = document.getElementById(cont).getContext('2d');

    hrComChart = new Chart(myChart, {
        type: 'line',
        data: {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10','11', '12', 
            '13', '14', '15', '16', '17', '18', '19', '20','21', '22', '23', '24'],
            datasets: [{
                data: data,
                label:"commits/hour",
                borderWidth: 1,
                hoverBorderWidth: 2,
                borderColor: 'rgb(58, 144, 255)',
                hoverBorderColor: 'rgb(58, 144, 255)',
            }],
            options: {
                responsive: true,
                scales: {
                    xAxes: [ {
                      type: 'time',
                      display: true,
                      scaleLabel: {
                        display: true,
                        labelString: 'Hour'
                      },
                      ticks: {
                        major: {
                          fontStyle: 'bold',
                          fontColor: '#FF0000'
                        }
                      }
                    } ],
                    yAxes: [ {
                        display: true,
                        scaleLabel: {
                        display: true,
                        labelString: 'Frequency'
                        }
                    }]
                }
            }
        },
    });
}

async function toggleChart() {
  var statue = 2;
  handleInput(statue);
}

var languageChart = null;
var hourCommitChart = null;