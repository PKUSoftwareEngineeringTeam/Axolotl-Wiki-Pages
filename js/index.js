function typeWriterEffect() {
    const subtitleText = document.getElementById('data-subtitle').getAttribute('data-subtitle').trim();
    const typewriterElement = document.getElementById('typewriter-subtitle');

    let i = 0;
    const speed = 70;
    const cursor = '<span class="typing-cursor">|</span>';

    typewriterElement.innerHTML = cursor;

    function typeCharacter() {
        if (i < subtitleText.length) {
            typewriterElement.innerHTML =
                subtitleText.substring(0, i + 1) + cursor;
            i++;
            setTimeout(typeCharacter, speed);
        }
    }

    setTimeout(typeCharacter, 500);
}

document.addEventListener('DOMContentLoaded', typeWriterEffect);

function listenHeaderAndContent() {

    const header = document.querySelector('.header');
    const content = document.querySelector('.content');
    const background = document.querySelector('.background-image');

    document.addEventListener('mousemove', (e) => {
        if (e.clientY < 100) {
            header.classList.add('visible');
        } else {
            header.classList.remove('visible');
        }
    });

    header.addEventListener('mouseenter', () => {
        header.classList.add('visible');
    });

    content.addEventListener('mouseenter', () => {
        background.classList.add('deactive');
    });

    header.addEventListener('mouseleave', () => {
        header.classList.remove('visible');
    });

    content.addEventListener('mouseleave', () => {
        background.classList.remove('deactive');
    });

    document.querySelectorAll('.floating-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

document.addEventListener('DOMContentLoaded', listenHeaderAndContent);


class LeavesParticleSystem {
    constructor() {
        this.container = document.getElementById('leaves-container');
        this.leaves = [];
        this.leafImages = [];
        this.maxLeaves = 20;
        this.windForce = 0;
        this.windDirection = 1;
        this.windChangeTimer = 0;

        this.init();
        this.animate();
        this.setupResizeHandler();
        this.setupWindEffect();
    }

    async init() {
        await this.loadLeafImages();

        for (let i = 0; i < this.maxLeaves; i++) {
            this.createLeaf(i * 500);
        }
    }

    async loadLeafImages() {
        const promises = [];
        for (let i = 0; i <= 11; i++) {
            const img = new Image();
            img.src = `/images/leaf/leaf_${i}.png`;
            promises.push(new Promise((resolve) => {
                img.onload = resolve;
            }));
            this.leafImages.push(img);
        }
        await Promise.all(promises);
    }

    createLeaf(delay = 0) {
        setTimeout(() => {
            const leaf = {
                element: document.createElement('div'),
                x: Math.random() * window.innerWidth,
                y: -100,
                size: Math.random() * 5 + 15,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 2,
                speed: Math.random() * 0.5 + 0.3,
                sway: Math.random() * 2 + 1,
                swayOffset: Math.random() * Math.PI * 2,
                opacity: Math.random() * 0.4 + 0.4,
                imageIndex: Math.floor(Math.random() * this.leafImages.length),
                createdAt: Date.now()
            };

            leaf.element.className = `leaf`;
            leaf.element.style.width = `${leaf.size}px`;
            leaf.element.style.height = `${leaf.size}px`;
            leaf.element.style.opacity = leaf.opacity;
            leaf.element.style.backgroundImage = `url(${this.leafImages[leaf.imageIndex].src})`;

            this.container.appendChild(leaf.element);
            this.leaves.push(leaf);

            setTimeout(() => {
                this.removeLeaf(leaf);
            }, 30000 + Math.random() * 20000);

        }, delay);
    }

    removeLeaf(leaf) {
        const index = this.leaves.indexOf(leaf);
        if (index > -1) {
            if (leaf.element.parentNode) {
                leaf.element.remove();
            }
            this.leaves.splice(index, 1);
            this.createLeaf(1000);
        }
    }

    updateLeaves() {
        const now = Date.now();
        const time = now * 0.001;

        this.windChangeTimer--;
        if (this.windChangeTimer <= 0) {
            this.windForce = (Math.random() - 0.5) * 0.5;
            this.windDirection = Math.random() > 0.5 ? 1 : -1;
            this.windChangeTimer = Math.random() * 200 + 100;
        }

        const wind = this.windForce * this.windDirection;

        this.leaves.forEach(leaf => {
            leaf.y += leaf.speed;
            leaf.x += Math.sin(time * leaf.sway + leaf.swayOffset) * 0.5 + wind;

            leaf.rotation += leaf.rotationSpeed;

            if (leaf.x > window.innerWidth + 50) {
                leaf.x = -50;
            } else if (leaf.x < -50) {
                leaf.x = window.innerWidth + 50;
            }

            // 如果树叶落到屏幕外，重置位置
            if (leaf.y > window.innerHeight + 50) {
                leaf.y = -50;
                leaf.x = Math.random() * window.innerWidth;
            }

            // 应用变换
            leaf.element.style.transform = `
                translate(${leaf.x}px, ${leaf.y}px)
                rotate(${leaf.rotation}deg)
            `;

            // 添加轻微的浮动效果
            const floatOffset = Math.sin(time * 2 + leaf.swayOffset) * 2;
            leaf.element.style.transform += ` translateY(${floatOffset}px)`;

            // 根据高度调整透明度
            const heightRatio = leaf.y / window.innerHeight;
            leaf.element.style.opacity = leaf.opacity * (1 - heightRatio * 0.3);
        });
    }

    setupWindEffect() {
        // 监听鼠标移动来影响风
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            this.windForce = (mouseX - 0.5) * 0.8;
            this.windDirection = mouseX > 0.5 ? 1 : -1;
            this.windChangeTimer = 60;
        });

        // 触摸设备支持
        document.addEventListener('touchmove', (e) => {
            if (e.touches[0]) {
                const touchX = e.touches[0].clientX / window.innerWidth;
                this.windForce = (touchX - 0.5) * 0.8;
                this.windDirection = touchX > 0.5 ? 1 : -1;
                this.windChangeTimer = 60;
            }
        });
    }

    animate() {
        this.updateLeaves();
        requestAnimationFrame(() => this.animate());
    }

    setupResizeHandler() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // 调整所有树叶的位置，防止聚集在角落
                this.leaves.forEach(leaf => {
                    if (leaf.x > window.innerWidth) {
                        leaf.x = window.innerWidth * 0.8;
                    }
                    if (leaf.y > window.innerHeight) {
                        leaf.y = window.innerHeight * 0.8;
                    }
                });
            }, 250);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new LeavesParticleSystem();
    }, 1000);
});
