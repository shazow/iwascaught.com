/* core.js - iwascaught.com core javascript functions */

API_URL = "http://ajax.googleapis.com/ajax/services/search/web?v=1.0&rsz=large&callback=?"

function do_query(name) {
    var query = "\"" + name + " was caught\"";
    var target_url = API_URL + "&q=" + query;
    $.getJSON(target_url, function(data) { render_results(data, name) });
}

var RE_FIX_SPACES = new RegExp('\\s+', 'g');
var RE_STRIP_HTML = new RegExp('<.+?>', 'g');
var RE_PERIOD = new RegExp('\\.');


function convert_content(content, name) {
    var re_name = new RegExp(name + '\\W+was\\W+caught');
    var s = content.toLowerCase();
    s = s.replace(RE_STRIP_HTML, '');
    s = s.replace(RE_FIX_SPACES, ' ');
    s = s.substring(s.search(re_name));
    s = s.replace(re_name, '<strong>' + name + ' was caught</strong>');
    s = s.substring(0, s.search(RE_PERIOD));
    return s;
}

function render_results(data, name) {
    if (data.responseStatus != 200) return; // TODO: Error...

    $("#results").html("<ul></ul>");
    $.each(data.responseData.results, function(i, result) {
        $("#results ul:first").append('<li class="style' + ((i % 6) + 1 )+ '">' +  convert_content(result.content, name) + '</li>');
    });
}

/* Permalinks: */

function go_permalink() {
    var name = $("#name").val();
    window.location.hash = '#' + name;
    check_hash();
}

function decode_hash(input) {
    return input.substring(1);
}

function handle_hash() {
    var name = decode_hash(window.location.hash);
    $("#name").val(name);
    do_query(name);
}

var current_hash = "";
function check_hash() {
    if (current_hash == window.location.hash) return;
    current_hash = window.location.hash;
    handle_hash();
}
setInterval("check_hash()", 200);
