// Stop words provided by https://github.com/6/stopwords-json
const stopWords = ["a","a's","able","about","above","according","accordingly","across","actually","after","afterwards","again","against","ain't","all","allow","allows","almost","alone","along","already","also","although","always","am","among","amongst","an","and","another","any","anybody","anyhow","anyone","anything","anyway","anyways","anywhere","apart","appear","appreciate","appropriate","are","aren't","around","as","aside","ask","asking","associated","at","available","away","awfully","b","be","became","because","become","becomes","becoming","been","before","beforehand","behind","being","believe","below","beside","besides","best","better","between","beyond","both","brief","but","by","c","c'mon","c's","came","can","can't","cannot","cant","cause","causes","certain","certainly","changes","clearly","co","com","come","comes","concerning","consequently","consider","considering","contain","containing","contains","corresponding","could","couldn't","course","currently","d","definitely","described","despite","did","didn't","different","do","does","doesn't","doing","don't","done","down","downwards","during","e","each","edu","eg","eight","either","else","elsewhere","enough","entirely","especially","et","etc","even","ever","every","everybody","everyone","everything","everywhere","ex","exactly","example","except","f","far","few","fifth","first","five","followed","following","follows","for","former","formerly","forth","four","from","further","furthermore","g","get","gets","getting","given","gives","go","goes","going","gone","got","gotten","greetings","h","had","hadn't","happens","hardly","has","hasn't","have","haven't","having","he","he's","hello","help","hence","her","here","here's","hereafter","hereby","herein","hereupon","hers","herself","hi","him","himself","his","hither","hopefully","how","howbeit","however","i","i'd","i'll","i'm","i've","ie","if","ignored","immediate","in","inasmuch","inc","indeed","indicate","indicated","indicates","inner","insofar","instead","into","inward","is","isn't","it","it'd","it'll","it's","its","itself","j","just","k","keep","keeps","kept","know","known","knows","l","last","lately","later","latter","latterly","least","less","lest","let","let's","like","liked","likely","little","look","looking","looks","ltd","m","mainly","many","may","maybe","me","mean","meanwhile","merely","might","more","moreover","most","mostly","much","must","my","myself","n","name","namely","nd","near","nearly","necessary","need","needs","neither","never","nevertheless","new","next","nine","no","nobody","non","none","noone","nor","normally","not","nothing","novel","now","nowhere","o","obviously","of","off","often","oh","ok","okay","old","on","once","one","ones","only","onto","or","other","others","otherwise","ought","our","ours","ourselves","out","outside","over","overall","own","p","particular","particularly","per","perhaps","placed","please","plus","possible","presumably","probably","provides","q","que","quite","qv","r","rather","rd","re","really","reasonably","regarding","regardless","regards","relatively","respectively","right","s","said","same","saw","say","saying","says","second","secondly","see","seeing","seem","seemed","seeming","seems","seen","self","selves","sensible","sent","serious","seriously","seven","several","shall","she","should","shouldn't","since","six","so","some","somebody","somehow","someone","something","sometime","sometimes","somewhat","somewhere","soon","sorry","specified","specify","specifying","still","sub","such","sup","sure","t","t's","take","taken","tell","tends","th","than","thank","thanks","thanx","that","that's","thats","the","their","theirs","them","themselves","then","thence","there","there's","thereafter","thereby","therefore","therein","theres","thereupon","these","they","they'd","they'll","they're","they've","think","third","this","thorough","thoroughly","those","though","three","through","throughout","thru","thus","to","together","too","took","toward","towards","tried","tries","truly","try","trying","twice","two","u","un","under","unfortunately","unless","unlikely","until","unto","up","upon","us","use","used","useful","uses","using","usually","uucp","v","value","various","very","via","viz","vs","w","want","wants","was","wasn't","way","we","we'd","we'll","we're","we've","welcome","well","went","were","weren't","what","what's","whatever","when","whence","whenever","where","where's","whereafter","whereas","whereby","wherein","whereupon","wherever","whether","which","while","whither","who","who's","whoever","whole","whom","whose","why","will","willing","wish","with","within","without","won't","wonder","would","wouldn't","x","y","yes","yet","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves","z","zero"]
// Problematic words
const problemWords = ['quot', 'la', 'ya', 'isn', 'doesn', 'll', 'put', 've', 'pac']

const data = fetch('data/music.json')
  .then((d) => d.json())
  .then(processData)

let svgs = []
let words = []

function countWords(reviews) {
  let counts = {}

  for (let i in reviews) {
    let review = reviews[i]
    const words = review.reviewText.split(' ')
    for (let j in words) {
      let word = words[j]
      if (stopWords.includes(word) || stopWords.includes(word + 's')
          || problemWords.includes(word))
        continue;

      const rating = review.overall
      if (word in counts) {
        counts[word][rating]++
      }
      else {
        counts[word] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        counts[word][rating] = 1
      }
    }
  }
  return counts
}

function topX(words, amount) {
  var arrItems = Object.keys(words).map((w) => {
    return words[w]
  })
  // Sort in-place by the rating
  arrItems.sort((i1, i2) => {
    let sum1 = 0
    let sum2 = 0
    for (let key in i1.counts) {
      const count = i1.counts[key]
      sum1 += count
    }
    for (let key in i2.counts) {
      const count = i2.counts[key]
      sum2 += count
    }
    // return i2.counts[key] - i1.counts[key]
    return sum2 - sum1
  })

  return arrItems.slice(0, amount)
}

function topX(words, key, amount) {
  var arrItems = Object.keys(words).map((w) => {
    return words[w]
  })
  // Sort in-place by the rating
  arrItems.sort((i1, i2) => {
    return i2.counts[key] - i1.counts[key]
  })

  return arrItems.slice(0, amount)
}

function processData(data) {
  data = data.data
  for (let i in data) {
    let review = data[i]
    let reviewText = review.reviewText
    // Remove extra non-alphabetical chars from each review
    reviewText = reviewText.replace(/(\d|[^\w])+/g, ' ')
    // Remove single letters
    reviewText = reviewText.replace(/ [\w] /g, ' ')
    // Remove everything ending in an s or ies...
    reviewText = reviewText.replace(/ ([\w]*)ies /g, ' $1 ')
    reviewText = reviewText.replace(/ ([\w]*)s /g, ' $1 ')
    reviewText = reviewText.toLowerCase()
    review.reviewText = reviewText
  }
  console.log(data[0].reviewText)

  let counts = countWords(data)

  let allWords = []
  for (let key in counts) {
    allWords.push({word: key, counts: counts[key]})
  }

  console.log("This many 'words': " + allWords.length)

  // range of "words" to use
  const wordsToShow = 50
  // const wordsToShow = 250
  words = normalizeSizes(allWords)
  console.log("Using this many unique words: " + words.length)

  for (var i = 1; i <= 5; i++) {
    let myWords = topX(words, i, wordsToShow)

    console.log("Using this many unique words: " + words.length)

    svgs.push([drawCloud(myWords, 'word-cloud-' + i, i), updateCloud])
    svgs.push([drawBar(myWords, 'bar-chart-' + i, i), updateBar])
  }
}

function normalizeSizes(words) {
  let ratings = [1.0, 2.0, 3.0, 4.0, 5.0]
  for (let i in ratings) {
    const rating = ratings[i]
    let max = 1
    let sum = 0
    for (let j in words) {
      const word = words[j]
      max = Math.max(max, word.counts[rating])
      sum += word.counts[rating]
    }
    max /= 10 // larger distinction in exponential curve
    const avg = sum / words.length
    console.log(max, sum)
    words.forEach((w) => { if (!('sizes' in w)) w.sizes = {} })
    words.forEach((w) => w.sizes[rating] = Math.min(80, 8 * Math.pow(2, 1 + w.counts[rating] / max)))
    // words.forEach((w) => w.counts[rating] = 2 * Math.exp(w.counts[rating] / max))
    // words.forEach((w, i) => w.counts[rating] = i / 2)
  }

  return words
}

function updateCloud(svg, word) {
  svg
    .selectAll("text")
    .classed('selected', (d) => d.word === word)
}
function updateBar(svg, word) {
  svg
    .selectAll(".bar")
    .classed('selected', (d) => d.word === word)
}

function drawCloud(words, id, rating) {
  // set the dimensions and margins of the graph
  let margin = {top: 120, right: 0, bottom: 60, left: 0},
    width = 500,
    height = 500;
  // append the svg object to the body of the page
  let svg = d3.select('#' + id).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")")
    .attr('id', id + '-svg')

  // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
  // Wordcloud features that are different from one word to the other must be here
  function drawAll() {
    console.log('Drawing all')
    var layout = d3.layout.cloud()
      .size([width, height])
      .words(words.map((w) => {
        w.text = w.word
        return w
      }))
      .padding((d) => 1 + d.sizes[rating] / 10)        //space between words
      // .rotate(function() { return 0;})
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .fontSize(function(d) { return d.sizes[rating]; })      // font size of words
      .on("end", draw);
    layout.start();

    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here
    function draw() {
      svg
        .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return d.sizes[rating]; })
          .attr("class", "cloud")
          .attr("text-anchor", "middle")
          .style("font-family", "Impact")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; })
          .on('mouseover', handleMouseOver)
          .on('mouseout', handleMouseOut)
          .on('click', handleClick)
    }

  }
  drawAll()
  return svg
}

function drawBar(words, id, rating) {
  // set the dimensions and margins of the graph
  let margin = {top: 120, right: 0, bottom: 60, left: 50},
    width = 500,
    height = 500;
  let svg = d3.select('#' + id).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");
  let x = d3.scaleBand()
            .range([0, width])
            .padding(.4)
  let y = d3.scaleLinear()
            .range([height, 0])
  // Scale the range of the data in the domains
  x.domain(words.map(function(d) { return d.word; }));
  y.domain([0, d3.max(words, function(d) { return d.counts[rating]; })]);

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
        .data(words)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.word) + 1; })
        .attr("width", 10)
        .attr("y", function(d) { return y(d.counts[rating]); })
        .attr("height", function(d) { return height - y(d.counts[rating]); })
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
        .on('click', handleClick)

  // add the x Axis
  svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", "-.7em")
          .attr("transform", "rotate(-90)")

  // add the y Axis
  svg.append("g")
        .call(d3.axisLeft(y))

  return svg
}

// Create Event Handlers for mouse
function handleMouseOver(d, i) {  // Add interactivity
  d3.select(this).classed('hover', true);
  d3.select(this).classed('cloud', false);
  const textString = d.word + '<br/>'
    + '1.0: ' + d.counts[1] + '<br/>'
    + '2.0: ' + d.counts[2] + '<br/>'
    + '3.0: ' + d.counts[3] + '<br/>'
    + '4.0: ' + d.counts[4] + '<br/>'
    + '5.0: ' + d.counts[5] + '<br/>'
  // Select the parent svg
  let svg = d3.select(this.parentNode).select(function() { return this.parentNode }).select(function() { return this.tagName === 'svg' ? this : this.parentNode })
  // Specify where to put label of text
  let toxt = svg.append('foreignObject')
      .attr('height', 120)
      .attr('width', 100)
      .attr('class', 'extra')
      .attr('id', 't-' + d.word)  // Create an id for text so we can select it later for removing on mouseout
    .append("xhtml:body")
      .html('<div class="info">' + textString + '</div>')
}

function handleMouseOut(d, i) {
  d3.select(this).classed('hover', false);
  d3.select(this).classed('cloud', true);

  // Select text by id and then remove

  d3.select('#t-' + d.word).remove();  // Remove text location
}

function handleClick(d, i) {  // Add interactivity
  for (let j in svgs) {
    const svg = svgs[j]
    svg[1](svg[0], d.word)
  }
}
