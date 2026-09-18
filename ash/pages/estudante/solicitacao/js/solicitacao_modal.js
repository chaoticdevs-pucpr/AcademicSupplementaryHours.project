document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        lucide.createIcons();
    }

    initFileViewer();
});

let currentViewerWrapper = null;
let pinchState = null;
let panState = null;

function initFileViewer() {
    const container = document.getElementById('file-viewer-container');
    const fullscreenButton = document.getElementById('file-viewer-fullscreen');

    if (container) {
        container.style.touchAction = 'none';
        container.style.userSelect = 'none';
        container.style.webkitUserSelect = 'none';
        container.addEventListener('touchstart', handleTouchStart, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd, { passive: false });
        container.addEventListener('touchcancel', handleTouchEnd, { passive: false });
        container.addEventListener('pointerdown', handlePointerDown);
        container.addEventListener('pointermove', handlePointerMove);
        container.addEventListener('pointerup', handlePointerUp);
        container.addEventListener('pointercancel', handlePointerUp);
    }

    if (fullscreenButton) {
        fullscreenButton.addEventListener('click', toggleFullscreen);
    }
}

function handleTouchStart(event) {
    if (!currentViewerWrapper) {
        return;
    }

    if (event.touches.length === 2) {
        event.preventDefault();
        currentViewerWrapper.style.transition = 'none';
        pinchState = {
            startDistance: getDistance(event.touches[0], event.touches[1]),
            startZoom: Number(currentViewerWrapper.dataset.zoom) || 1
        };
        panState = null;
    } else if (event.touches.length === 1 && Number(currentViewerWrapper.dataset.zoom) > 1) {
        event.preventDefault();
        currentViewerWrapper.style.transition = 'none';
        panState = {
            startX: event.touches[0].clientX,
            startY: event.touches[0].clientY,
            startTx: Number(currentViewerWrapper.dataset.tx) || 0,
            startTy: Number(currentViewerWrapper.dataset.ty) || 0
        };
        currentViewerWrapper.style.cursor = 'grabbing';
    }
}

function handleTouchMove(event) {
    if (!currentViewerWrapper) {
        return;
    }

    if (pinchState && event.touches.length === 2) {
        event.preventDefault();
        const distance = getDistance(event.touches[0], event.touches[1]);
        const ratio = distance / pinchState.startDistance;
        const nextZoom = Math.min(3, Math.max(0.5, pinchState.startZoom * ratio));
        setViewerZoom(nextZoom);
    } else if (panState && event.touches.length === 1) {
        event.preventDefault();
        const dx = event.touches[0].clientX - panState.startX;
        const dy = event.touches[0].clientY - panState.startY;
        setViewerTranslation(panState.startTx + dx, panState.startTy + dy);
    }
}

function handleTouchEnd(event) {
    if (event.touches.length < 2) {
        pinchState = null;
    }
    if (event.touches.length === 0) {
        panState = null;
        if (currentViewerWrapper) {
            currentViewerWrapper.style.cursor = 'grab';
            currentViewerWrapper.style.transition = 'transform 0.14s ease-out';
        }
    }
}

function getDistance(pointA, pointB) {
    return Math.hypot(pointB.clientX - pointA.clientX, pointB.clientY - pointA.clientY);
}

function handlePointerDown(event) {
    if (!currentViewerWrapper || event.pointerType !== 'mouse' || Number(currentViewerWrapper.dataset.zoom) <= 1) {
        return;
    }
    event.preventDefault();
    currentViewerWrapper.style.transition = 'none';
    panState = {
        startX: event.clientX,
        startY: event.clientY,
        pointerId: event.pointerId,
        startTx: Number(currentViewerWrapper.dataset.tx) || 0,
        startTy: Number(currentViewerWrapper.dataset.ty) || 0
    };
    const container = document.getElementById('file-viewer-container');
    if (container) {
        container.setPointerCapture(event.pointerId);
    }
    currentViewerWrapper.style.cursor = 'grabbing';
}

function handlePointerMove(event) {
    if (!panState || event.pointerId !== panState.pointerId || !currentViewerWrapper) {
        return;
    }
    event.preventDefault();
    const dx = event.clientX - panState.startX;
    const dy = event.clientY - panState.startY;
    setViewerTranslation(panState.startTx + dx, panState.startTy + dy);
}

function handlePointerUp(event) {
    if (!panState || event.pointerId !== panState.pointerId) {
        return;
    }
    const container = document.getElementById('file-viewer-container');
    if (container) {
        container.releasePointerCapture(event.pointerId);
    }
    panState = null;
    if (currentViewerWrapper) {
        currentViewerWrapper.style.cursor = 'grab';
        currentViewerWrapper.style.transition = 'transform 0.14s ease-out';
    }
}

function openFileViewer(url, fileName, mimeType) {
    const modal = document.getElementById('file-viewer-modal');
    const contentBox = document.getElementById('file-viewer-content-box');
    const titleEl = document.getElementById('file-viewer-title');
    const container = document.getElementById('file-viewer-container');
    const downloadBtn = document.getElementById('file-viewer-download');
    const zoomInButton = document.getElementById('file-viewer-zoom-in');
    const zoomOutButton = document.getElementById('file-viewer-zoom-out');
    const rotateButton = document.getElementById('file-viewer-rotate');
    const resetButton = document.getElementById('file-viewer-reset');

    if (!modal || !container) {
        return;
    }

    const fileUrl = new URL(url, window.location.href).href;
    titleEl.textContent = fileName;
    downloadBtn.href = fileUrl;
    downloadBtn.setAttribute('download', fileName || 'arquivo');

    container.innerHTML = '';
    const loader = document.createElement('div');
    loader.className = 'absolute inset-0 flex items-center justify-center';
    loader.innerHTML = '<div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-indigo-600"></div>';
    container.appendChild(loader);

    const viewerWrapper = document.createElement('div');
    viewerWrapper.className = 'relative z-10 w-full h-full flex items-center justify-center transition-transform duration-200';
    viewerWrapper.style.transform = 'translate(0px, 0px) scale(1) rotate(0deg)';
    viewerWrapper.style.transition = 'transform 0.14s ease-out';
    viewerWrapper.style.maxWidth = '100%';
    viewerWrapper.style.maxHeight = '100%';
    viewerWrapper.style.cursor = 'grab';
    viewerWrapper.style.touchAction = 'none';
    viewerWrapper.dataset.zoom = '1';
    viewerWrapper.dataset.rotation = '0';
    viewerWrapper.dataset.tx = '0';
    viewerWrapper.dataset.ty = '0';

    if (mimeType.includes('image')) {
        const img = document.createElement('img');
        img.src = fileUrl;
        img.className = 'max-w-full max-h-full object-contain';
        img.draggable = false;
        img.style.userSelect = 'none';
        img.style.webkitUserSelect = 'none';
        img.onload = () => {
            if (loader.parentNode) loader.parentNode.removeChild(loader);
        };
        img.onerror = () => {
            loader.innerHTML = '<span class="text-sm text-red-500">Falha ao carregar imagem.</span>';
        };
        viewerWrapper.appendChild(img);
    } else {
        const iframe = document.createElement('iframe');
        iframe.src = fileUrl;
        iframe.className = 'w-full h-full border-none';
        iframe.onload = () => {
            if (loader.parentNode) loader.parentNode.removeChild(loader);
        };
        iframe.onerror = () => {
            loader.innerHTML = '<span class="text-sm text-red-500">Falha ao carregar arquivo.</span>';
        };
        viewerWrapper.appendChild(iframe);
    }

    container.appendChild(viewerWrapper);
    currentViewerWrapper = viewerWrapper;

    if (zoomInButton) {
        zoomInButton.onclick = () => changeViewerZoom(0.25);
    }
    if (zoomOutButton) {
        zoomOutButton.onclick = () => changeViewerZoom(-0.25);
    }
    if (rotateButton) {
        rotateButton.onclick = rotateViewer;
    }
    if (resetButton) {
        resetButton.onclick = resetViewerTransform;
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        contentBox.classList.remove('scale-95');
        contentBox.classList.add('scale-100');
    }, 10);
}

function changeViewerZoom(delta) {
    if (!currentViewerWrapper) {
        return;
    }
    currentViewerWrapper.style.transition = 'transform 0.14s ease-out';
    const currentZoom = Number(currentViewerWrapper.dataset.zoom) || 1;
    const nextZoom = Math.min(3, Math.max(0.5, currentZoom + delta));
    setViewerZoom(nextZoom);
}

function setViewerZoom(value) {
    if (!currentViewerWrapper) {
        return;
    }
    currentViewerWrapper.dataset.zoom = value.toString();
    const rotation = Number(currentViewerWrapper.dataset.rotation) || 0;
    const tx = Number(currentViewerWrapper.dataset.tx) || 0;
    const ty = Number(currentViewerWrapper.dataset.ty) || 0;
    currentViewerWrapper.style.transform = `translate(${tx}px, ${ty}px) scale(${value}) rotate(${rotation}deg)`;
}

function setViewerTranslation(tx, ty) {
    if (!currentViewerWrapper) {
        return;
    }
    currentViewerWrapper.dataset.tx = tx.toString();
    currentViewerWrapper.dataset.ty = ty.toString();
    const zoom = Number(currentViewerWrapper.dataset.zoom) || 1;
    const rotation = Number(currentViewerWrapper.dataset.rotation) || 0;
    currentViewerWrapper.style.transform = `translate(${tx}px, ${ty}px) scale(${zoom}) rotate(${rotation}deg)`;
}

function rotateViewer() {
    if (!currentViewerWrapper) {
        return;
    }
    currentViewerWrapper.style.transition = 'transform 0.14s ease-out';
    const currentRotation = Number(currentViewerWrapper.dataset.rotation) || 0;
    const nextRotation = (currentRotation + 90) % 360;
    currentViewerWrapper.dataset.rotation = String(nextRotation);
    const zoom = Number(currentViewerWrapper.dataset.zoom) || 1;
    const tx = Number(currentViewerWrapper.dataset.tx) || 0;
    const ty = Number(currentViewerWrapper.dataset.ty) || 0;
    currentViewerWrapper.style.transform = `translate(${tx}px, ${ty}px) scale(${zoom}) rotate(${nextRotation}deg)`;
}

function resetViewerTransform() {
    if (!currentViewerWrapper) {
        return;
    }
    currentViewerWrapper.style.transition = 'transform 0.14s ease-out';
    currentViewerWrapper.dataset.zoom = '1';
    currentViewerWrapper.dataset.rotation = '0';
    currentViewerWrapper.dataset.tx = '0';
    currentViewerWrapper.dataset.ty = '0';
    currentViewerWrapper.style.transform = 'translate(0px, 0px) scale(1) rotate(0deg)';
}

function toggleFullscreen() {
    const contentBox = document.getElementById('file-viewer-content-box');
    if (!contentBox) {
        return;
    }

    if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
    } else {
        contentBox.requestFullscreen().catch(() => {});
    }
}

function closeFileViewer() {
    const modal = document.getElementById('file-viewer-modal');
    const contentBox = document.getElementById('file-viewer-content-box');
    const container = document.getElementById('file-viewer-container');

    if (!modal || !container) {
        return;
    }

    modal.classList.add('opacity-0');
    contentBox.classList.remove('scale-100');
    contentBox.classList.add('scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
        container.innerHTML = '';
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }
        document.body.style.overflow = '';
        currentViewerWrapper = null;
        pinchState = null;
    }, 300);
}
