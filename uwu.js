import Twit from "twit";
import cron from "node-cron";
import minimist from "minimist";
import { Low, JSONFile } from "lowdb";

const argv = minimist(process.argv.slice(2));

const file = "db.json";
const adapter = new JSONFile(file);
const db = new Low(adapter);

const T = new Twit({
  consumer_key:         'fGvIhWfPxR1AM5z7mH2vyi9Wn',
  consumer_secret:      '2aehHgChOmwSg2k4x8ITDbfa4lKL4kWqYqkaGyRJn6Cn3ZY8jm',
  access_token:         '1572739462567792641-359OAqPE4m2UkNjbP1WFUEtXLSuuyp',
  access_token_secret:  'zlJmQ8kyDshxxx0xMT8SlhICILW8Z6ZoPVJjO12U9m0EH'
});

const cronSchedule = "*/10 * * * *";

const job = async () => {
  const twitParams = {
    exclude_replies: true,
    screen_name: "JustinTrudeau",
    count: 1,
    result_type: "recent",
    lang: "en",
    retweeted: false,
    tweet_mode: "extended"
  };

  const emoji = [
    "(*^v^)",
    "(>*.*)>",
    "(¯.¯)",
    "(￣-￣*)",
    "(*^.^*)",
    "(-_-;)",
    "(>w<)",
    "(#^.^#)",
  ];

  T.get(
    "statuses/user_timeline",
    twitParams,
    async function (err, data, response) {
      if(data[0].id === undefined){
	return;
      }

      const tweetId = data[0].id;

      if (db.data.tweets.includes(tweetId)) {
        //console.log(`Already tweeted: ${tweetId}`);
        return;
      }

      db.data.tweets.push(tweetId);

      await db.write();

      let tweetText = data[0].full_text;

      if(tweetText.slice(0,2).toLowerCase() == 'rt'){
      return;
      }

      tweetText = tweetText.toLowerCase();
      tweetText = tweetText.replace("more here:","");
      tweetText = tweetText.replace("here:","");
      tweetText = tweetText.replace("take a look:","");
      tweetText = tweetText.replace("tune in here:","");
      tweetText = tweetText.replaceAll("l", "w");
      tweetText = tweetText.replaceAll("r", "w");
      tweetText = tweetText.replaceAll("you", "uwu");
      tweetText = tweetText.replaceAll("ua", "uwa");
      tweetText = tweetText.replaceAll("on", "own");
      tweetText = tweetText.replaceAll("and", "awnd");

      let index1 = Math.floor(tweetText.length / 3);
      let index2 = Math.floor(tweetText.length / 4);

      tweetText =
        tweetText.slice(0, index1) +
        tweetText.slice(index1).replace(" t", " t-t");

      tweetText =
        tweetText.slice(0, index2) +
        tweetText.slice(index2).replace(" d", " d-d");

      if (tweetText[0] == "h") {
        tweetText = tweetText.replace("h", " h-h");
      }
      if (tweetText[0] == "t") {
        tweetText = tweetText.replace("t", "t-t");
      }
      if (tweetText[0] == "w") {
        tweetText = tweetText.replace("w", "w-w");
      }
      if (tweetText[0] == "d") {
        tweetText = tweetText.replace("d", "d-d");
      }

      tweetText = tweetText.replaceAll(/(?:https?|ftp):\/\/[\n\S]+/g, "");
      tweetText = tweetText.replaceAll("@", "");

      let tweetTextEmoji = tweetText.replace(
        ".",
        " " + emoji[Math.floor(Math.random() * emoji.length)] + " "
      );

      tweetTextEmoji = tweetTextEmoji.replace(
        ",",
        " " + emoji[Math.floor(Math.random() * emoji.length)] + " "
      );

      T.post("statuses/update", { status: tweetTextEmoji.slice(0, 280) });
    }
  );
};

const main = async () => {
  await db.read();
  db.data = { tweets: [] };

  switch (argv._[0]) {
    case "start-bot":
      console.log(`Starting bot on cron schedule ${cronSchedule}`);
      cron.schedule(cronSchedule, async () => {
        await job();
      });
      break;
    case "run-job":
      await job();
      break;
    default:
      console.error("Unknown / missing argument");
      process.exitCode = 1;
  }
};

main();
