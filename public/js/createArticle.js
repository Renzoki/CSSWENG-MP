$(document).ready(function() {
    let blockIdCounter = 0;
    let currentSelection = null;
    let selectedBlock = null;

    // Initialize the editor
    initializeEditor();

    function initializeEditor() {
        // Add initial content block after title
        addContentBlock('text');
        
        // Bind events
        bindEvents();
        
        // Focus on title input
        $('#titleInput').focus();
    }

    function bindEvents() {
        // Title input events
        $('#titleInput, #authorInput').on('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if ($(this).is('#titleInput')) {
                    $('#authorInput').focus();
                } else {
                    // Focus on first content block
                    const firstBlock = $('#contentBlocks .content-block:first');
                    if (firstBlock.length) {
                        focusBlock(firstBlock);
                    }
                }
            }
        });

        // Back button
        $('#backBtn').on('click', function() {
            $('#saveDraftModal').modal('show');
        });

        // Draft button
        $('#draftBtn').on('click', function() {
            saveDraft();
        });

        // Publish button
        $('#publishBtn').on('click', function() {
            showPublishPreview();
        });

        // Modal confirmations
        $('#confirmSaveDraft').on('click', function() {
            saveDraft(true); // true for redirect after save
        });

        $('#confirmPublish').on('click', function() {
            publishArticle();
        });

        // Format toolbar
        $('.format-toolbar [data-command]').on('click', function() {
            const command = $(this).data('command');
            executeCommand(command);
        });

        $('#linkBtn').on('click', function() {
            insertLink();
        });

        // Image input
        $('#imageInput').on('change', function() {
            const file = this.files[0];
            if (file && selectedBlock) {
                uploadImage(file, selectedBlock);
            }
        });

        // Hide toolbar when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.format-toolbar, .editable-content').length) {
                hideFormatToolbar();
            }
        });

        // Handle text selection
        $(document).on('mouseup keyup', '.editable-content', function() {
            const selection = window.getSelection();
            selectedBlock = $(this).closest('.content-block');
            
            if (selection.toString().length > 0 && selectedBlock.hasClass('text-block-container')) {
                showFormatToolbar();
            } else {
                hideFormatToolbar();
            }
        });
    }

    function addContentBlock(type, content = '', insertAfter = null) {
        blockIdCounter++;
        const blockId = `block-${blockIdCounter}`;
        let blockHtml = '';

        if (type === 'text') {
            blockHtml = `
                <div class="content-block text-block-container" data-id="${blockId}">
                    <div class="block-controls">
                        <button class="control-btn" title="Add Image" onclick="transformToImage($(this).closest('.content-block'))">
                            <i class="fas fa-image"></i>
                        </button>
                    </div>
                    <div class="editable-content" 
                         contenteditable="true" 
                         data-placeholder="Tell your story..."
                         data-block-id="${blockId}">${content}</div>
                </div>
            `;
        } else if (type === 'image') {
            blockHtml = `
                <div class="content-block image-block-container" data-id="${blockId}">
                    <div class="block-controls">
                        <button class="control-btn" title="Replace Image" onclick="replaceImage($(this).closest('.content-block'))">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="control-btn" title="Remove Image" onclick="removeBlock($(this).closest('.content-block'))">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="image-block">
                        ${content ? 
                            `<div class="image-container">
                                <img src="${content}" class="uploaded-image" alt="Article image">
                             </div>` : 
                            `<div class="image-placeholder" onclick="selectImage($(this).closest('.content-block'))">
                                <i class="fas fa-image"></i>
                                <p>Click to add an image</p>
                             </div>`
                        }
                    </div>
                </div>
            `;
        }

        const $block = $(blockHtml);
        
        if (insertAfter) {
            insertAfter.after($block);
        } else {
            $('#contentBlocks').append($block);
        }

        // Bind events for the new block
        bindBlockEvents($block);

        return $block;
    }

    function bindBlockEvents($block) {
        if ($block.hasClass('text-block-container')) {
            const $editable = $block.find('.editable-content');
            
            $editable.on('keydown', function(e) {
                const $this = $(this);
                
                if (e.key === 'Enter') {
                    e.preventDefault();
                    // Create new block after this one
                    const newBlock = addContentBlock('text', '', $block);
                    focusBlock(newBlock);
                }
                
                if (e.key === 'Backspace' && $this.text().trim() === '') {
                    e.preventDefault();
                    // Don't remove if it's the only block
                    if ($('#contentBlocks .content-block').length > 1) {
                        const prevBlock = $block.prev('.content-block');
                        removeBlock($block);
                        if (prevBlock.length) {
                            focusBlock(prevBlock);
                            // Move cursor to end
                            const range = document.createRange();
                            const sel = window.getSelection();
                            const editableContent = prevBlock.find('.editable-content')[0];
                            if (editableContent) {
                                range.selectNodeContents(editableContent);
                                range.collapse(false);
                                sel.removeAllRanges();
                                sel.addRange(range);
                            }
                        }
                    }
                }
            });

            $editable.on('focus', function() {
                selectedBlock = $block;
            });

            $editable.on('paste', function(e) {
                e.preventDefault();
                const text = (e.originalEvent.clipboardData || window.clipboardData).getData('text');
                document.execCommand('insertText', false, text);
            });
        }
    }

    function focusBlock($block) {
        if ($block.hasClass('text-block-container')) {
            $block.find('.editable-content').focus();
        }
    }

    function removeBlock($block) {
        $block.addClass('removing');
        setTimeout(() => {
            $block.remove();
        }, 200);
    }

    // Global functions for onclick handlers
    window.transformToImage = function($block) {
        // Transform text block to image block
        const newImageBlock = addContentBlock('image', '', $block);
        removeBlock($block);
        selectedBlock = newImageBlock;
        $('#imageInput').click();

        // Add a text block right after the new image block
        addContentBlock('text', '', newImageBlock);
    };

    window.replaceImage = function($block) {
        selectedBlock = $block;
        $('#imageInput').click();
    };

    window.removeBlock = function($block) {
        removeBlock($block);
    };

    window.selectImage = function($block) {
        selectedBlock = $block;
        $('#imageInput').click();
    };

    function transformToImage($block) {
        if ($block.hasClass('text-block-container')) {
            const newImageBlock = addContentBlock('image', '', $block);
            removeBlock($block);
            selectedBlock = newImageBlock;
            $('#imageInput').click();
        }
    }

    function uploadImage(file, $block) {
        const formData = new FormData();
        formData.append('image', file);

        // Show loading state
        const $placeholder = $block.find('.image-placeholder, .image-container');
        $placeholder.html('<i class="fas fa-spinner fa-spin"></i><p>Uploading...</p>');

        $.ajax({
            url: '/api/upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    $block.find('.image-block').html(`
                        <div class="image-container">
                            <img src="${response.imageUrl}" class="uploaded-image" alt="Article image">
                        </div>
                    `);
                    showAlert('Image uploaded successfully!', 'success');

                } else {
                    showAlert('Failed to upload image: ' + response.message, 'danger');
                    // Restore placeholder
                    $placeholder.html('<i class="fas fa-image"></i><p>Click to add an image</p>');
                }
            },
            error: function() {
                showAlert('Error uploading image. Please try again.', 'danger');
                // Restore placeholder
                $placeholder.html('<i class="fas fa-image"></i><p>Click to add an image</p>');
            }
        });
    }

    function showFormatToolbar() {
        $('.format-toolbar').addClass('show');
        updateToolbarState();
    }

    function hideFormatToolbar() {
        $('.format-toolbar').removeClass('show');
    }

    function updateToolbarState() {
        $('.format-toolbar [data-command]').removeClass('active');
        
        if (document.queryCommandState('bold')) {
            $('.format-toolbar [data-command="bold"]').addClass('active');
        }
        if (document.queryCommandState('italic')) {
            $('.format-toolbar [data-command="italic"]').addClass('active');
        }
    }

    function executeCommand(command) {
        document.execCommand(command, false, null);
        selectedBlock.find('.editable-content').focus();
        updateToolbarState();
    }

    function insertLink() {
        const url = prompt('Enter the URL:');
        if (url) {
            document.execCommand('createLink', false, url);
            selectedBlock.find('.editable-content').focus();
        }
    }

    function getArticleData() {
        const title = $('#titleInput').val().trim();
        const author = $('#authorInput').val().trim();
        const content = [];

        if (!title || !author) {
            showAlert('Please fill in both title and author fields.', 'warning');
            return null;
        }

        let order = 0;
        $('#contentBlocks .content-block').each(function() {
            const $block = $(this);
            
            if ($block.hasClass('text-block-container')) {
                const textContent = $block.find('.editable-content').html().trim();
                if (textContent) {
                    content.push({
                        type: 'text',
                        data: textContent,
                        order: order++
                    });
                }
            } else if ($block.hasClass('image-block-container')) {
                const $img = $block.find('.uploaded-image');
                if ($img.length) {
                    content.push({
                        type: 'image',
                        data: $img.attr('src'),
                        order: order++
                    });
                }
            }
        });

        if (content.length === 0) {
            showAlert('Please add some content to your article.', 'warning');
            return null;
        }

        return { title, author, content };
    }

    function saveDraft(redirect = false) {
        const articleData = getArticleData();
        if (!articleData) return;

        const $btn = $('#draftBtn');
        $btn.prop('disabled', true).addClass('loading');

        $.ajax({
            url: '/api/articles/draft',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(articleData),
            success: function(response) {
                if (response.success) {
                    showAlert('Article saved as draft!', 'success');
                    if (redirect) {
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 1000);
                    }
                } else {
                    showAlert('Failed to save draft: ' + response.message, 'danger');
                }
            },
            error: function() {
                showAlert('Error saving draft. Please try again.', 'danger');
            },
            complete: function() {
                $btn.prop('disabled', false).removeClass('loading');
                $('#saveDraftModal').modal('hide');
            }
        });
    }

    function showPublishPreview() {
        const articleData = getArticleData();
        if (!articleData) return;

        // Update preview content
        $('#previewTitle').text(articleData.title);
        $('#previewAuthor').text(`By ${articleData.author}`);

        // Find first image
        const firstImage = articleData.content.find(item => item.type === 'image');
        if (firstImage) {
            $('#previewImage').html(`<img src="${firstImage.data}" class="preview-image" alt="Article preview">`);
        } else {
            $('#previewImage').html('<i class="fas fa-image"></i><p>No image selected</p>');
        }

        // Create excerpt from first text block
        const firstText = articleData.content.find(item => item.type === 'text');
        if (firstText) {
            const tempDiv = $('<div>').html(firstText.data);
            const plainText = tempDiv.text();
            const excerpt = plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
            $('#previewExcerpt').text(excerpt);
        } else {
            $('#previewExcerpt').text('No content preview available.');
        }

        $('#publishModal').modal('show');
    }

    function publishArticle() {
        const articleData = getArticleData();
        if (!articleData) return;

        const $btn = $('#confirmPublish');
        $btn.prop('disabled', true).addClass('loading');

        $.ajax({
            url: '/api/articles/publish',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(articleData),
            success: function(response) {
                if (response.success) {
                    showAlert('Article published successfully!', 'success');
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);
                } else {
                    showAlert('Failed to publish article: ' + response.message, 'danger');
                }
            },
            error: function() {
                showAlert('Error publishing article. Please try again.', 'danger');
            },
            complete: function() {
                $btn.prop('disabled', false).removeClass('loading');
                $('#publishModal').modal('hide');
            }
        });
    }

    function showAlert(message, type) {
        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        // Remove existing alerts
        $('.alert').remove();
        
        // Add new alert
        $('body').append(alertHtml);
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            $('.alert').alert('close');
        }, 5000);
    }
});