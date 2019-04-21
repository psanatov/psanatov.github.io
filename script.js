const domain = "psanatov.github.io";
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
      console.log("Whale, whale, whale...");
    }
  } else if (ts % 3 === 0) {
    max = ts / 3;
  } else if (ts % 5 === 0) {
    max = ts / 5;
  }

  userName += Math.floor(Math.random() * Math.floor(max));

  return userName;
};

function Terminal(config) {
  var term = config.el || document.getElementById("term");
  var termBuffer = config.initialMessage || "";
  var lineBuffer = config.initialLine || "";
  var cwd = config.cwd || "~/";
  var tags = config.tags || ["red", "blue", "white", "bold"];
  var processCommand = config.cmd || false;
  var maxBufferLength = config.maxBufferLength || 8192;
  var commandHistory = [];
  var currentCommandIndex = -1;
  var maxCommandHistory = config.maxCommandHistory || 100;
  var autoFocus = config.autoFocus || false;
  var coreCmds = {
    clear: clear,
    reset: clear,
    reboot: reboot
  };

  var fauxInput = document.createElement("textarea");
  fauxInput.className = "faux-input";
  document.body.appendChild(fauxInput);
  if (autoFocus) {
    fauxInput.focus();
  }

  function getLeader() {
    return cwd + "$ ";
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

    //Stop the buffer getting massive.
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

  function whoamiFunc(argv, argc) {
    termBuffer = userName;
    return userName;
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
    //Dispatch command
    var stdout,
      line = lineBuffer,
      argv = line.split(" "),
      argc = argv.length;

    var cmd = argv[0];

    lineBuffer += "\n";
    writeToBuffer(getLeader() + lineBuffer);
    lineBuffer = "";

    //If it's not a blank line.
    if (cmd !== "") {
      // TODO: move to coreCmd
      if (cmd === "whoami") {
        writeToBuffer(`${userName}\n`);

        addLineToHistory(line);
      } else {
        //If the command is not registered by the core.
        if (!isCoreCommand(cmd)) {
          //User registered command
          if (processCommand) {
            stdout = processCommand(argv, argc);
          } else {
            stdout =
              "{white}{bold}" + cmd + "{/bold}{/white}: command not found\n";
          }
        } else {
          //Execute a core command
          // pass 
          stdout = coreCommand(argv, argc);
        }

        //If an actual command happened.
        if (stdout === false) {
          stdout =
            "{white}{bold}" + cmd + "{/bold}{/white}: command not found\n";
        }

        stdout = renderStdOut(stdout);
        writeToBuffer(stdout);

        addLineToHistory(line);
      }
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
    const inputKeyMap = [
      32,
      190,
      192,
      189,
      187,
      220,
      221,
      219,
      222,
      186,
      188,
      191,
      17, // ctrl
      82
    ];
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
      //Change line to something from history.
      lineBuffer = commandHistory[newIndex];
    } else {
      //Blank line...
      lineBuffer = "";
    }
  }

  function acceptInput(e) {
    e.preventDefault();

    fauxInput.value = "";

    if ((e.keyCode >= 48 && e.keyCode <= 90) || isInputKey(e.keyCode)) {
      if (!e.ctrlKey) {
        //Character input
        lineBuffer += e.key;
      } else {
        //Hot key input? I.e Ctrl+C
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

  term.addEventListener("click", function (e) {
    fauxInput.focus();
    term.classList.add("term-focus");
  });
  fauxInput.addEventListener("keydown", acceptInput);
  fauxInput.addEventListener("blur", function (e) {
    term.classList.remove("term-focus");
  });

  document.getElementById("term").style.display = "none";
  var millisecondsToWait = Math.random();

  setTimeout(function () {
    document.getElementById("loader").style.display = "none";
    document.getElementById("term").style.display = "block";
    // Whatever you want to do after the wait
  }, millisecondsToWait);
  renderTerm();


}
var myTerm = new Terminal({
  el: document.getElementById("term"),
  cwd: `${userName}@${domain}:/`,
  initialMessage: `Welcome to ${domain}!\n`
  // tags: ["red", "blue", "white", "bold"],
  // maxBufferLength: 8192,
  // maxCommandHistory: 500,
  // cmd: function(argv, argc) {
  //   console.log(argv);

  //   for (command of argv) {
  //     console.log("command: ", command);
  //     if (command == "whoami") {
  //       termBuffer = "";
  //       lineBuffer = termBuffer + getLeader() + "whoami";
  //     }
  //   }

  //   return false;
  // }
});
var mySecondTerm = new Terminal({
  el: document.getElementById("term2"),
  cwd: `${userName}@${domain}:/`,
  initialMessage: `Welcome to ${domain}!\n`
  /*
  autoFocus: false,
  tags: ['red', 'blue', 'white', 'bold'],
  maxBufferLength: 8192,
  maxCommandHistory: 500,
  cmd: function(argv, argc) {
    console.log(argv);
    return false;
  }*/
});
