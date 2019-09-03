// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

document.addEventListener("DOMContentLoaded", main)

function main() {
    fetchQuotes()

}

function fetchQuotes() {
    return fetch("http://localhost:3000/quotes?_embed=likes")
    .then(response => response.json())
    .then(json => createQuotes(json))
}

function createQuotes(arrayOfQuotes){
    let ul = document.getElementById("quote-list")
    arrayOfQuotes.forEach(quote =>{
        let li = document.createElement("li")
        li.className = 'quote-card'
       

        let blockquote = document.createElement("blockquote")
        blockquote.className = 'blockquote'

        let p = document.createElement('p')
        p.className = "mb-0"
        p.innerText = quote.quote

        let footer = document.createElement("footer")
        footer.className = "blockquote-footer"
        footer.innerText = quote.author

        let br = document.createElement("br")

        let likesBtn = document.createElement("button")
        likesBtn.className = 'btn-success'
        likesBtn.innerText = "Likes:"
        likesBtn.addEventListener("click",addLikes(quote))

        let span = document.createElement('span')
        span.innerText = quote.likes.length
        span.id = quote.id

        let deleteBtn = document.createElement("button")
        deleteBtn.className = 'btn-danger'
        deleteBtn.innerText = "Delete"
        deleteBtn.addEventListener("click",deleteQuote(quote))

        blockquote.appendChild(p)
        blockquote.appendChild(footer)
        blockquote.appendChild(br)
        blockquote.appendChild(likesBtn)
        likesBtn.appendChild(span)
        blockquote.appendChild(deleteBtn)
        li.appendChild(blockquote)
        ul.appendChild(li)
     })
}

function addLikes(quote) {
    return function(e){
        
        fetch('http://localhost:3000/likes',{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quoteId: quote.id,
            createdAt: Date.now()
        })
    })
    .then(response => response.json())
    .then(updateLikes(e,quote))
    
    }
}

function deleteQuote(quote) {
    return function(e){
        let id = quote.id
        fetch(`http://localhost:3000/quotes/${quote.id}`,{
            method: 'DELETE'
        })
        .then(document.getElementById(id).parentElement.parentElement.parentElement.remove())
    }
}

function updateLikes(quote){
    return function(e) {

    let span = document.getElementById(e.quoteId)
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(response => response.json())
    .then(quotes => {
        span.innerText = quotes[e.quoteId-1].likes.length
    })
    }
}

