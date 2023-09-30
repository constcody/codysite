var count = 1


var click = false
function demo() {
  if (click) return
  document.getElementById('demo' + count++)
    .classList.toggle('hover')

}

function demo2() {
  if (click) return
  document.getElementById('demo2')
    .classList.toggle('hover')
}

function reset() {
  count = 1
  var hovers = document.querySelectorAll('.hover')
  for (var i = 0; i < hovers.length; i++) {
    hovers[i].classList.remove('hover')
  }
}

document.addEventListener('mouseover', function () {
  mousein = true
  reset()
})

