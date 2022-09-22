var Twit = require('twit')
const cron = require("node-cron");

var T = new Twit({
  consumer_key:         '',
  consumer_secret:      '',
  access_token:         '',
  access_token_secret:  '',
})


const cronSchedule = "*/1 * * * *";

const job = async () =>{

  var twitParams =
  {
    exclude_replies: true,
    screen_name: "JustinTrudeau",
    count: 1,
    result_type: 'recent',
    lang: 'en',
    retweeted: false,
    tweet_mode: 'extended',

    retweeted_status:
    {
      truncated: false
    }
  }
  
  const emoji = ['(´･ᴗ･ ` )','(ﾉ◕ヮ◕)ﾉ','(„• ֊ •„)', 	'(.❛ ᴗ ❛.)', '(⁀ᗢ⁀)', '(￢‿￢ ),', 
    '(¬‿¬ )' , '(*￣▽￣)','( ˙▿˙ )', 	'(¯▿¯)', 	'( ◕▿◕ )', 	'＼(٥⁀▽⁀ )／','(„• ᴗ •„)', 	
    '(ᵔ◡ᵔ) '	, '( ´ ▿ ` )', '☜(⌒▽⌒)☞','	(｡◕‿‿◕｡)','(⁠◕⁠ᴗ⁠◕⁠✿⁠)','(⁠◡⁠ ⁠ω⁠ ⁠◡⁠)','(⁠◠⁠‿⁠◕⁠)',
    '(⁠✿⁠ ⁠♡⁠‿⁠♡⁠)','(￣▽￣*)ゞ',' 	(*^.^*)', ';3','(´꒳`)♡','(* ^ ω ^)',' 	(ᵔ◡ᵔ)','＼(＾▽＾)／'];


  T.get("statuses/user_timeline", twitParams, function(err, data, response) {
    
    tweetText = data[0].full_text;
    
    tweetText = tweetText.toLowerCase();
    tweetText = tweetText.replaceAll('l','w');
    tweetText = tweetText.replaceAll('r','w');
    tweetText = tweetText.replaceAll('n','wn');
    tweetText = tweetText.replaceAll(' t', ' t-t');
    tweetText = tweetText.replaceAll(' d', ' d-d');
    //tweetText = tweetText.replace(' ', ' '+emoji[Math.floor(Math.random()*emoji.length)]+ ' ');
    //tweetText = tweetText.replace(', ',' '+ emoji[Math.floor(Math.random()*emoji.length)] + '. ');

    if(tweetText[0] == 'h'){
      tweetText = tweetText.replace('h', ' h-h');
    }
    if(tweetText[0] == 't'){
      tweetText = tweetText.replace('t', 't-t');
    }
    if(tweetText[0] == 'w'){
      tweetText = tweetText.replace('w', 'w-w');
    }
    if(tweetText[0] == 'd'){
      tweetText = tweetText.replace('d', 'd-d');
    }

    tweetText = tweetText.replaceAll(/(?:https?|ftp):\/\/[\n\S]+/g, '');

    T.post('statuses/update', {status: tweetText});

  })
};

const main = async () => {
  cron.schedule(cronSchedule, async ()  => {
    await job();
  })
}

main();

