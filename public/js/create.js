let pageCount = 1;

function addNewPage() {
    pageCount++;
    const pagesContainer = document.getElementById('pagesContainer');
    const newPage = document.createElement('div');
    newPage.className = 'page-with-handle';
    newPage.innerHTML = `
                <div class="page-editor">
                    <div class="page-content" contenteditable="true">
                        Start editing your new page here...
                    </div>
                </div>
                <div class="drag-handle">☰</div>
            `;
    pagesContainer.appendChild(newPage);
}

// Initialize drag-and-drop
document.addEventListener('DOMContentLoaded', function () {
    new Sortable(document.getElementById('pagesContainer'), {
        handle: '.drag-handle',
        animation: 150,
        ghostClass: 'drag-ghost',
        onStart: function () {
            document.querySelectorAll('.drag-handle').forEach(h => {
                h.style.color = '#555';
            });
        },
        onEnd: function () {
            document.querySelectorAll('.drag-handle').forEach(h => {
                h.style.color = '#999';
            });
        }
    });
});