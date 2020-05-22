document.getElementsByTagName('form')[0].addEventListener('submit', async e => {
    e.preventDefault()
    let data
    if (document.getElementById('option').value == '') {
        data = `{ "url": "${document.getElementById('url').value}" }`
    } else {
        data = `{ "url": "${document.getElementById('url').value}", "custom": "${document.getElementById('option').value}" }`
    }
    fetch('/api/new', {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.text())
        .then(data => data == 'ERR' ? alert('이미 존재하는 커스텀 URL입니다!') : alert(`${location.protocol}//${location.host}/${data}`))
})