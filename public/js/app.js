function renderArticles(articleArray) {
    // For each one
	$("#articles").empty();
		
	// 	// $("#articles").append("<article class='cards' data-id='" + articleArray[i]._id + "'>" + "<h4 class='pink'>Story: " + ([i + 1]) + "</h4>" + "<h4>" + articleArray[i].title + "</h4>" + "<a target='_blank' class='btn btn-sm btn-warning' href='https://www.smh.com.au/" + articleArray[i].link + "'>Check Out Article</a>" + "<button class='ml-3 btn btn-sm btn-danger'>Save Article</button>");
	// }

	// console.log("fired here: " + articleArray.image[0]);

	for (var i = 0; i < articleArray.length; i++) {
		$("#articles").append('<article class="cards" data-id="1">' + '<div class="row h-100">' + '<div class="topCard col-12">' +
		'<div class="row h-100">' + '<div class="col-3 headlineGreen h-100 p-0">' + 
		'<h5 class="pl-3 h-100 d-flex align-items-center">Story: ' + ([i + 1]) + '</h5>' + '</div>' + '<div class="col-9 h-100 p-0 ">' +
		'<p class="pl-3 h-100 d-flex blue align-items-center">' + articleArray[i].cat + '</p>' + '</div>' + '</div>' + '</div>' + '</div>' + 
		'<div class="row">' + '<div class="midCard col-12">' + '<div style="height:90px;" class="row">' +
		'<div class="col-3 imgCover h-100 p-0">' + '<img height="100%" src="' + articleArray[i].image + '">' +
		'</div>' + '<div class="col-9  h-100 p-0">' + '<h4 class="mt-2 pl-3 pr-3 hText">' + articleArray[i].title +'</h4>' + '</div>' + '</div>' +
		'<div class="row h-100">' + '<div class="col-12">' + '<p class="pText mt-2 pr-1">' + articleArray[i].snippet + '</p>' +
		'</div>' + '</div>' + '</div>' + '</div>' + '<div class="row">' + '<div class="botCard col-12 text-center">' +
		'<div class="row h-100">' + '<div class="col-6  h-100 p-0">' + '<a target="_blank" href="https://www.smh.com.au/' + articleArray[i].link + ' "><button class="btnAction btnBlue">Check Article</button></a>' +
		'</div>' + '<div class="col-6  h-100 p-0">' + '<button class="btnAction btnPink">Save Article</button>' +
		'</div>' + '</div>' + '</div>' + '</div>' + '</article>');
	}
}	

// Grab the articles as a json
$.getJSON("/articles", function(data) {
    renderArticles(data);
});

// Scrape button function on click event
$(document).on("click", "#scrape", function() {
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function(data) {
        renderArticles(data);
    });
});

// Scrape button function on click event
$(document).on("click", "#scrape", function() {
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function(data) {
        renderArticles(data);
    });
});

// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        // With that done, add the note information to the page
        .then(function(data) {
            console.log(data);
            // The title of the article
            $("#notes").append("<h2>" + data.title + "</h2>");
            // An input to enter a new title
            $("#notes").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

            // If there's a note in the article
            if (data.note) {
                // Place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
        // With that done
        .then(function(data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});