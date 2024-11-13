// Add event listeners to all buttons
document.querySelectorAll('.show-description').forEach(button => {
    button.addEventListener('click', function() {
        const projectId = this.getAttribute('data-project'); // Get the project ID (e.g., project1, project2)
        const descriptionContainer = document.getElementById(`${projectId}-description`);
        
        // Fetch the description text from the project_descriptions folder
        fetch(`text/${projectId}.txt`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load description for ${projectId}`);
                }
                return response.text();
            })
            .then(data => {
                // Display the description text in the corresponding div
                descriptionContainer.innerHTML = `
                    <p class="mt-3">${data}</p>
                    <button class="btn btn-secondary mt-2 close-description">Close Description</button>
                `;
                descriptionContainer.style.display = 'block'; // Show the description
                this.style.display = 'none'; // Hide the "Show Description" button
            })
            .catch(error => {
                descriptionContainer.innerHTML = `<p class="text-danger">Failed to load description. Please try again later.</p>`;
                descriptionContainer.style.display = 'block';
            });
    });
});

// Close description functionality
document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('close-description')) {
        const description = event.target.closest('.project-description');
        description.style.display = 'none'; // Hide the description
        description.previousElementSibling.style.display = 'inline-block'; // Show the "Show Description" button again
    }
});
