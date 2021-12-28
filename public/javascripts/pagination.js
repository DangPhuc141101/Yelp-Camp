const pageNumber = document.querySelectorAll('.page-campground');
if (pageNumber[1]) {
    pageNumber[1].classList.add("active");
    pageNumber.forEach(btn => {
    btn.addEventListener("click", function(){
        var current = document.querySelectorAll(".pagination > .page-item > .active");
        current[0].classList.remove("active");
        this.classList.add("active");
    });
})
}

 
