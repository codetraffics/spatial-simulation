function draw_grid(data,colors) {
    var width = 600;
    var height = 600;
    var grid_length = data.length;

    var svg = d3.select('body').append('svg')
          .attr('width', width)
          .attr('height', height);

    var rw = Math.floor(width/grid_length);
    var rh = Math.floor(height/grid_length);

    var g = svg.selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr('transform', function (d, i) {
              return 'translate(0, ' + (width/grid_length) * i + ')';
            });

    g.selectAll('rect')
            .data(function (d) {
              return d;
            })
            .enter()
            .append('rect')
            .attr('x', function (d, i) {
              return (width/grid_length) * i;
            })
            .attr('width', rw)
            .attr('height', rh)
            .attr('class',function(d) {
              return d;
            });
    if (!colors) {
    	d3.selectAll(".A1A1").style("fill","#fff");
        d3.selectAll(".A1A2").style("fill","#2176c9");
        d3.selectAll(".A2A2").style("fill","#042029");
    }
    else {
        for (var i = 0; i < colors.length; i = i + 2) {
            d3.selectAll("."+colors[i]).style("fill",colors[i+1]);	
        }
    }
}

function update_grid(data,colors){
    var grid_length = data.length;
    d3.select('svg').selectAll('g')
        .data(data)
        .selectAll('rect')
        .data(function (d) {
          return d;
        })
        .attr('class',function(d) {
          return d;
        });
    if (!colors) {
    	d3.selectAll(".A1A1").style("fill","#fff");
        d3.selectAll(".A1A2").style("fill","#2176c9");
        d3.selectAll(".A2A2").style("fill","#042029");
    }
    else {
        for (var i = 0; i < colors.length; i = i + 2) {
            d3.selectAll("."+colors[i]).style("fill",colors[i+1]);	
        }
    }
}

let grid_length = 100;
let p = 0.5;
let grid = [];
let max_mating_distance = 1;
let a1a1 = 0;
let a2a2 = 0;
let a1a2 = 0;
let generation_counter = 0;

const init_grid = () => {
    for(let i = 0; i < grid_length; i++) {
        grid[i] = [];
        for(let ii = 0; ii < grid_length; ii++) {
            let random_number = Math.random();
            if(random_number < p * p) {
                grid[i][ii] = "A1A1";
                a1a1 += 1;
            }
            else if(random_number > 1 - (1-p) * (1-p)) {
                grid[i][ii] = "A2A2";
                a2a2 += 1;
            }
            else {
                grid[i][ii] = "A1A2";
                a1a2 += 1;
            }
        }
    }
    console.log(a1a1, a1a2, a2a2);
    // console.log(a1a1+a1a2+a2a2);
}

const get_random_int = (min, max) => {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

const get_bounded_index = (index) => {
    let bounded_index = index;
    if(index < 0) {
        bounded_index = index + grid_length;
    }
    if(index >= grid_length) {
        bounded_index = index - grid_length;
    }
    return bounded_index;
}

const pick_mating_partner = (i, ii) => {
    var j = get_random_int(i - max_mating_distance, i + max_mating_distance);
    var jj = get_random_int(ii - max_mating_distance, ii + max_mating_distance);
    j = get_bounded_index(j);
    jj = get_bounded_index(jj);
    return grid[j][jj];
}

const get_offspring = (parent1, parent2) => {
    let p1 = parent1;
    let p2 = parent2;
    if(p1 == "A1A1" && p2 == "A1A1") {
        return "A1A1";
    }
    else if((p1 == "A1A1" && p2 == "A1A2") || (p2 == "A1A1" && p1 == "A1A2")) {
        if(Math.random() < 0.5) {
            return "A1A1";
        } else {
            return "A1A2";
        }
    }
    else if((p1 == "A1A1" && p2 == "A2A2") || (p2 == "A1A1" && p1 == "A2A2")) {
        return "A1A2";
    }
    else if(p1 == "A1A2" && p2 == "A1A2") {
        let random_number = Math.random()
        if(random_number < 0.25) {
            return "A1A1";
        } else if(random_number > 0.75) {
            return "A2A2";
        } else {
            return "A1A2";
        }
    }
    else if((p1 == "A1A2" && p2 == "A2A2") || (p2 == "A1A2" && p1 == "A2A2")) {
        if(Math.random() < 0.5) {
            return "A1A2";
        } else {
            return "A2A2";
        }
    }
    else if(p1 == "A2A2" && p2 == "A2A2") {
        return "A2A2";
    }
}

const print_data = () => {
    a1a1 = 0;
    a1a2 = 0;
    a2a2 = 0;
    
    for(let i = 0; i < grid_length; i++) {
        for(let ii = 0; ii < grid_length; ii++) {
            if(grid[i][ii] == "A1A1") {
                a1a1 += 1;
            } else if (grid[i][ii] == "A1A2") {
                a1a2 += 1;
            } else {
                a2a2 += 1;
            }
        }
    }
    console.log("generation " + generation_counter + ":");
    console.log(a1a1, a1a2, a2a2);
    let N = a1a1 + a1a2 + a2a2;
    let h_o = a1a2 / N;
    let p = ((2 * a1a1) + a1a2) / (2 * N);
    let h_e = 2 * p * (1-p);
    let F = (h_e - h_o) / h_e;
    console.log("F = " + F);
}

const run_generations = () => {
    let temp_grid = [];
    for(let i = 0; i < grid_length; i++) {
        temp_grid[i] = [];
        for(let ii = 0; ii < grid_length; ii++) {
            let mating_partner = pick_mating_partner(i, ii)
            temp_grid[i][ii] = get_offspring(grid[i][ii], mating_partner)
        }
    }

    for(let i = 0; i < grid_length; i++) {
        for(let ii = 0; ii < grid_length; ii++) {
            grid[i][ii] = temp_grid[i][ii];
        }
    }

    print_data();
    generation_counter += 1;
}

init_grid();

draw_grid(grid);

const simulate_and_visualize = () => {
    run_generations();
    update_grid(grid);
}

setInterval(simulate_and_visualize, 100)