// Navbar color change on scroll
window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        document.getElementById('mainNav').classList.add('bg-white', 'shadow');
    } else {
        document.getElementById('mainNav').classList.remove('bg-white', 'shadow');
    }
});

// Smooth scrolling for navbar links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Typing effect
var typed = new Typed('#typed', {
    strings: ['Software Developer', 'Web Designer', 'Problem Solver'],
    typeSpeed: 100,
    backSpeed: 60,
    loop: true
});

// Show/Hide project descriptions
document.querySelectorAll('.show-description').forEach(button => {
    button.addEventListener('click', function() {
        const projectId = this.getAttribute('data-project');
        const description = document.getElementById(`${projectId}-description`);
        description.style.display = 'block';
        this.style.display = 'none';
    });
});

document.querySelectorAll('.close-description').forEach(button => {
    button.addEventListener('click', function() {
        const description = this.closest('.project-description');
        
        description.style.display = 'none';
        description.previousElementSibling.style.display = 'inline-block';
    });
});