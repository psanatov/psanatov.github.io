const domain = window.location.hostname;
const userName = generateUserName();

function generateUserName() {
  const ts = Date.now();
  let userName = "user";
  let max = 420;

  // Not sure what's the motivation behind this,
  // but I think I cannot proceed without doing it...
  if (ts % 2 === 0) {
    max = ts / 2;

    if (max === 420) {
      console.log("Welcome to the future!");
    }
  } else if (ts % 3 === 0) {
    max = ts / 3;
  } else if (ts % 5 === 0) {
    max = ts / 5;
  }

  userName += Math.floor(Math.random() * Math.floor(max));

  return userName;
};

const jokes = [
  "I just got kicked out of Barnes and Noble for moving all their classic statistical theory books to the religious section.",
  "They call me Dirichlet because all my potential is latent and awaiting allocation.",
  "Do Neural Networks Dream of Strictly Convex Sheep?",
  "Shout out to all those algorithms creating fake Twitter accounts to follow me. You predicted I'd be cool before I was cool. #falsepositive",
  "I got this vintage Dirichlet prior at the thrift shop for like $5. There's some light updating on a few corners but otherwise it's like new.",
  "Batch algorithms: YOLO*, Online algorithms: Keep Updates and Carry On  (*You Only Learn Once).",
  "Tech joke accounts are so mainstream. I'm setting up a @DeepMLHipster account where I tweet ironically about tweeting ironically about ML."
];

function Terminal(config) {
  var term = config.el || document.getElementById("term");
  var termBuffer = config.initialMessage || "";
  var lineBuffer = config.initialLine || "";
  var cwd = config.cwd || "~/";
  var tags = config.tags || ["error", "notice", "bold", "italic"];
  var processCommand = config.cmd || false;
  var maxBufferLength = config.maxBufferLength || 8192;
  var commandHistory = [];
  var currentCommandIndex = -1;
  var maxCommandHistory = config.maxCommandHistory || 100;
  var autoFocus = config.autoFocus || false;
  var coreCmds = {
    clear: clear,
    reset: clear,
    reboot: reboot,
    whoami: whoami,
    help: help,
    info: info,
    about: info,
    email: email,
    color: color,
    joke: joke
  };

  var fauxInput = document.createElement("textarea");
  fauxInput.className = "faux-input";
  document.body.appendChild(fauxInput);
  if (autoFocus) {
    fauxInput.focus();
  }

  function getLeader() {
    return cwd + "~$ ";
  }

  function renderTerm() {
    var bell = '<span class="bell"></span>';
    var ob = termBuffer + getLeader() + lineBuffer;
    term.innerHTML = ob;
    term.innerHTML += bell;
    term.scrollTop = term.scrollHeight;
  }

  function writeToBuffer(str) {
    termBuffer += str;

    // Stop the buffer getting massive.
    if (termBuffer.length > maxBufferLength) {
      var diff = termBuffer.length - maxBufferLength;
      termBuffer = termBuffer.substr(diff);
    }
  }

  function renderStdOut(str) {
    var i = 0,
      max = tags.length;
    for (i; i < max; i++) {
      var start = new RegExp("{" + tags[i] + "}", "g");
      var end = new RegExp("{/" + tags[i] + "}", "g");
      str = str.replace(start, '<span class="' + tags[i] + '">');
      str = str.replace(end, "</span>");
    }
    return str;
  }

  // Shell functions
  function clear(argv, argc) {
    termBuffer = "";
    return "";
  }

  function reboot(argv, argc) {
    window.location.reload();
  }

  function whoami(argv, argc) {
    return "\n> {bold}{notice}" + userName + "{/notice}{/bold}\n\n";
  }

  function help(argv, argc) {

    let helpText = "";
    helpText += "\n";
    helpText += "{italic}{bold}List of available commands:{/bold}\n";

    helpText += "\n";
    helpText += "{notice}'reboot'{/notice}          - resets session \n";
    helpText += "{notice}'clear'{/notice}           - clears terminal buffer \n";
    helpText += "{notice}'reset'{/notice}           - clears terminal buffer \n";
    helpText += "{notice}'whoami'{/notice}          - who am I? \n";
    helpText += "{notice}'info'{/notice}            - some personal info about me \n";
    helpText += "{notice}'about'{/notice}           - some personal info about me \n";
    helpText += "{notice}'color [COLOR]'{/notice}   - available colors: [green, orange, white] \n";
    helpText += "{notice}'joke'{/notice}            - computer will try to tell you a joke \n";
    helpText += "\n";

    helpText += "**HINT**: You can use arrow keys to browse through command history ;-)\n";
    helpText += "\n";

    return helpText + "{/italic}";
  }

  function info(argv, argc) {
    let infoText = "";
    infoText += "\n";
    infoText += "{italic}{notice}{bold}### ABOUT ME ### {/bold}{/notice}\n";
    infoText += "\n";

    infoText += "Name: [{notice}Pavel Sanatov{/notice}] \n";

    infoText += "\n";
    infoText += "Twitter/Facebook/Instagram: [{notice}@lejvap{/notice}] \n";
    infoText += "\n";

    infoText += "Fun fact: [{notice}On the Internet of Things nobody knows you're a toaster{/notice}] \n";


    infoText += "\n";
    infoText += "If you want to see my email, type: '{notice}email{/notice}' \n";
    infoText += "\n";

    return infoText + "{/italic}";
  }

  function email(argv, argc) {
    let emailText = "{italic}";
    emailText += "\n";
    emailText += "{notice}{bold}Please, see commit history @GitHub!{/bold}\n";
    emailText += "\n";

    return emailText + "{/italic}";
  }

  function color(argv, argc) {
    if (argv.length === 2) {
      const availableColors = ["green", "orange", "white"];
      const color = argv[1];
      if (availableColors.includes(color)) {
        let termClassList = document.getElementById("term").classList;
        // termClassList = "";
        // debugger;
        // termClassList.replace("term-default", color);
        switch (color) {
          case "green":
            termClassList.replace(termClassList[1], "term-default");
            document.getElementsByClassName("bell")[0].style.background = "#0da350 !important";
            break;
          case "orange":
            termClassList.replace(termClassList[1], "term-orange");
            document.getElementsByClassName("bell")[0].style.background = "#e6aa4a !important";
            break;
          case "white":
            termClassList.replace(termClassList[1], "term-white");
            document.getElementsByClassName("bell")[0].style.background = "#fff !important";
            break;
          default:
            termClassList.replace(termClassList[1], "term-default");
            document.getElementsByClassName("bell")[0].style.background = "#0da350 !important";
        }

        return "Color has been changed!\n";
      }
    } else {
      return "{italic}{bold}Warning: cannot find desired color!{/bold}{/italic}\n";
    }
  }

  function joke(argv, argc) {
    let jokeText = "";

    const randomJokeNumber = Math.floor(Math.random() * jokes.length);
    const joke = jokes[randomJokeNumber];

    jokeText += "\n";
    jokeText += "{notice}Computer says:{/notice}\n";
    jokeText += "{italic}{bold}" + joke + "{/bold}{/italic}\n";
    jokeText += "\n";

    return jokeText;
  }


  function isCoreCommand(line) {
    if (coreCmds.hasOwnProperty(line)) {
      return true;
    }

    return false;
  }

  function coreCommand(argv, argc) {
    var cmd = argv[0];
    return coreCmds[cmd](argv, argc);
  }

  function processLine() {
    // Dispatch command
    var stdout,
      line = lineBuffer,
      argv = line.split(" "),
      argc = argv.length;

    const cmd = argv[0];

    lineBuffer += "\n";
    writeToBuffer(getLeader() + lineBuffer);
    lineBuffer = "";

    // If it's not a blank line.
    if (cmd !== "") {
      if (!isCoreCommand(cmd)) {
        // User registered command
        if (processCommand) {
          stdout = processCommand(argv, argc);
        } else {
          stdout =
            "\n{italic}{notice}{bold}" + cmd.trim() + "{/bold}{/notice}{error}: command not found!{/error}\n"
            + "Type {notice}'help'{/notice} to see list of available commands.{/italic}\n\n";
        }
      } else {
        // Execute a core command
        stdout = coreCommand(argv, argc);
      }

      // If an actual command happened.
      if (stdout === false) {
        stdout =
          "\n{italic}{notice}{bold}" + cmd.trim() + "{/bold}{/notice}{error}: command not found!{/error}\n"
          + "Type {notice}'help'{/notice} to see list of available commands.{/italic}\n\n";
      }

      stdout = renderStdOut(stdout);
      writeToBuffer(stdout);

      addLineToHistory(line);
    }

    renderTerm();
  }

  function addLineToHistory(line) {
    commandHistory.unshift(line);
    currentCommandIndex = -1;
    if (commandHistory.length > maxCommandHistory) {
      console.log("reducing command history size");
      console.log(commandHistory.length);
      var diff = commandHistory.length - maxCommandHistory;
      commandHistory.splice(commandHistory.length - 1, diff);
      console.log(commandHistory.length);
    }
  }

  function isInputKey(keyCode) {
    const inputKeyMap = [32, 190, 192, 189, 187, 220, 221, 219, 222, 186, 188, 191];

    if (inputKeyMap.indexOf(keyCode) > -1) {
      return true;
    }

    return false;
  }

  function toggleCommandHistory(direction) {
    var max = commandHistory.length - 1;
    var newIndex = currentCommandIndex + direction;

    if (newIndex < -1) newIndex = -1;
    if (newIndex >= commandHistory.length) newIndex = commandHistory.length - 1;

    if (newIndex !== currentCommandIndex) {
      currentCommandIndex = newIndex;
    }

    if (newIndex > -1) {
      // Change line to something from history.
      lineBuffer = commandHistory[newIndex];
    } else {
      // Blank line...
      lineBuffer = "";
    }
  }

  function processInput(e) {
    // TODO: Add support for `&&` in the future 
    e.preventDefault();
    fauxInput.value = "";

    if ((e.keyCode >= 48 && e.keyCode <= 90) || isInputKey(e.keyCode)) {
      if (!e.ctrlKey) {
        // Character input
        lineBuffer += e.key;
      } else {
        // Hot key input (i.e Ctrl+C)
        // TOOD: Fix Ctrl+C
        // if (e.key === "c") {
        //   lineBuffer = lineBuffer;
        //   lineBuffer = "\n";
        // }
        if (e.key === "r") {
          window.location.reload();
        }
      }
    } else if (e.keyCode === 13) {
      processLine();
    } else if (e.keyCode === 9) {
      lineBuffer += "\t";
    } else if (e.keyCode === 38) {
      toggleCommandHistory(1);
    } else if (e.keyCode === 40) {
      toggleCommandHistory(-1);
    } else if (e.key === "Backspace") {
      lineBuffer = lineBuffer.substr(0, lineBuffer.length - 1);
    }

    renderTerm();
  }

  const focusFunction = function (e) {
    fauxInput.focus();
    term.classList.add("term-default");
  };

  // TODO: If we click without listener for a click event
  // then we couldn't type anymore
  focusFunction();

  term.addEventListener("click", focusFunction);

  fauxInput.addEventListener("keydown", processInput);

  renderTerm();
}

// TODO: Not sure why we have to create new constructor,
// but without it we cannot create instance of terminal
new Terminal({
  el: document.getElementById("term"),
  cwd: domain === "" ? `<strong>${userName}@future:</strong>` : `<strong>${userName}@${domain}:</strong>`,
  initialMessage: domain === "" ? `Welcome to the future!\n` : `Welcome to ${domain}!\n`,
  autoFocus: true,
  maxBufferLength: 8192,
  maxCommandHistory: 500
});