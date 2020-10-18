rray.from(document.getElementsByClassName('linkdelete')).forEach((el) => {
  el.addEventListener('click', async (e) => {
    await fetch('/api/delete', {
      method: 'POST',
      body: `{ "target": "${e.target.parentNode.parentNode.getElementsByTagName('td')[0].innerHTML}" }`,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    location.reload()
  })
})

document
  .getElementsByTagName('form')[0]
  .addEventListener('submit', async (e) => {
    e.preventDefault()
    let data
    if (document.getElementById('option').value == '') {
      data = `{ "url": "${document.getElementById('url').value}" }`
    } else {
      data = `{ "url": "${document.getElementById('url').value}", "custom": "${
        document.getElementById('option').value
      }" }`
    }
    fetch('/api/new', {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.text())
      .then((data) =>
        data == 'ERR'
          ? alert('이미 존재하는 커스텀 URL입니다!/This custom URL is already existing!')
          : (document.getElementById(
              'output'
            ).value = `${location.protocol}//${location.host}/${data}`)
      )
    document.getElementsByClassName('modal')[0].style.display = 'block'
  })
let closeModal = () => {
  document.getElementsByClassName('modal')[0].style.display = 'none'
}
let copy = () => {
  let tmp = document.createElement('textarea')
  tmp.innerHTML = document.getElementById('output').value
  document.body.appendChild(tmp)

  tmp.select()
  document.execCommand('copy')
  document.body.removeChild(tmp)

  let x = document.getElementById('snackbar')
  x.className = 'show'
  setTimeout(() => {
    x.className = x.className.replace('show', '')
  }, 3000)
}
