const pageNumber = document.querySelectorAll('.page-campground');
pageNumber[1].classList.add("active");
pageNumber.forEach(btn => {
    btn.addEventListener("click", function(){
        var current = document.querySelectorAll(".pagination > .page-item > .active");
        current[0].classList.remove("active");
        this.classList.add("active");
        page = this.innerHTML;
    });
})
