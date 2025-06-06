// Script to handle showing fixed containers when scrolling past the sixth section marker

document.addEventListener('DOMContentLoaded', () => {
    const fixedPortfolioInfo = document.getElementById('fixed-portfolio-info');
    const sixthMoveMarker = document.querySelector('.sixth-move');
    
    console.log('Scroll handler initialized');
    console.log('Fixed portfolio info:', fixedPortfolioInfo);
    console.log('Sixth move marker:', sixthMoveMarker);
    
    // Function to check if we've scrolled past an element
    function hasScrolledPast(element) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        // Consider element passed when its top is above the viewport
        return rect.top < 0;
    }
    
    // Function to handle scroll events
    function handleScroll() {
        // Get scroll position
        const scrollPosition = window.scrollY;
        
        if (sixthMoveMarker) {
            const sixthMovePosition = sixthMoveMarker.offsetTop;
            console.log('Scroll position:', scrollPosition, 'Sixth move position:', sixthMovePosition);
            
            if (scrollPosition > sixthMovePosition) {
                // User has scrolled past the sixth section marker
                if (fixedPortfolioInfo) fixedPortfolioInfo.style.display = 'block';
            } else {
                // User has not yet scrolled to the sixth section marker
                if (fixedPortfolioInfo) fixedPortfolioInfo.style.display = 'none';
            }
        }
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    setTimeout(handleScroll, 500); // Slight delay to ensure DOM is fully loaded
});
