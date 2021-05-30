const dragStart = function (e) {
    dragged = e.target;
    setTimeout(() => {
        this.classList.add("hide")
    }, 0)
}   
const dragEnd = function (e) {
    this.classList.remove("hide")
}   
const dragOver = function (e) {
    e.preventDefault()
}   
const dragEnter = function (e) {
    this.classList.add("hovered")
}   
const dragLeave = function (e) {
    this.classList.remove("hovered")
}   
const dragDrop = function (e) {
    e.preventDefault();
    e.target.style.background = "";
    console.log(dragged.getAttribute("card"))
    ws.send(JSON.stringify({"method": "placed", "card": dragged.getAttribute("card"), "cell": e.target.getAttribute("id`")}))
    dragged.parentNode.removeChild( dragged );
    e.target.appendChild( dragged );
    this.classList.remove("hovered")
}   