$.getJSON('data.json', function(data) {

	const margin = 60;
	const width = 1000 - 2 * margin;
	const height = 700 - 2 * margin;

	var svg = d3.select("main")
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	const yScale = d3.scaleLinear()
		.range([height, 0])
		.domain([0, 10000]);

	const xScale = d3.scaleBand()
		.range([0, width])
		.domain(data.map((s) => s.organization))
		.padding(0.2);

	const makeYLines = () => d3.axisLeft()
		.scale(yScale);

	const chart = svg.append('g')
		.attr('transform', `translate(${margin}, ${margin})`);

	chart.append('g')
		.attr('transform', `translate(0, ${height})`)
		.call(d3.axisBottom(xScale));

	chart.append('g')
		.call(d3.axisLeft(yScale));

	chart.append('g')
		.attr('class', 'grid')
		.call(makeYLines()
			.tickSize(-width, 0, 0)
			.tickFormat('')
		);

	const barGroups = chart.selectAll()
		.data(data)
		.enter()
		.append('g')
		.attr("fill",
			function(data) {
				return data.color;
			});

	barGroups
		.append('rect')
		.attr('class', 'bar')
		.attr('x', (g) => xScale(g.organization))
		.attr('y', (g) => yScale(g.value))
		.attr('height', (g) => height - yScale(g.value))
		.attr('width', xScale.bandwidth())
		.on('mouseenter', function(actual, i) {
			d3.selectAll('.value')
				.transition()
				.duration(300)
				.attr('opacity', 1);

			d3.select(this)
				.transition()
				.duration(300)
				.attr('opacity', 0.9)
				.attr('x', (a) => xScale(a.organization) - 5)
				.attr('width', xScale.bandwidth() + 10);
		})
		.on('mouseleave', function() {
			d3.selectAll('.value')
				.transition()
				.duration(300)
				.attr('opacity', 0);

			d3.select(this)
				.transition()
				.duration(300)
				.attr('opacity', 1)
				.attr('x', (a) => xScale(a.organization))
				.attr('width', xScale.bandwidth());

			chart.selectAll('#limit').remove();
			chart.selectAll('.divergence').remove();
		});

	barGroups
		.append('text')
		.attr('opacity', 0)
		.attr('class', 'value')
		.attr('x', (a) => xScale(a.organization) + xScale.bandwidth() / 2)
		.attr('y', (a) => yScale(a.value) - 30)
		.attr('text-anchor', 'middle')
		.text((a) => `${a.value}`);

	svg.append('text')
		.attr('class', 'label')
		.attr('x', -(height / 2) - margin)
		.attr('y', margin / 4.0)
		.attr('transform', 'rotate(-90)')
		.attr('text-anchor', 'middle')
		.text('Open Source Contributions');

	svg.append('text')
		.attr('class', 'label')
		.attr('x', width / 2 + margin)
		.attr('y', height + margin * 1.7)
		.attr('text-anchor', 'middle')
		.text('Organizations');

	svg.append('text')
		.attr('class', 'title')
		.attr('x', width / 2 + margin)
		.attr('y', 40)
		.attr('text-anchor', 'middle')
		.text('Open source contributions made by employees of different organizations');

	svg.append('text')
		.attr('class', 'source')
		.attr('x', width - margin / 2 - 100)
		.attr('y', height + margin * 1.7)
		.attr('text-anchor', 'start')
		.text('Source: octoverse.github.com');
});
