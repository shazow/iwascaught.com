/* core.js - iwascaught.com core javascript functions */

API_URL = "http://ajax.googleapis.com/ajax/services/search/web?v=1.0&callback=?"

function do_query() {
    var name = $("#name").val();
    var query = "\"" + name + " was caught\"";
    var target_url = API_URL + "&q=" + query;
    $.getJSON(target_url, function(data) { render_results(data, name) });
}

var RE_STRIP_HTML = new RegExp('<.+?>', 'g');
var RE_PERIOD = new RegExp('\\.');

function convert_content(content, name) {
    var re_name = new RegExp(name + ' was caught', 'i');
    var s = content.replace(RE_STRIP_HTML, '');
    s = s.substring(s.search(re_name));
    s = s.replace(re_name, '<strong>' + name + ' was caught</strong>');
    s = s.substring(0, s.search(RE_PERIOD));
    return s;
}

function render_results(data, name) {
    if (data.responseStatus != 200) return; // TODO: Error...

    $("#results").html("<ul></ul>");
    $.each(data.responseData.results, function(i, result) {
        console.log(name);
        $("#results ul:first").append('<li class="style' + ((i % 6) + 1 )+ '">' +  convert_content(result.content, name) + '</li>');
    });
}
