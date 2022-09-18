var actions = {};

class Action {
  constructor(rule, num, cmd) {
    this.rule = rule;
    this.num = num;
    this.cmd = cmd;
    this.current_num = 0;
  }

  match_role(txt) {
    if (!txt) {
      return false;
    }
    return txt.match(this.rule);
  }

  extract_comment(node) {
    return node.getAttribute("data-danmaku");
  }

  execute(node) {
    let txt = this.extract_comment(node);

    if (!this.match_role(txt)) {
      return;
    }

    this.tack_action(txt);
  }

  tack_action(txt) {
    if (this.current_num >= this.num) {
      this.current_num = 0;
      this.fire(txt);
      return;
    }
    this.current_num = this.current_num + 1;
  }

  fire(txt) {
    let cmd = this.command instanceof Function ? this.command(txt) : txt;
    document.querySelector(
      "#control-panel-ctnr-box > div.chat-input-ctnr.p-relative > div:nth-child(2) > textarea"
    ).value = cmd;

    console.log(cmd);
    //#control-panel-ctnr-box > div.bottom-actions.p-relative > div > button
    document
      .querySelector(
        "#control-panel-ctnr-box > div.bottom-actions.p-relative > div > button"
      )
      .click();
  }
}

var actions = [
  new Action(/休养/, 3, "休养"),
  new Action(/修炼/, 3, "修炼"),
  new Action(/^[0-9]{5}$/, 3, (v) => v),
  new Action(/摸索/, 3, "摸索"),
  new Action(/啊|嗯/, 2, (v) => v),
];

var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    for (let nd of mutation.addedNodes)
      for (var act of actions) {
        act.execute(nd);
      }
  });
});
observer.observe(document.querySelector("#chat-items"), { childList: true });
