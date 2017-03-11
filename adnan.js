function tabulate(data, columns) {
  console.log('table', data, columns
             )
    var table = d3.select(".container").append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
            .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
            .text(function(d) { return d.value; });
    return table;
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


let init = (err, table) => {
  console.log('hello', table.length);

  var peopleTable = tabulate(table, names);


  peopleTable.selectAll("thead th")
    .text(function(column) {
      return column.charAt(0).toUpperCase() + column.substr(1);
    });


  peopleTable.selectAll("tbody tr")
    .sort(function(a, b) {
      return d3.descending(a.age, b.age);
    });
}




d3.csv('MediaReadyActiveCases_03082017.csv', init)
