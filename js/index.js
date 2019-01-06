const projectName = 'bar-chart';
localStorage.setItem('example_project', 'D3: Bar Chart');

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json').then(function(data) {
	const dataset = data['data'];

	const w = 1032;
	const h = 500;
	const padding = 50;
	const barW = w / dataset.length;

	const xScale = d3.scaleTime()
										.domain([d3.min(dataset, (d) => new Date(d[0])), d3.max(dataset, (d) => new Date(d[0]))])
										.range([padding, w - padding]);

	const yScale = d3.scaleLinear()
										.domain([0, d3.max(dataset, (d) => d[1])])
										.range([0, h - (padding * 2)]);

	const yScaleAxis = d3.scaleLinear()
												.domain([0, d3.max(dataset, (d) => d[1])])
												.range([h - padding, padding]);

	// d3.select('#description').html(data['description'].replace(/\n/, '<br>'));

	var tooltip = d3.select('body')
									.append('div')
									.attr('id', 'tooltip');

	const svg = d3.select('#canvas')
								.append('svg')
								.attr('width', w)
								.attr('height', h);

	svg.selectAll('rect')
			.data(dataset)
			.enter()
			.append('rect')
			.attr('x', (d, i) => xScale(new Date(d[0])))
			.attr('y', (d, i) => h - padding - yScale(d[1]))
			.attr('width', barW)
			.attr('height', (d, i) => yScale(d[1]))
			// .attr('fill', 'gray')
			.attr('class', 'bar')
			.attr('data-date', (d, i) => d[0])
			.attr('data-gdp', (d, i) => d[1])
			// .append('title')
			// .text(d => d[0] + ': ' + d[1])
			.on('mouseover', (d) => tooltip.style('display', 'block').attr('data-date', d[0]).text(d[0].replace('-01-01', ' Q1').replace('-04-01', ' Q2').replace('-07-01', ' Q3').replace('-10-01', ' Q4') + ': $' + d[1] + ' Billion'))
			.on('mousemove', (d) => tooltip.style('top', (h + (padding / 2) - yScale(d[1])) + 'px').style('left', d3.event.pageX + 'px'))
			.on('mouseout', () => tooltip.style('display', 'none'));

	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScaleAxis);

	svg.append('g')
			.attr('id', 'x-axis')
			.attr('transform', 'translate(0, ' + (h - padding) + ')')
			.call(xAxis);

	svg.append('text')             
      .attr('transform', 'translate(' + (w / 2) + ', ' + (h - 10) + ')')
      .style('text-anchor', 'middle')
      .text('Date');

	svg.append('g')
			.attr('id', 'y-axis')
			.attr('transform', 'translate(' + padding + ', 0)')
			.call(yAxis);

	svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0)
      .attr('x', 0 - (h / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('GDP');
});