// Grab the articles as a json
$.getJSON("/articles", function(data) {
    renderArticles(data);
    renderTags(data);
});

// Scrape button function on click event
$(document).on("click", "#scrape", function() {
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function(data) {
        renderArticles(data);
        renderTags(data);
    });
});

// on click function to show saved items
$(document).on("click", "#showSaved", function() {
    $.ajax({
            method: "GET",
            url: "/saved"
        }).then(function(data) {
            renderArticles(data);
            renderTags(data);
        });

    // add button active styling
    $(this).addClass("active");
    $("#showNews").removeClass("active");
    // display message Saved
    $("#msgSave").removeClass("d-none");
    $("#msgNews").addClass("d-none");
});

// Clicking on the "NEWS" Button
$(document).on("click", "#showNews", function(){
    // Get and Render All Articles
    $.getJSON("/articles", function(data) {
        renderArticles(data);
    });

    // add button active styling
    $(this).addClass("active");
    $("#showSaved").removeClass("active");
     // display message Saved
     $("#msgNews").removeClass("d-none");
     $("#msgSave").addClass("d-none");
});

// on click save button to display saved items
$(document).on("click", ".saveBtn", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    console.log("1: " + thisId);

    $.ajax({
            method: "POST",
            url: "/saved/" + thisId,
            data: {
                _id: thisId,
                saved: true
            }
        }).then(function(data) {
            // Log the response
            console.log(data);
        });

    $(this).addClass('d-none');
    $(".unsaveBtn").removeClass('d-none');
});

// on click unsave button
$(document).on("click", ".unsaveBtn", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    $.ajax({
            method: "POST",
            url: "/unsaved/" + thisId,
            data: {
                _id: thisId,
                saved: false
            }
        }).then(function(data) {
            // Log the response
            console.log(data);
        });

    $(this).addClass('d-none');
    $(".saveBtn").removeClass('d-none');
});

// HOW TO RENDER ARTICLE CARDS
function renderArticles(articleArray) {
    // For each one
	$("#articles").empty();

	for (var i = 0; i < articleArray.length; i++) {
		$("#articles").append('<article class="cards">' + '<div class="row h-100">' + '<div class="topCard col-12">' +
		'<div class="row h-100">' + '<div class="col-3 headlineGreen h-100 p-0">' + 
		'<h5 class="pl-3 h-100 d-flex align-items-center">Story: ' + ([i + 1]) + '</h5>' + '</div>' + '<div class="col-9 h-100 p-0 ">' +
		'<p class="pl-3 h-100 d-flex blue align-items-center">' + articleArray[i].cat + '</p>' + '</div>' + '</div>' + '</div>' + '</div>' + 
		'<div class="row">' + '<div class="midCard col-12">' + '<div style="height:90px;" class="row">' +
		'<div class="col-3 imgCover h-100 p-0">' + '<img height="100%" src="' + articleArray[i].image + '">' +
		'</div>' + '<div class="col-9  h-100 p-0">' + '<h4 class="mt-2 pl-3 pr-3 hText">' + articleArray[i].title +'</h4>' + '</div>' + '</div>' +
		'<div class="row h-100">' + '<div class="col-12">' + '<p class="pText mt-3 pr-1">' + articleArray[i].snippet + '</p>' +
		'</div>' + '</div>' + '</div>' + '</div>' + '<div class="row">' + '<div class="botCard col-12 text-center">' +
		'<div class="row h-100">' + '<div class="col-6  h-100 p-0">' + '<a target="_blank" href="https://www.smh.com.au/' + articleArray[i].link + ' "><button class="btnAction btnTeal">Check Article</button></a>' +
        '</div>' + '<div class="col-6  h-100 p-0">' + '<button class="btnAction btnPink saveBtn" data-id="' + articleArray[i]._id + '">Save Article</button>' + 
        '<button class="d-none btnAction btnBlue unsaveBtn" data-id="' + articleArray[i]._id + '">♥ Saved</button>' +
		'</div>' + '</div>' + '</div>' + '</div>' + '</article>');
	}
}

// Render Tags
function renderTags(articleTags) {
    // For each one
    $("#tags2").empty();
    
    console.log(articleTags[1].cat);

	for (var j = 0; j < articleTags.length; j++) {
        $("#tags2").append('<button class="btnRounded btnControl ml-3">' + articleTags[j].cat + '</button>');
	}
}	