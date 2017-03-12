
// let geocoder = (addr) => {
//   addr = 'denver, colorado'

//   let key = 'AIzaSyCSBOUDTFbZrIIW9rh-lxpHVmgbmf_iPJI'

//   let callback = (err, data) => {
//     console.log(data) 
//   }

//   d3.json(`https://maps.googleapis.com/maps/api/geocode/json?$address='{addr}'&key='${key}'`)
//     .get(callback)
// }


let geocoder = new google.maps.Geocoder();




d3.select(document.body).on('error', function () {
  console.log('hello')
})

var svg = d3.select("svg"),
    width = 960,
    height = 500;

let projection = d3.geoConicConformal()
  .parallels([33, 45])
  .rotate([96, -39])


d3.json("us.json", function(error, us) {
  if (error) throw error;

  var conus = topojson.feature(us, {
    type: "GeometryCollection",
    geometries: us.objects.states.geometries.filter(function(d) {
      return d.id !== 2 // AK
        && d.id !== 15 // HI
        && d.id < 60; // outlying areas
    })
  });

  var path = d3.geoPath()
      .projection(
        projection
          .fitSize([width, height], conus)
      );

  svg.append("path")
    .datum(conus)
    .attr("d", path);
});



//endMAP


//1200 new ones
//97%
//how often



'childid', 'childfirstname', 'missingfromcity', 'birthdate', 'postercontact'


function butt(e) {
  console.log(arguments)
  //e.target.style.display= 'none'
}

let templates = {
  missingreportdate: function (row) {
    let k = 
    moment(row.missingreporteddate
          ).fromNow();

    console.log(k)
    return k
  },

  childid: function (row) {
    let url = row.posterurl
    let num = url.split('/')
    let root = `http://www.missingkids.org/photographs/NCMC${num[3]}c1.jpg`
    return `<td><img onerror="this.style.display = 'none'" class="uk-preserve-width uk-border-circle" src="${root}" width="40" alt=""></td>`
  },

  childfirstname: (row) => {
    return `${row.childfirstname} ${row.childlastname}`
  },

  missingfromcity: (row) => {

    return `${row.missingfromcity}, ${row.missingfromstate}, ${row.missingfromcountry}`
  },

  postercontact: (row) => {
    return `<a href="//${row.posterurl}'">${row.postercontact}</a>`
  }
};




function tabulate(data, columns) {
  window.data = data
  var table = d3.select(".container").select("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
            .text(function(column) { return column; });

    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

  var cells = rows.selectAll("td")
        .data(function(row) {
          return columns.map(function(column) {
            return {column: column, value: row[column], row: row };
          });
        })
        .enter()
        .append("td")
      .html(function(d) {
          if (templates[d.column])
            return templates[d.column](d.row)
          else
            return d.value;
        });

  return table;
}

function rerender () {

}


let names = [
  'childid',
  'childfirstname',
  'childlastname',
  'birthdate',
  'sex',
  'race',
  'haircolor',
  'eyecolor',
  'height',
  'weight',
  'missingreporteddate',
  'missingfromdate',
  'missingfromcity',
  'missingfromstate',
  'missingfromcountry',
  'ncmeccasenumber',
  'casetype',
  'ncmeccasemanager',
  'postercontact',
  'posterurl'
]


let important = [
  'childid', 'childfirstname', 'missingfromcity', 'missingreportdate', 'postercontact'
]

let init = (err, table) => {
  console.log('hello', table.length);

  table = table.slice(table.length - 100);

  var peopleTable = tabulate(table, important);


  let count = 0;
  
  table.forEach(function (datum, index) {
    setTimeout(function () {
      geocoder.geocode( { 'address': 'denver, colorado'},
                        function(results, status) {
	                        if (status == google.maps.GeocoderStatus.OK) {
                            let loc = results[0].geometry.location
                            console.log(count+= 1)
                            datum.location = [ loc.lat(), loc.lng() ]
                            if (count > 90) drawDots()
	                        }
                        })

    }, index * 100)
  })
  

  window.peopleTable = peopleTable;
  
  peopleTable.selectAll("thead th")
    .text(function(column) {
      return column.charAt(0).toUpperCase() + column.substr(1);
    }).on('click', () => {
      console.log(this.textContent)
      let key = this.textContent

      peopleTable.selectAll("tbody tr")
      //  .filter((d) => { return })
          .sort(function(a, b) {
            return d3.descending(a[key], b[key]);
          });
    })

}

function filter() {

}

d3.select('input').on('keydown', function () {
  let val = this.value

    peopleTable.selectAll("tbody tr").style('opacity', function (d) {
    return -1 !== d.childfirstname.indexOf(val);
  })
})

function search (){}


d3.csv('MediaReadyActiveCases_03082017.csv', init)

function  drawDots(peopleTable) {
  return;
  svg.selectAll('circle').data(peopleTable, (d) => { return d.childid})
    .enter()
    .append('circle').attr('class', function (d) { return 'year-' + d.year })
    .attr('fill', 'green')
    .attr('stroke', 'none')
    .attr('cx', function(d){ return d.position[0] })
    .attr('cy', function(d){ return d.position[1] })
    .attr('r', 3)
}
