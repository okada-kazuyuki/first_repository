$(function(){
  //array.filter for not-"ecma-262" url->developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FArray%2Ffilter
  if (!Array.prototype.filter)
  {
    Array.prototype.filter = function(fun /*, thisArg */)
    {
      "use strict";

      if (this === void 0 || this === null)
        throw new TypeError();

      var t = Object(this);
      var len = t.length >>> 0;
      if (typeof fun !== "function")
        throw new TypeError();

      var res = [];
      var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
      for (var i = 0; i < len; i++)
      {
        if (i in t)
        {
          var val = t[i];

          // NOTE: Technically this should Object.defineProperty at
          //       the next index, as push can be affected by
          //       properties on Object.prototype and Array.prototype.
          //       But that method's new, and collisions should be
          //       rare, so use the more-compatible alternative.
          if (fun.call(thisArg, val, i, t))
            res.push(val);
        }
      }

      return res;
    };
  }
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
    "use strict";

    if (this == null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;

    if (len === 0) {
      return -1;
    }

    var n = 0;

    if (arguments.length > 0) {
      n = Number(arguments[1]);

      if (n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n != 0 && n != Infinity && n != -Infinity) {
         n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }

    if (n >= len) {
      return -1;
    }

    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);

    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  }
}

  var is_set = false;
  var is_running = false;
  var scale_num;
  var IntervalId;
  var history_array = [];
  var history_max = 1000;
  var history_count = 0;
  var current_history = 0;
  var gage_width = 350;

  var changeField = function(num){

    if(is_running){
      alert("動作中は変更できません");
      return;
    }
    var n = parseInt(num);
    if(isNaN(n)) {
      alert("1以上で50以下の整数でお願いします");
      return;
    }
    if(n > 50) {
      alert("50以下でお願いします");
      return;
    }

    scale_num = n;
    $("#board").html("");
    for(i=1;i <= n;i++){
      var rows = $("<tr>");
      for(v=1;v <= n;v++){
        var t = parseInt(v)+parseInt(n*(i-1));
        var cell = $("<td>").attr("id",t);
        rows.append(cell);
      }
      $("#board").append(rows);
    }
    is_set = true;
    state();
    $("#board").find("td").off("click");
    $("#board").find("td").on("click",function(){
      if(confirm_clear_history()){
        game.clearHistory();
      }
      $(this).toggleClass("alive");
    });

  }


  var game = (function(){

    var getCell = function(){
      var alive_cell = $(".alive");
      var check_cell = [];
      alive_cell.each(function(){
        var n = parseInt($(this).attr("id"));
        if(n-scale_num-1 >= 1 && (n-scale_num-1)%scale_num != 0){
          check_cell.push(n-scale_num-1);
        }
        if(n-scale_num >= 1){
          check_cell.push(n-scale_num);
        }
        if(n-scale_num+1 >= 1 && (n-scale_num+1)%scale_num != 1){
          check_cell.push(n-scale_num+1);
        }
        if(n-1 >= 1 && (n-1)%scale_num != 0){
          check_cell.push(n-1);
        }
        check_cell.push(n);
        if(n+1 >= 1 && (n+1)%scale_num != 1){
          check_cell.push(n+1);
        }
        if(n+scale_num-1 <= scale_num*scale_num && (n+scale_num-1)%scale_num != 0){
          check_cell.push(n+scale_num-1);
        }
        if(n+scale_num <= scale_num*scale_num){
          check_cell.push(n+scale_num);
        }
        if(n+scale_num+1 <= scale_num*scale_num && (n+scale_num+1)%scale_num != 1){
          check_cell.push(n+scale_num+1);
        }
      });
      var filtered_check_cell = check_cell.filter(function (x, i, self) {
        return self.indexOf(x) === i;//セルの重複を除外
      });
      return filtered_check_cell;
    }

    var setHistory = function(array){
      if(history_count === history_max){
        return;
      }
      if(history_count > history_max){
        return;
      }
      history_count++;
      history_array.push(array);
      $(".count").text(history_count);
      $(".current").text(current_history);
      current_history = history_count;
    }

    var swichGeneration = function(generation_num){
      $(".alive").removeClass("alive");
      var alive_array = history_array[generation_num];
      for(l=0;l < alive_array.length;l++){
        $("#"+alive_array[l]).attr("class","alive");
      }
    }

    var nextGeneration = function(array){
      var alive_array = [];
      var dead_array = [];
      for(i=0;i < array.length;i++){
        var n = array[i];
        var count = 0;
        if(n-scale_num-1 >= 1 && (n-scale_num-1)%scale_num != 0){
          if($("#"+(n-scale_num-1)).hasClass("alive")){
            count++;
          }
        }
        if(n-scale_num >= 1){
          if($("#"+(n-scale_num)).hasClass("alive")){
            count++;
          }
        }
        if(n-scale_num+1 >= 1 && (n-scale_num+1)%scale_num != 1){
          if($("#"+(n-scale_num+1)).hasClass("alive")){
            count++;
          }
        }
        if(n-1 >= 1 && (n-1)%scale_num != 0){
          if($("#"+(n-1)).hasClass("alive")){
            count++;
          }
        }
        if(n+1 >= 1 && (n+1)%scale_num != 1){
          if($("#"+(n+1)).hasClass("alive")){
            count++;
          }
        }
        if(n+scale_num-1 <= scale_num*scale_num && (n+scale_num-1)%scale_num != 0){
          if($("#"+(n+scale_num-1)).hasClass("alive")){
            count++;
          }
        }
        if(n+scale_num <= scale_num*scale_num){
          if($("#"+(n+scale_num)).hasClass("alive")){
            count++;
          }
        }
        if(n+scale_num+1 <= scale_num*scale_num && (n+scale_num+1)%scale_num != 1){
          if($("#"+(n+scale_num+1)).hasClass("alive")){
            count++;
          }
        }
        if(count <= 1 ){
          dead_array.push(n);
        }else if(count === 2){
        }else if(count === 3){
          alive_array.push(n);
        }else{
          dead_array.push(n);
        }
      }

      for(v=0;v < dead_array.length;v++){
        $("#"+dead_array[v]).attr("class","");
      }
      for(l=0;l < alive_array.length;l++){
        $("#"+alive_array[l]).attr("class","alive");
      }
      var active_array = [];
      $(".alive").each(function(){
        var element_id = parseInt($(this).attr("id"))
        active_array.push(element_id);
      });
      setHistory(active_array);
    }

    var runGame = function(){
      if(current_history < history_count){
        current_history++;
        swichGeneration(current_history);
        $(".current").text(current_history);
      }else{
        var check_array = getCell();
        if(history_count === 0){
          var first_set = [];
          $(".alive").each(function(){
            var id_num = parseInt($(this).attr("id"));
            first_set.push(id_num);
          });
          setHistory(first_set);
        }
        nextGeneration(check_array);
      }
      follow_pinch();
    }

    var runReverse = function(){
      if(history_count === 0){
        alert("履歴がありません");
        clearInterval(IntervalId);
        is_running = false;
        state();
        return;
      }
      if(current_history === 0){
        clearInterval(IntervalId);
        is_running = false;
        state();
        return;
      }
      current_history = current_history-1;
      swichGeneration(current_history);
      $(".count").text(history_count);
      $(".current").text(current_history);
      follow_pinch();
    }

    var clearHistory = function(){
      history_array = [];
      history_count = 0;
      current_history = 0;
      $(".count").text("0");
      $(".current").text("0");
      follow_pinch();
    }

    var follow_pinch = function(){
      var pinch_pos = current_history/history_count*100;
      if(isNaN(pinch_pos)){
        $(".pinch").css("left","0").data("now",current_history);
        $(".distance").width("100%");
      }else{
        var distance_width = 100-pinch_pos;
        $(".pinch").css("left",pinch_pos+"%").data("now",current_history);
        $(".distance").width(distance_width+"%");
      }
    }

    return{
      start: function(){
        if(is_running){
          alert("動作中です");
          return;
        }
        if(!is_set){
          alert("フィールドをsetして下さい");
          return;
        }
        IntervalId = setInterval(runGame,40);
        is_running = true;
        state();
      },
      clear: function(){
        if(is_running){
          alert("動作中はクリアできません");
          return;
        }
        if(!is_set){
          alert("フィールドをsetして下さい");
          return;
        }
        clearHistory();
        $("#board").find("td").removeClass("alive").off("click").on("click",function(){
          $(this).toggleClass("alive");
        });
      },
      stop: function(){
        if(!is_running){
          alert("動作していません");
          return;
        }
        clearInterval(IntervalId);
        is_running = false;
        $(".count").text(history_count);
        $(".current").text(current_history);
        state();
      },
      reverse: function(){
        if(is_running){
          alert("動作中は作動しません");
          return;
        }
        IntervalId = setInterval(runReverse,40);
        is_running = true;
        state();
      },
      undo: function(){
        if(is_running){
          alert("動作中は作動しません");
          return;
        }
        if(current_history <= 0){
          alert("これ以上戻れましぇん");
          return;
        }
        current_history = current_history-1;
        swichGeneration(current_history);
        follow_pinch();
        $(".current").text(current_history);
      },
      clearHistory: function(){
        clearHistory();
      },go: function(num){
        if(is_running){
          alert("動作中は作動しません");
          return;
        }
        var now_number = parseInt(num);
        var now_parcent = now_number/gage_width;
        var current_num = Math.round(history_count*now_parcent);
        if(current_num < 0 || current_num === current_history ){
          return;
        }
        if(current_num > history_count){
          return;
        }
        current_history = current_num;
        swichGeneration(current_history);
        $(".current").text(current_history);
      }
    }
  })();

  var state = function(){
    if(!is_set){
      $(".state").text("フィールドをsetして下さい");
      return;
    }
    if(!is_running){
      $(".state").text("停止中");
      return;
    }
    if(is_running){
      $(".state").text("動作中");
      return;
    }
  }

  var confirm_clear_history = function(mode){
    if(current_history < history_count){
      $("#board").mouseup();
      if(confirm("セルを変更すると履歴が破棄されますが\nよろしいですか？")){
        game.clearHistory();
        return true;
      }else{
        return false;
      }
    }else if(current_history === history_count && history_count != 0){
      if(mode === "clear"){
        if(confirm("履歴も破棄されますが\nよろしいですか？")){
          game.clearHistory();
          return true;
        }else{
          return false;
        }
      }
    }else{
          return false;
    }
  }

    var follow_distance = function(num){
      var distance_width = 100-(num/gage_width*100);
      $(".distance").width(distance_width+"%");
    }

  $("#set").on("click",function(){
    changeField($("#scale").val());
  });

  $("#start").on("click",function(){
    game.start();
  });

  $("#clear").on("click",function(){
    if(confirm_clear_history("clear")){
    game.clear();
    }
  });

  $("#board").on("mousedown",function(){
    $("#board td").on("mouseleave",function(){
      $(this).toggleClass("alive");
    });
    confirm_clear_history();
  });

  $("#board").on("mouseup",function(){
    $("#board td").off("mouseleave");
  });

  $("#board").on("mouseleave",function(){
    $("#board td").off("mouseleave");
  });

  $("#stop").on("click",function(){
    game.stop();
  });

  $("#reverse").on("click",function(){
    game.reverse();
  });

  $("#undo").on("click",function(){
    game.undo();
  });

  var base_x;
  $(window).on("resize",function(){
    base_x = $(".gage").offset().left;
  }).resize();
  var change_x;
  $(".pinch").on("mousedown",function(){
    if(history_count != 0){
      $(this).on("mousemove",function(event){
        change_x = event.pageX-base_x;
        if( change_x > gage_width || change_x <= 0){return;}
          var pinch_pos = (change_x < 0)? 0 : change_x;
          $(this).css("left",pinch_pos+"px");
          game.go(change_x);
follow_distance(pinch_pos);
      });
    }
  });

  $(".pinch").on("mouseleave",function(){
    $(this).off("mousemove");
  }).on("mouseup",function(){
    $(this).off("mousemove");
  });
  state();

});
