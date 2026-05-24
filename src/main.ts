import '@fontsource-variable/chivo-mono/wght.css';
import '@fontsource/sniglet';
import '@fontsource-variable/martian-mono';

import './styles/index.css'
import './icons'

import {
    compressToEncodedURIComponent,
    decompressFromEncodedURIComponent,
} from 'lz-string'

const textarea = document.querySelector('#text') as HTMLTextAreaElement

let settings = [0, 0, 0] // [header, footer, disabled], 1 = true

const params = new URLSearchParams(location.search)
const settingsParam = params.get('s')

if (settingsParam) {
    const decoded = JSON.parse(atob(settingsParam))
    console.log(decoded)
    settings = decoded.map(Number)
}

if (!settings[0]) { // header
    document.querySelector('header')?.classList.remove('heightless')
}

if (!settings[1]) { // footer
    document.querySelector('footer')?.classList.remove('heightless')
}

if (settings[2]) {
    document.querySelector('textarea')!.disabled = true
}

document.querySelector('#copy')?.addEventListener('click', () => {
    const compressed = compressToEncodedURIComponent(textarea.value)
    // history.pushState(null, "", `#${compressed}`)
    
    // navigator.clipboard.writeText(`${location.href.split('#')[0]}#${compressed}`)
    open(`${location.href.split('#')[0]}#${compressed}`, '_blank')
})

document.querySelector('#hide-top')?.addEventListener('click', () => {
    const classes = document.querySelector('header')?.classList!
    classes.toggle('heightless')
    settings[0] = 1 - settings[0]!

    pushSettings()
})
document.querySelector('#hide-bottom')?.addEventListener('click', () => {
    const classes = document.querySelector('footer')?.classList!
    classes.toggle('heightless')
    settings[1] = 1 - settings[1]!

    pushSettings()
})
document.querySelector('#disable-input')?.addEventListener('click', () => {
    const ta = document.querySelector('textarea')!
    ta.disabled = !ta.disabled
    settings[2] = 1 - settings[1]!

    pushSettings()
})

const hash = location.hash.slice(1)
if (hash) {
    const content = decompressFromEncodedURIComponent(hash)
    
    const sr = document.createElement('script')
    sr.innerHTML = `
    delete localStorage;
    delete document.cookie;
    delete indexedDB;
    delete sessionStorage;
    `
    document.head.appendChild(sr)
    
    document.querySelector('html')!.innerHTML = content;

    const st = document.createElement('style')
    st.innerHTML = `html>body:before {
        display: block;
        position: fixed;
        left: 0;
        bottom: 0;
        content: 'this is a client-sided dynamically rendered page using clientside.page - no data is stored on the server.';
        font-size: 0.7em;
        color: #333;
        max-width: 100vw;
        white-space: normal;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }`
    document.head.appendChild(st)
}

function pushSettings() {
    history.pushState(null, "", `?s=${btoa(JSON.stringify(settings))}#${location.hash.replace(/^#/, "")}`)
}