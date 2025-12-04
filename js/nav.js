window.addEventListener('scroll', function () {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

function makeDraggable(element, onClick, onDragEnd) {
    if (!element) return;

    let isDragging = false;
    let hasMoved = false;
    let startX, startY, initialLeft, initialTop;

    const onStart = (e) => {
        if (e.type === 'mousedown' && e.button !== 0) return;

        isDragging = true;
        hasMoved = false;
        element.classList.add('dragging');

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        startX = clientX;
        startY = clientY;

        const rect = element.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        if (!e.touches) {
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onEnd);
        }
    };

    const onMove = (e) => {
        if (!isDragging) return;
        if (e.cancelable) e.preventDefault();

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;

        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            hasMoved = true;
        }

        let newLeft = initialLeft + deltaX;
        let newTop = initialTop + deltaY;

        const maxLeft = window.innerWidth - element.offsetWidth;
        const maxTop = window.innerHeight - element.offsetHeight;
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        element.style.left = `${newLeft}px`;
        element.style.top = `${newTop}px`;
        element.style.bottom = 'auto';
        element.style.right = 'auto';
    };

    const onEnd = (e) => {
        if (!isDragging) return;
        if (e.type === 'mouseup') return;

        isDragging = false;
        element.classList.remove('dragging');

        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);

        if (!hasMoved && onClick) {
            onClick();
        }
        if (hasMoved && onDragEnd) {
            onDragEnd(element.style.left, element.style.top);
        }
    };

    element.addEventListener('mousedown', onStart);
    element.addEventListener('touchstart', onStart, { passive: false });
    element.addEventListener('touchmove', onMove, { passive: false });
    element.addEventListener('touchend', onEnd);

    element.addEventListener('click', (e) => {
        if (hasMoved) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
}


function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let theme = savedTheme || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', theme);

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.checked = theme === 'dark';
    }
    const floatBtn = document.getElementById('floating-theme-btn');
    if (floatBtn) {
        const savedPos = localStorage.getItem('floatBtnPos');
        if (savedPos) {
            try {
                const { left, top } = JSON.parse(savedPos);
                const maxLeft = window.innerWidth - 50;
                const maxTop = window.innerHeight - 50;

                if (parseInt(left) < maxLeft && parseInt(top) < maxTop) {
                    floatBtn.style.left = left;
                    floatBtn.style.top = top;
                    floatBtn.style.bottom = 'auto'; 
                    floatBtn.style.right = 'auto';
                }
            } catch (e) {
                console.error('error on parsing floatBtnPos', e);
            }
        }

        makeDraggable(
            floatBtn,
            toggleTheme, // 点击回调
            (left, top) => { // 拖拽结束回调
                localStorage.setItem('floatBtnPos', JSON.stringify({ left, top }));
            }
        );
    }
}



window.addEventListener('DOMContentLoaded', initTheme);

document.getElementById('theme-toggle').addEventListener('change', toggleTheme);


window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);

        const toggle = document.getElementById('theme-toggle');
        toggle.checked = newTheme === 'dark';
    }
});
