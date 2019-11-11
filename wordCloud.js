// Stop words provided by https://github.com/6/stopwords-json
const stopWords = ["a","a's","able","about","above","according","accordingly","across","actually","after","afterwards","again","against","ain't","all","allow","allows","almost","alone","along","already","also","although","always","am","among","amongst","an","and","another","any","anybody","anyhow","anyone","anything","anyway","anyways","anywhere","apart","appear","appreciate","appropriate","are","aren't","around","as","aside","ask","asking","associated","at","available","away","awfully","b","be","became","because","become","becomes","becoming","been","before","beforehand","behind","being","believe","below","beside","besides","best","better","between","beyond","both","brief","but","by","c","c'mon","c's","came","can","can't","cannot","cant","cause","causes","certain","certainly","changes","clearly","co","com","come","comes","concerning","consequently","consider","considering","contain","containing","contains","corresponding","could","couldn't","course","currently","d","definitely","described","despite","did","didn't","different","do","does","doesn't","doing","don't","done","down","downwards","during","e","each","edu","eg","eight","either","else","elsewhere","enough","entirely","especially","et","etc","even","ever","every","everybody","everyone","everything","everywhere","ex","exactly","example","except","f","far","few","fifth","first","five","followed","following","follows","for","former","formerly","forth","four","from","further","furthermore","g","get","gets","getting","given","gives","go","goes","going","gone","got","gotten","greetings","h","had","hadn't","happens","hardly","has","hasn't","have","haven't","having","he","he's","hello","help","hence","her","here","here's","hereafter","hereby","herein","hereupon","hers","herself","hi","him","himself","his","hither","hopefully","how","howbeit","however","i","i'd","i'll","i'm","i've","ie","if","ignored","immediate","in","inasmuch","inc","indeed","indicate","indicated","indicates","inner","insofar","instead","into","inward","is","isn't","it","it'd","it'll","it's","its","itself","j","just","k","keep","keeps","kept","know","known","knows","l","last","lately","later","latter","latterly","least","less","lest","let","let's","like","liked","likely","little","look","looking","looks","ltd","m","mainly","many","may","maybe","me","mean","meanwhile","merely","might","more","moreover","most","mostly","much","must","my","myself","n","name","namely","nd","near","nearly","necessary","need","needs","neither","never","nevertheless","new","next","nine","no","nobody","non","none","noone","nor","normally","not","nothing","novel","now","nowhere","o","obviously","of","off","often","oh","ok","okay","old","on","once","one","ones","only","onto","or","other","others","otherwise","ought","our","ours","ourselves","out","outside","over","overall","own","p","particular","particularly","per","perhaps","placed","please","plus","possible","presumably","probably","provides","q","que","quite","qv","r","rather","rd","re","really","reasonably","regarding","regardless","regards","relatively","respectively","right","s","said","same","saw","say","saying","says","second","secondly","see","seeing","seem","seemed","seeming","seems","seen","self","selves","sensible","sent","serious","seriously","seven","several","shall","she","should","shouldn't","since","six","so","some","somebody","somehow","someone","something","sometime","sometimes","somewhat","somewhere","soon","sorry","specified","specify","specifying","still","sub","such","sup","sure","t","t's","take","taken","tell","tends","th","than","thank","thanks","thanx","that","that's","thats","the","their","theirs","them","themselves","then","thence","there","there's","thereafter","thereby","therefore","therein","theres","thereupon","these","they","they'd","they'll","they're","they've","think","third","this","thorough","thoroughly","those","though","three","through","throughout","thru","thus","to","together","too","took","toward","towards","tried","tries","truly","try","trying","twice","two","u","un","under","unfortunately","unless","unlikely","until","unto","up","upon","us","use","used","useful","uses","using","usually","uucp","v","value","various","very","via","viz","vs","w","want","wants","was","wasn't","way","we","we'd","we'll","we're","we've","welcome","well","went","were","weren't","what","what's","whatever","when","whence","whenever","where","where's","whereafter","whereas","whereby","wherein","whereupon","wherever","whether","which","while","whither","who","who's","whoever","whole","whom","whose","why","will","willing","wish","with","within","without","won't","wonder","would","wouldn't","x","y","yes","yet","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves","z","zero"]

const data = fetch('data/music.json')
  .then((d) => d.json())
  .then(processData)

function countWords(arr) {
  let counts = {}

  for (let i in arr) {
    let str = arr[i]
    const words = str.split(' ')
    for (let j in words) {
      let word = words[j]
      if (stopWords.includes(word))
        continue;
      if (word in counts)
        counts[word]++
      else
        counts[word] = 1
    }
  }
  return counts
}

function processData(data) {
  data = data.data
  var reviewTexts = data.map((d) => d.reviewText);
  // Remove extra chars from each review
  reviewTexts = reviewTexts.map((t) => t.replace(/[^\w\d]+/g, ' '))
  // Remove single letters
  reviewTexts = reviewTexts.map((t) => t.replace(/ [^\d] /g, ' '))
  // Remove everything ending in an s...
  reviewTexts = reviewTexts.map((t) => t.replace(/ ([\w]*)ies /g, ' $1 '))
  reviewTexts = reviewTexts.map((t) => t.replace(/ ([\w]*)s /g, ' $1 '))
  reviewTexts = reviewTexts.map((t) => t.toLowerCase())
  console.log('HELLO M8')
  console.log(reviewTexts[0])

  let counts = countWords(reviewTexts)
  console.log(JSON.stringify(counts['blend']))

  let allWords = []
  for (let key in counts) {
    allWords.push({word: key, size: "" + counts[key]})
  }

  console.log("This many 'words': " + allWords.length)

  // range of "words" to use
  const maxUses = 100000;
  const minUses = 5000;
  let words = []
  for (let key in allWords) {
    let word = allWords[key]
    if (word.size >= minUses && word.size <= maxUses)
      words.push(word)
  }

  console.log("Using this many 'words': " + words.length)
  words = normalizeSizes(words)

  words.map(JSON.stringify).map(console.log)
  drawAll(words)
}

function normalizeSizes(words) {
  let max = 0
  words.forEach((w) => max = Math.max(max, w.size))
  console.log('max: ' + max)
  // words.map(JSON.stringify).map(console.log)
  words.forEach((w) => w.size = 100 * w.size / max)
  words.map(JSON.stringify).map(console.log)

  return words
}

// set the dimensions and margins of the graph
let margin = {top: 0, right: 0, bottom: 0, left: 0},
  width = 1000 - margin.left - margin.right,
  height = 1000 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#word-cloud").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
// Wordcloud features that are different from one word to the other must be here
function drawAll(words) {
  var layout = d3.layout.cloud()
    .size([width, height])
    .words(words.map(function(d) { return {text: d.word, size:d.size}; }))
    .padding(5)        //space between words
    .rotate(function() { return 0;})//~~(Math.random() * 2) * 90; })
    .fontSize(function(d) { return d.size; })      // font size of words
    .on("end", draw);
  layout.start();

  // This function takes the output of 'layout' above and draw the words
  // Wordcloud features that are THE SAME from one word to the other can be here
  function draw(words) {
    console.log('DRAWING NOW!')
    svg
      .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", function(d) { return d.size; })
      .style("fill", "#69b3a2")
      .attr("text-anchor", "middle")
      .style("font-family", "Impact")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
  }
}
