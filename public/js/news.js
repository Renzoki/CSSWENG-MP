document.addEventListener('DOMContentLoaded', async () => {
  const container = document.querySelector('#articlesContainer');
  const paginationContainer = document.querySelector('.pagination');
  const searchInput = document.querySelector('.form-control[placeholder="Search news..."]');
  const searchButton = document.querySelector('.btn.btn-outline-secondary');
  const pageSize = 10;
  let currentPage = 1;
  let allArticles = [];
  let filteredArticles = [];

  try {
    const res = await fetch('/mainWeb/getArticleList');
    allArticles = await res.json();
    filteredArticles = [...allArticles];

    renderPage(currentPage);
    renderPagination();
  } catch (err) {
    console.error('Error fetching articles:', err);
    container.innerHTML = `<p class="text-danger">Failed to load articles. Please try again later.</p>`;
  }

  // Filter articles based on search query
  function filterArticles(query) {
    query = query.toLowerCase();
    filteredArticles = allArticles.filter(article => {
      return (
        article.title.toLowerCase().includes(query) ||
        (article.firstTextData && article.firstTextData.toLowerCase().includes(query))
      );
    });
    currentPage = 1;
    renderPage(currentPage);
    renderPagination();
  }

  // Handle button click
  searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    filterArticles(query);
  });

  // Also handle Enter key press in the search input
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      filterArticles(searchInput.value.trim());
    }
  });

  function renderPage(page) {
    container.innerHTML = '';
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageArticles = filteredArticles.slice(start, end);

    if (pageArticles.length === 0) {
      container.innerHTML = `<p class="text-muted text-center">No articles found.</p>`;
      return;
    }

    pageArticles.forEach(article => {
      const div = document.createElement('div');
      const preview = article.firstTextData
        ? article.firstTextData.slice(0, 120)
        : '';

      const formattedDate = new Date(article.publish_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const imageSrc = article.firstImageFilename || '/assets/photo_unavailable.jpg';

      div.className = "col-md-10 col-lg-8 mx-auto";

      div.innerHTML = `
        <div class="d-flex flex-column flex-md-row align-items-start border-bottom pb-4 mb-4">
          <div class="mt-3 mt-md-0 me-4">
            <img src="${imageSrc}" alt="Article Image" class="article-image">
          </div>
          <div class="flex-grow-1 me-md-4">
            <div class="d-flex align-items-center mb-2">
              <small class="text-muted">By: ${article.author}</small>
            </div>
            <a href="/ArticlePage/${article._id}" style="color: black; text-decoration: none;">
              <h5 class="fw-bold">${article.title}</h5>
            </a>
            <p class="text-muted mb-1" style="max-width: 600px;">
              ${preview}...
            </p>
            <small class="text-muted">Published ${formattedDate}</small>
          </div>
        </div>
      `;
      container.appendChild(div);
    });
  }

  function renderPagination() {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(filteredArticles.length / pageSize);

    const createPageItem = (label, page, isActive = false, isDisabled = false) => {
      const li = document.createElement('li');
      li.className = `page-item ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`;
      li.innerHTML = `<a class="page-link" href="#">${label}</a>`;
      if (!isDisabled && !isActive) {
        li.addEventListener('click', (e) => {
          e.preventDefault();
          currentPage = page;
          renderPage(currentPage);
          renderPagination();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
      return li;
    };

    // Previous
    paginationContainer.appendChild(
      createPageItem('Previous', currentPage - 1, false, currentPage === 1)
    );

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
    }

    if (startPage > 1) {
      paginationContainer.appendChild(createPageItem(1, 1));
      if (startPage > 2) {
        const dots = document.createElement('li');
        dots.className = 'page-item disabled';
        dots.innerHTML = `<span class="page-link">...</span>`;
        paginationContainer.appendChild(dots);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationContainer.appendChild(createPageItem(i, i, i === currentPage));
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const dots = document.createElement('li');
        dots.className = 'page-item disabled';
        dots.innerHTML = `<span class="page-link">...</span>`;
        paginationContainer.appendChild(dots);
      }
      paginationContainer.appendChild(createPageItem(totalPages, totalPages));
    }

    // Next
    paginationContainer.appendChild(
      createPageItem('Next', currentPage + 1, false, currentPage === totalPages)
    );
  }
});
