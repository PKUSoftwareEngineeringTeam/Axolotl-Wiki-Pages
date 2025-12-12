window.addEventListener('message', (event) => {
    const message = event.data;
    
    if (message && message.command === 'navigateBack') {
        console.log('Executing Back');
        window.history.back();
    }

    if (message && message.command === 'navigateForward') {
        console.log('Executing Forward');
        window.history.forward();
    }
});

window.addEventListener('click', (event) => {
    const link = event.target.closest('a');
        
    if (!link || !link.href) 
        return;

    const isLocal = (hostname) => hostname === 'localhost' || hostname === '127.0.0.1';

    if (link.hostname !== window.location.hostname) {

        if (isLocal(link.hostname) && isLocal(window.location.hostname)) {
            return;
        }

        console.log('link.hostname:', link.hostname);
        console.log('window.location.hostname:', window.location.hostname);
        
        event.preventDefault();
        console.log('Allay Preview: Intercepted external link:', link.href);

        window.parent.postMessage({ 
            command: 'openExternal', 
            url: link.href 
        }, '*');
    }
});