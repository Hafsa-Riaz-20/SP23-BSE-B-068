const apiUrl = "https://jsonplaceholder.typicode.com/posts";

$(document).ready(function() {
    fetchStories();
});

function fetchStories() {
    $.ajax({
        url: apiUrl,
        method: "GET",
        success: function(data) {
            $("#stories").html("");
            data.slice(0, 5).forEach(story => {
                displayStory(story);
            });
        }
    });
}

function displayStory(story) {
    $("#stories").append(`
        <div class="story" data-id="${story.id}">
            <h3>${story.title}</h3>
            <p>${story.body}</p>
            <button class="btn btn-warning edit">Edit</button>
            <button class="btn btn-danger delete">Delete</button>
        </div>
    `);
}

$("#storyForm").submit(function(e) {
    e.preventDefault();
    const title = $("#title").val();
    const content = $("#content").val();
    const isEditing = $("#storyForm").data("editing");
    const storyId = $("#storyForm").data("storyId");

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `${apiUrl}/${storyId}` : apiUrl;

    $.ajax({
        url: url,
        method: method,
        data: JSON.stringify({ title: title, body: content, userId: 1 }),
        contentType: "application/json",
        success: function(data) {
            if (isEditing) {
                // Update the displayed story in the DOM
                const updatedStory = $(`div[data-id="${storyId}"]`);
                updatedStory.find("h3").text(data.title);
                updatedStory.find("p").text(data.body);
            } else {
                displayStory(data);
            }
            resetForm();
        }
    });
});

$(document).on("click", ".delete", function() {
    const storyId = $(this).parent().attr("data-id");

    $.ajax({
        url: `${apiUrl}/${storyId}`,
        method: "DELETE",
        success: function() {
            $(`div[data-id="${storyId}"]`).remove();
        }
    });
});

$(document).on("click", ".edit", function() {
    const storyId = $(this).parent().attr("data-id");
    const storyTitle = $(this).siblings("h3").text();
    const storyBody = $(this).siblings("p").text();

    $("#title").val(storyTitle);
    $("#content").val(storyBody);
    $("#storyForm").data("editing", true).data("storyId", storyId);
    $("#submitButton").hide(); // Hide create button
    $("#updateButton").show(); // Show update button
    $("#clearButton").show(); // Show clear button
});

$("#clearButton").click(function() {
    resetForm();
});

function resetForm() {
    $("#title").val('');
    $("#content").val('');
    $("#storyForm").removeData("editing").removeData("storyId");
    $("#submitButton").show(); // Show create button
    $("#updateButton").hide(); // Hide update button
    $("#clearButton").hide(); // Hide clear button
}
